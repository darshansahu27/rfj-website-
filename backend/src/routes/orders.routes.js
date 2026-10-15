
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import requireManagerOrOwner from "../middleware/requireManagerOrOwner.js";

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

const ORDER_DETAILS_SELECT = `
  *,
  order_items(*),
  customers(phone),
  addresses(address_line, city, state, postal_code, landmark),
  payments(payment_method, payment_status, amount)
`;

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
            id: crypto.randomUUID(),
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
