
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";
import OwnerOrdersHeader from "../components/ownerordersheader";
import OwnerOrderCard from "../components/ownerordercard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatMoney(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatStatus(status) {
  const labels = {
    confirmed: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] || status || "Pending";
}

function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please log in again to view order history.");
      }

      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load order history.");
      }

      const fetchedOrders = Array.isArray(result.data) ? result.data : [];

      const formattedOrders = fetchedOrders.map((order) => {
        const customer = Array.isArray(order.customers)
          ? order.customers[0]
          : order.customers;

        const payments = Array.isArray(order.payments)
          ? order.payments
          : order.payments
            ? [order.payments]
            : [];

        const payment = payments[0];

        const items = (order.order_items || []).map((item) => {
          return `${item.quantity}x ${item.item_name}`;
        });

        return {
          id: order.order_number || order.id,
          customer: customer?.phone || "Customer",
          items,
          payment: payment?.payment_method || "Payment details unavailable",
          time: order.created_at
            ? new Date(order.created_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Time unavailable",
          amount: formatMoney(order.total_amount),
          status: formatStatus(order.status),
        };
      });

      setOrders(formattedOrders);
    } catch (loadError) {
      console.error("Unable to load order history:", loadError);
      setError(loadError.message || "Unable to load order history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <OwnerOrdersHeader />

      <section className="space-y-4 px-4 py-5">
        {loading && (
          <p className="text-sm text-[#8e706a]">Loading order history...</p>
        )}

        {!loading && error && (
          <div>
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-3 rounded-lg bg-[#c92f0f] px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-[#8e706a]">
            No orders found.
          </p>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <OwnerOrderCard key={order.id} order={order} />
          ))}
      </section>
    </main>
  );
}

export default OwnerOrders;
