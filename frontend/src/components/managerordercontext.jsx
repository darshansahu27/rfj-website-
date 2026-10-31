import supabase from "../supabase";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ManagerOrderContext = createContext(null);

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/orders`;

const POLL_INTERVAL = 10000;

function formatMoney(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatStatus(status) {
  const labels = {
    confirm: "Accepted",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    "out for delivery": "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Rejected",
  };

  return labels[status] || status || "Pending";
}

function getRelatedRecord(value) {
  if (Array.isArray(value)) return value[0] || {};
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
    id: order.id,
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
      order.delivery_address_line || address.address_line,
      order.delivery_landmark || address.landmark,
      order.delivery_city,
      order.delivery_state,
      order.delivery_postal_code,
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
  const [notification, setNotification] = useState(null);

  const knownOrderIds = useRef(null);
  const notificationTimer = useRef(null);

  const getAuthHeaders = useCallback(async (includeJson = false) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please sign in again to manage orders.");
    }

    const token = await user.getIdToken();

    return {
      Authorization: `Bearer ${token}`,
      ...(includeJson
        ? { "Content-Type": "application/json" }
        : {}),
    };
  }, []);

  const showNotification = useCallback((message) => {
    setNotification({
      id: Date.now(),
      message,
    });

    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    notificationTimer.current = setTimeout(() => {
      setNotification(null);
    }, 6000);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);

    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
      notificationTimer.current = null;
    }
  }, []);

  const fetchOrders = useCallback(
    async ({ detectNew = false } = {}) => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(API_URL, { headers });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch orders."
          );
        }

        const latestOrders = (result.data || []).map(mapOrder);
        const latestIds = new Set(
          latestOrders.map((order) => order.id)
        );

        // The first successful fetch establishes a baseline.
        // Existing orders will not trigger false notifications.
        if (knownOrderIds.current === null) {
          knownOrderIds.current = latestIds;
        } else if (detectNew) {
          const newOrders = latestOrders.filter(
            (order) => !knownOrderIds.current.has(order.id)
          );

          if (newOrders.length > 0) {
            const message =
              newOrders.length === 1
                ? `New order received! Order #${newOrders[0].orderId}`
                : `${newOrders.length} new orders received!`;

            showNotification(message);
          }

          // Remember IDs even if the list is temporarily reordered.
          for (const id of latestIds) {
            knownOrderIds.current.add(id);
          }
        } else {
          // Include any records returned by a manual refresh or
          // after changing an order's status.
          if (knownOrderIds.current) {
            for (const id of latestIds) {
              knownOrderIds.current.add(id);
            }
          }
        }

        setOrders(latestOrders);
        setError("");
      } catch (err) {
        console.error("Fetch manager orders failed:", err);
        setError(err.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders, showNotification]
  );

  
useEffect(() => {
  let intervalId;
  let realtimeChannel;
  let disposed = false;

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }

    if (realtimeChannel) {
      await supabase.removeChannel(realtimeChannel);
      realtimeChannel = undefined;
    }

    if (disposed) return;

    if (!user) {
      setOrders([]);
      setError("Please sign in again to manage orders.");
      setLoading(false);
      knownOrderIds.current = null;
      setNotification(null);
      return;
    }

    setLoading(true);
    knownOrderIds.current = null;

    // Load existing orders first, without notifications.
    await fetchOrders({ detectNew: false });

    if (disposed) return;

    // Listen for new order records.
    realtimeChannel = supabase
      .channel("manager-new-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        () => {
          // Keep using the authenticated Express API.
          fetchOrders({ detectNew: true });
        }
      )
      .subscribe((status) => {
        console.log("Manager order Realtime status:", status);
      });

    // Keep polling as a fallback.
    intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchOrders({ detectNew: true });
      }
    }, POLL_INTERVAL);
  });

  return () => {
    disposed = true;
    unsubscribe();

    if (intervalId) {
      clearInterval(intervalId);
    }

    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }

    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }
  };
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

      const headers = await getAuthHeaders(true);
      const response = await fetch(
        `${API_URL}/${order.id}/status`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update order status."
        );
      }

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
        notification,
        dismissNotification,
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
