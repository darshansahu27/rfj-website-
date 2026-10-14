
import { randomUUID, randomBytes } from "node:crypto";
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import requireManagerOrOwner from "../middleware/requireManagerOrOwner.js";

const router = express.Router();

const VALID_STATUSES = [
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * POST /api/orders/customer
 *
 * Creates an order for an authenticated customer.
 * Prices and availability are verified using the database.
 *
 * This is simulated checkout only. It does not charge money
 * or create a payment record.
 */
router.post("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser?.uid;

    const {
      items,
      name,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      landmark,
    } = req.body ?? {};

    // Validate the delivery details.
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof phone !== "string" ||
      !/^\+91\s?[6-9]\d{4}\s?\d{5}$/.test(phone.trim()) ||
      typeof addressLine !== "string" ||
      addressLine.trim().length < 10 ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof state !== "string" ||
      !state.trim() ||
      typeof postalCode !== "string" ||
      (postalCode.trim() !== "" && !/^\d{6}$/.test(postalCode.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid name, Indian mobile number, address, city, state and 6-digit PIN code.",
      });
    }

    // Validate the cart.
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
      const itemId = item?.id ?? item?.menu_item_id;
      const quantity = Number(item?.quantity);

      if (
        typeof itemId !== "string" ||
        !UUID_REGEX.test(itemId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more cart items are invalid.",
        });
      }

      const combinedQuantity =
        (quantityById.get(itemId) ?? 0) + quantity;

      if (combinedQuantity > 99) {
        return res.status(400).json({
          success: false,
          message: "An item's quantity cannot exceed 99.",
        });
      }

      quantityById.set(itemId, combinedQuantity);
    }

    // Verify the Firebase user has a customer profile.
    const { data: profile, error: profileError } =
      await supabaseAdmin
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

    // Use the database's current menu prices and availability.
    const menuItemIds = [...quantityById.keys()];

    const { data: menuItems, error: menuError } =
      await supabaseAdmin
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
        subtotal:
          Math.round(unitPrice * quantity * 100) / 100,
      };
    });

    const subtotal =
      Math.round(
        orderItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        ) * 100
      ) / 100;

    // Current simulated checkout uses 5% GST.
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 0;
    const discount = 0;
    const totalAmount = subtotal + gst + deliveryFee - discount;

    // Find or create the customer record.
    // customers.id references profiles.id.
    const { data: existingCustomer, error: customerLookupError } =
      await supabaseAdmin
        .from("customers")
        .select("id, phone")
        .eq("id", profile.id)
        .maybeSingle();

    if (customerLookupError) throw customerLookupError;

    if (existingCustomer) {
      if (existingCustomer.phone !== phone.trim()) {
        const { error: updateCustomerError } =
          await supabaseAdmin
            .from("customers")
            .update({
              phone: phone.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);

        if (updateCustomerError) {
          if (updateCustomerError.code === "23505") {
            return res.status(409).json({
              success: false,
              message:
                "This phone number is already associated with another customer.",
            });
          }

          throw updateCustomerError;
        }
      }
    } else {
      const { error: insertCustomerError } =
        await supabaseAdmin
          .from("customers")
          .insert({
            id: profile.id,
            phone: phone.trim(),
          });

      if (insertCustomerError) {
        if (insertCustomerError.code === "23505") {
          return res.status(409).json({
            success: false,
            message:
              "This phone number is already associated with another customer.",
          });
        }

        throw insertCustomerError;
      }
    }

    // Keep the customer's profile name in sync with checkout.
    const { error: profileUpdateError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          full_name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

    if (profileUpdateError) throw profileUpdateError;

    // Find or create the delivery address.
    // The addresses.id column has no database default.
    const addressValues = {
      address_line: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      landmark:
        typeof landmark === "string" && landmark.trim()
          ? landmark.trim()
          : null,
      updated_at: new Date().toISOString(),
    };

    const { data: existingAddress, error: addressLookupError } =
      await supabaseAdmin
        .from("addresses")
        .select("id")
        .eq("customer_id", profile.id)
        .maybeSingle();

    if (addressLookupError) throw addressLookupError;

    let address;

    if (existingAddress) {
      const { data, error } = await supabaseAdmin
        .from("addresses")
        .update(addressValues)
        .eq("customer_id", profile.id)
        .select("id")
        .single();

      if (error) throw error;

      address = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("addresses")
        .insert({
          id: randomUUID(),
          customer_id: profile.id,
          ...addressValues,
        })
        .select("id")
        .single();

      if (error) throw error;

      address = data;
    }

    // Create the order.
    const orderNumber =
      `RFJ-${Date.now()}-${randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

    const orderId = randomUUID();

    const { data: createdOrder, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          id: orderId,
          customer_id: profile.id,
          address_id: address.id,
          delivery_address_line: addressLine.trim(),
          delivery_city: city.trim(),
          delivery_state: state.trim(),
          delivery_postal_code: postalCode.trim(),
          delivery_landmark: addressValues.landmark,
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

    // Save a snapshot of each item's name and price.
    const rowsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(rowsToInsert);

    if (orderItemsError) {
      // Avoid leaving an order without its items.
      const { error: cleanupError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", createdOrder.id);

      if (cleanupError) {
        console.error(
          "Order cleanup failed:",
          cleanupError.message
        );
      }

      throw orderItemsError;
    }

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

    return res.status(500).json({
      success: false,
      message: "We couldn't place your order. Please try again.",
    });
  }
});

/**
 * GET /api/orders/track/:id
 *
 * Allows an authenticated customer to view only their own order.
 */
router.get("/track/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser?.uid;
    const { id: orderId } = req.params;

    if (!UUID_REGEX.test(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, firebase_uid, role")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (profileError) {
      console.error(
        "Customer tracking profile lookup failed:",
        profileError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to verify customer profile",
      });
    }

    if (!profile || profile.role !== "customer") {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const { data: customer, error: customerError } =
      await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("id", profile.id)
        .maybeSingle();

    if (customerError) {
      console.error("Customer lookup failed:", customerError.message);

      return res.status(500).json({
        success: false,
        message: "Unable to verify customer",
      });
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          subtotal,
          delivery_fee,
          discount,
          total_amount,
          created_at,
          accepted_at,
          delivered_at,
          cancelled_at,
          order_items (
            id,
            item_name,
            unit_price_at_order,
            quantity,
            subtotal
          ),
          addresses (
            address_line,
            city,
            state,
            postal_code,
            landmark
          ),
          payments (
            payment_method,
            payment_status,
            amount
          )
        `)
        .eq("id", orderId)
        .eq("customer_id", customer.id)
        .maybeSingle();

    if (orderError) {
      console.error(
        "Customer order lookup failed:",
        orderError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load order",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Customer tracking route error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Shared selection for manager order details.
const ORDER_DETAILS_SELECT = `
  *,
  order_items(*),
  customers(phone),
  addresses(address_line, city, state, postal_code, landmark),
  payments(payment_method, payment_status, amount)
`;

/**
 * GET /api/orders
 *
 * Returns all orders.
 * Requires a valid Firebase token and a manager or owner role.
 */
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

      if (error) {
        console.error("Fetch orders error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch orders.",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Fetch orders failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

/**
 * GET /api/orders/:id
 *
 * Returns one order.
 * Requires a valid Firebase token and a manager or owner role.
 */
router.get(
  "/:id",
  verifyFirebaseToken,
  requireManagerOrOwner,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(ORDER_DETAILS_SELECT)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Get order error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Failed to retrieve order.",
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Get order failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

/**
 * PATCH /api/orders/:id/status
 *
 * Updates an order's status.
 * Requires a valid Firebase token and a manager or owner role.
 */
router.patch(
  "/:id/status",
  verifyFirebaseToken,
  requireManagerOrOwner,
  async (req, res) => {
    try {
      const { id } = req.params;
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

      const updates = { status };

      if (status === "confirmed") {
        updates.accepted_at = new Date().toISOString();
      }

      if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select("id, order_number, status")
        .maybeSingle();

      if (error) {
        console.error("Update order status error:", error.message);

        return res.status(500).json({
          success: false,
          message: "Failed to update order status.",
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        data,
      });
    } catch (error) {
      console.error("Update order status failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

export default router;
