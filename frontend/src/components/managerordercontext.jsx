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

const POLLING_INTERVAL = 10000;

// Convert database status into a readable label.
const formatStatus = (status) => {
  const labels = {
    confirmed: "Confirmed",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Rejected",
  };

  return labels[status] || status || "Pending";
};

// Convert database order into the format used by manager components.
const mapOrder = (order) => ({
  id: order.id,
  orderId: order.id,
  customer: order.customer_name || order.customer || "Customer",
  phone: order.phone || "",
  status: formatStatus(order.status),
  rawStatus: order.status,
  items: order.items || [],
  payment: order.payment_method || order.payment || "",
  total: order.total_amount ?? order.total ?? 0,
  address: order.delivery_address || order.address || "",
  createdAt: order.created_at || "",
  raw: order,
});

export function ManagerOrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  const knownOrderIds = useRef(new Set());
  const hasInitialFetch = useRef(false);

  // Get Firebase authentication token.
  const getAuthHeaders = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in again.");
    }

    const token = await user.getIdToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // Fetch orders from the backend.
  const fetchOrders = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(API_URL, {
        method: "GET",
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch orders.");
      }

      const fetchedOrders = Array.isArray(result.data)
        ? result.data.map(mapOrder)
        : [];

      const currentIds = new Set(
        fetchedOrders.map((order) => order.orderId)
      );

      // Notify manager about newly received orders.
      if (hasInitialFetch.current) {
        const newOrders = fetchedOrders.filter(
          (order) => !knownOrderIds.current.has(order.orderId)
        );

        if (newOrders.length > 0) {
          setNotification({
            type: "new_order",
            order: newOrders[0],
            count: newOrders.length,
          });
        }
      }

      knownOrderIds.current = currentIds;
      hasInitialFetch.current = true;

      setOrders(fetchedOrders);
      setError("");
    } catch (err) {
      console.error("Fetch manager orders error:", err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Update an order's status through the backend.
  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      try {
        const order = orders.find(
          (item) => item.orderId === orderId
        );

        if (!order) {
          throw new Error("Order not found.");
        }

        const headers = await getAuthHeaders();

        const response = await fetch(
          `${API_URL}/${order.id}/status`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({ status }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to update order status."
          );
        }

        await fetchOrders();

        return result.data;
      } catch (err) {
        console.error("Update order status error:", err);
        setError(err.message || "Unable to update order status.");
        throw err;
      }
    },
    [orders, getAuthHeaders, fetchOrders]
  );

  // Reject orders only when their current status is Confirmed.
  const rejectOrder = useCallback(
    async (orderId) => {
      const order = orders.find(
        (item) => item.orderId === orderId
      );

      if (!order) {
        throw new Error("Order not found.");
      }

      if (order.rawStatus !== "confirmed") {
        throw new Error(
          "Only confirmed orders can be rejected."
        );
      }

      return updateOrderStatus(orderId, "cancelled");
    },
    [orders, updateOrderStatus]
  );

  // Move an order to its next permitted status.
  const advanceOrder = useCallback(
    async (orderId) => {
      const order = orders.find(
        (item) => item.orderId === orderId
      );

      if (!order) {
        throw new Error("Order not found.");
      }

      const nextStatus = {
        confirmed: "out_for_delivery",
        out_for_delivery: "delivered",
      }[order.rawStatus];

      if (!nextStatus) {
        throw new Error(
          "This order cannot be advanced further."
        );
      }

      return updateOrderStatus(orderId, nextStatus);
    },
    [orders, updateOrderStatus]
  );

  // Dismiss the new-order notification.
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Listen for Firebase authentication and periodically refresh orders.
  useEffect(() => {
    let pollingInterval;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }

      if (!user) {
        setOrders([]);
        setLoading(false);
        setError("");
        setNotification(null);
        knownOrderIds.current = new Set();
        hasInitialFetch.current = false;
        return;
      }

      setLoading(true);

      fetchOrders();

      pollingInterval = setInterval(() => {
        fetchOrders();
      }, POLLING_INTERVAL);
    });

    return () => {
      unsubscribeAuth();

      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [fetchOrders]);

  // Separate orders into manager sections.
  const activeOrders = orders.filter(
(order) =>
["confirmed", "out_for_delivery"].includes(order.rawStatus)
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
        advanceOrder,
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

// Custom hook for accessing manager order data.
export function useManagerOrders() {
  const context = useContext(ManagerOrderContext);

  if (!context) {
    throw new Error(
      "useManagerOrders must be used inside ManagerOrderProvider."
    );
  }

  return context;
}
export default ManagerOrderContext;