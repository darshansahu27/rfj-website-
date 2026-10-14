
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ManagerOrderContext = createContext(null);

const API_URL = "http://localhost:5000/api/orders";

function formatMoney(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatStatus(status) {
  const labels = {
    confirm: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    "out for delivery": "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Rejected",
  };

  return labels[status] || status || "Pending";
}

function getRelatedRecord(value) {
  if (Array.isArray(value)) {
    return value[0] || {};
  }

  return value || {};
}

function mapOrder(order) {
  const customer = getRelatedRecord(order.customers);
  const address = getRelatedRecord(order.addresses);
  const payments = Array.isArray(order.payments)
    ? order.payments
    : order.payments
      ? [order.payments]
      : [];

  const payment = payments[0] || {};

  const items = (order.order_items || [])
    .map((item) => `${item.item_name} x${item.quantity}`)
    .join(", ");

  return {
    // Keep the database ID for API updates.
    id: order.id,

    // Keep the human-readable order number for the UI.
    orderId: order.order_number || order.id,

    customer: customer.phone || "Customer",
    phone: customer.phone || "",
    status: formatStatus(order.status),
    rawStatus: order.status,

    items: items || "No items",
    payment: payment.payment_method
      ? `${payment.payment_method}${
          payment.payment_status
            ? ` (${payment.payment_status})`
            : ""
        }`
      : "Payment details unavailable",

    total: formatMoney(order.total_amount),
    address: [
      address.address_line,
      address.city,
      address.state,
      address.postal_code,
      address.landmark,
    ]
      .filter(Boolean)
      .join(", "),

    createdAt: order.created_at,
    raw: order,
  };
}

function ManagerOrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch orders."
        );
      }

      setOrders((result.data || []).map(mapOrder));
    } catch (err) {
      console.error("Fetch manager orders failed:", err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, status) => {
    const order = orders.find(
      (item) => item.orderId === orderId
    );

    if (!order) {
      throw new Error("Order not found in the current list.");
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${order.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update order status."
        );
      }

      // Reload the latest records from the backend.
      await fetchOrders();

      return result.data;
    } catch (err) {
      console.error("Update order status failed:", err);
      setError(err.message || "Unable to update order status.");
      throw err;
    }
  };

  const rejectOrder = async (orderId) => {
    await updateOrderStatus(orderId, "cancelled");
  };

  const deliverOrder = async (orderId) => {
    await updateOrderStatus(orderId, "delivered");
  };

  const activeOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(order.rawStatus)
  );

  const completedOrders = orders.filter(
    (order) => order.rawStatus === "delivered"
  );

  const rejectedOrders = orders.filter(
    (order) => order.rawStatus === "cancelled"
  );

  return (
    <ManagerOrderContext.Provider
      value={{
        activeOrders,
        completedOrders,
        rejectedOrders,
        rejectOrder,
        deliverOrder,
        updateOrderStatus,
        refreshOrders: fetchOrders,
        loading,
        error,
      }}
    >
      {children}
    </ManagerOrderContext.Provider>
  );
}

export function useManagerOrders() {
  const context = useContext(ManagerOrderContext);

  if (!context) {
    throw new Error(
      "useManagerOrders must be used inside ManagerOrderProvider"
    );
  }

  return context;
}

export default ManagerOrderProvider;
