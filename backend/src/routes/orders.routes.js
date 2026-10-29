
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import requireManagerOrOwner from "../middleware/requireManagerOrOwner.js";
import { randomUUID, randomBytes } from "node:crypto";

const router = express.Router();

const ACTIVE_STATUSES = [
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
];

const VALID_STATUSES = [
  ...ACTIVE_STATUSES,
  "delivered",
  "cancelled",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ORDER_DETAILS_SELECT = `
  *,
  order_items(*),
  customers(phone),
  addresses(address_line, landmark),
  payments(payment_method, payment_status, amount)
`;

// Create an order for an authenticated customer after simulated checkout.
router.post("/customer", verifyFirebaseToken, async (req, res) => {
  let createdOrderId = null;

  try {
    const firebaseUid = req.firebaseUser?.uid;
    const {
      items,
      name,
      phone,
      addressLine,
      landmark,
    } = req.body ?? {};

    const normalizedPhone = String(phone || "").replace(/\D/g, "");
    const phoneDigits =
      normalizedPhone.length === 12 && normalizedPhone.startsWith("91")
        ? normalizedPhone.slice(2)
        : normalizedPhone;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100 ||
      !/^[6-9]\d{9}$/.test(phoneDigits) ||
      typeof addressLine !== "string" ||
      addressLine.trim().length < 10 ||
      addressLine.trim().length > 500 ||
      (landmark != null &&
        (typeof landmark !== "string" || landmark.trim().length > 200))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid name, Indian mobile number, delivery address, and optional landmark.",
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty or contains too many items.",
      });
    }

    const quantityById = new Map();

    for (const item of items) {
      const id = item?.id ?? item?.menu_item_id;
      const quantity = Number(item?.quantity);

      if (
        typeof id !== "string" ||
        !UUID_REGEX.test(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more cart items are invalid.",
        });
      }

      const combinedQuantity = (quantityById.get(id) ?? 0) + quantity;

      if (combinedQuantity > 99) {
        return res.status(400).json({
          success: false,
          message: "An item's quantity cannot exceed 99.",
        });
      }

      quantityById.set(id, combinedQuantity);
    }

    // Verify the authenticated user is a registered customer.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message:
          "A registered customer account is required to place an order.",
      });
    }

    // Read the existing customer record without changing its phone number.
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("id, phone")
      .eq("id", profile.id)
      .maybeSingle();

    if (customerError) throw customerError;

    // Fetch the customer's saved address record without removed columns.
let savedAddress = null;

if (customer) {
  const { data, error } = await supabaseAdmin
    .from("addresses")
    .select("id, address_line, landmark")
    .eq("customer_id", customer.id)
    .maybeSingle();

  if (error) throw error;
  savedAddress = data;
}

    // Always use current database prices and availability.
    const menuItemIds = [...quantityById.keys()];

    const { data: menuItems, error: menuError } = await supabaseAdmin
      .from("menu_items")
      .select("id, name, price, is_available")
      .in("id", menuItemIds);

    if (menuError) throw menuError;

    if (!menuItems || menuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more cart items no longer exist. Please refresh the menu.",
      });
    }

    const unavailableItem = menuItems.find(
      (item) => !item.is_available
    );

    if (unavailableItem) {
      return res.status(409).json({
        success: false,
        message: `${unavailableItem.name} is currently unavailable. Please update your cart.`,
      });
    }

    const orderItems = menuItems.map((item) => {
      const quantity = quantityById.get(item.id);
      const unitPrice = Number(item.price);

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error(`Invalid database price for ${item.name}`);
      }

      return {
        id: randomUUID(),
        menu_item_id: item.id,
        item_name: item.name,
        unit_price_at_order: unitPrice,
        quantity,
        subtotal: Math.round(unitPrice * quantity * 100) / 100,
      };
    });

    const subtotal =
      Math.round(
        orderItems.reduce((sum, item) => sum + item.subtotal, 0) * 100
      ) / 100;

    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 0;
    const discount = 0;
    const totalAmount =
      Math.round((subtotal + gst + deliveryFee - discount) * 100) / 100;

    // Create the required customer row only if it is missing.
    // Existing customer details are never updated by checkout.
    if (!customer) {
      const { error } = await supabaseAdmin.from("customers").insert({
        id: profile.id,
        phone: phoneDigits,
      });

      if (error) {
        if (error.code === "23505") {
          return res.status(409).json({
            success: false,
            message:
              "The customer record could not be created because of a conflicting value.",
          });
        }

        throw error;
      }
    }

    const orderId = randomUUID();
    const orderNumber =
      `RFJ-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;

    const { data: createdOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        id: orderId,
        customer_id: profile.id,

        // Do not link to or modify the saved address.
        address_id: null,

        // Snapshot of the delivery details entered for this order.
delivery_address_line: addressLine.trim(),
delivery_landmark:
  typeof landmark === "string" && landmark.trim()
    ? landmark.trim()
    : null,

        order_number: orderNumber,
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total_amount: totalAmount,
        status: "confirmed",
      })
      .select(
        "id, order_number, subtotal, delivery_fee, discount, total_amount, status"
      )
      .single();

    if (orderError) throw orderError;

    createdOrderId = createdOrder.id;

    const orderItemRows = orderItems.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemRows);

    if (orderItemsError) throw orderItemsError;

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: {
        ...createdOrder,
        gst,
      },
      simulatedPayment: true,
    });
  } catch (error) {
    console.error("Customer order creation failed:", error.message);

    // Best-effort cleanup if order creation fails after the order row exists.
    if (createdOrderId) {
      const { error: cleanupError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", createdOrderId);

      if (cleanupError) {
        console.error("Order cleanup failed:", cleanupError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "We couldn't place your order. Please try again.",
    });
  }
});

// Owner Dashboard order counts
router.get("/summary", verifyFirebaseToken, async (req, res) => {
  try {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("firebase_uid", req.firebaseUser.uid)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile || profile.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can view the order summary.",
      });
    }

    const { count: totalOrders, error: totalError } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true });

    if (totalError) throw totalError;

    const { count: activeOrders, error: activeError } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ACTIVE_STATUSES);

    if (activeError) throw activeError;

    return res.json({
      success: true,
      summary: {
        totalOrders: totalOrders ?? 0,
        activeOrders: activeOrders ?? 0,
      },
    });
  } catch (error) {
    console.error("Unable to load order summary:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load order summary.",
    });
  }
});

// Fetch all orders for the manager order pages
router.get(
  "/",
  verifyFirebaseToken,
  requireManagerOrOwner,
  async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(ORDER_DETAILS_SELECT)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.json({
        success: true,
        data: data ?? [],
      });
    } catch (error) {
      console.error("Unable to fetch orders:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch orders.",
      });
    }
  }
);

// Fetch one order
router.get(
  "/:id",
  verifyFirebaseToken,
  requireManagerOrOwner,
  async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(ORDER_DETAILS_SELECT)
        .eq("id", req.params.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Unable to fetch order:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch order.",
      });
    }
  }
);

// Update an order status and record its history
router.patch(
  "/:id/status",
  verifyFirebaseToken,
  requireManagerOrOwner,
  async (req, res) => {
    try {
      const { status } = req.body ?? {};

      if (
        typeof status !== "string" ||
        !VALID_STATUSES.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
          allowedStatuses: VALID_STATUSES,
        });
      }

      const { data: existingOrder, error: lookupError } =
        await supabaseAdmin
          .from("orders")
          .select("id, status")
          .eq("id", req.params.id)
          .maybeSingle();

      if (lookupError) throw lookupError;

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      const updates = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "confirmed") {
        updates.accepted_at = new Date().toISOString();
      }

      if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      }

      const { data: updatedOrder, error: updateError } =
        await supabaseAdmin
          .from("orders")
          .update(updates)
          .eq("id", req.params.id)
          .select("id, order_number, status")
          .single();

      if (updateError) throw updateError;

      if (existingOrder.status !== status) {
        const { data: profile, error: profileError } =
          await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("firebase_uid", req.firebaseUser.uid)
            .maybeSingle();

        if (profileError) throw profileError;

        const { error: historyError } = await supabaseAdmin
          .from("order_status_history")
          .insert({
            id: randomUUID(),
            order_id: updatedOrder.id,
            status,
            changed_by: profile?.id ?? null,
          });

        if (historyError) {
          console.error(
            "Order updated, but status history could not be saved:",
            historyError.message
          );
        }
      }

      return res.json({
        success: true,
        message: "Order status updated successfully.",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Unable to update order status:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to update order status.",
      });
    }
  }
);

export default router;
