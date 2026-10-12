import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import requireManagerOrOwner from "../middleware/requireManagerOrOwner.js";

const router = express.Router();

const VALID_STATUSES = [
  "confirm",
  "preparing",
  "ready",
  "out for delivery",
  "delivered",
  "cancelled",
];

// Every order endpoint requires a valid Firebase token
// and a manager or owner role.
router.use(verifyFirebaseToken, requireManagerOrOwner);

// Shared selection for orders and related details
const ORDER_DETAILS_SELECT = `
  *,
  order_items(*),
  customers(phone),
  addresses(address_line, city, state, postal_code, landmark),
  payments(payment_method, payment_status, amount)
`;

// GET /api/orders/test
router.get("/test", async (req, res) => {
  try {
    const { count, error } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Orders table test failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to check orders.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders table is accessible.",
      existingOrders: count ?? 0,
    });
  } catch (error) {
    console.error("Orders table test failed:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// GET /api/orders
router.get("/", async (req, res) => {
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
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
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
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
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

    if (status === "confirm") {
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
});

export default router;
