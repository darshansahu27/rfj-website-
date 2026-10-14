
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { auth } from "../firebase";
import OrderProgress from "../components/orderprogress";
import CurrentStatus from "../components/currentstatus";
import OrderDetails from "../components/orderdetails";
import DeliveryAddress from "../components/deliveryaddress";
import OrderItems from "../components/orderitems";
import PaymentSummary from "../components/paymentsummary";
import HelpSupport from "../components/helpsupport";
import TrackingHeader from "../components/trackingheader";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const user = auth.currentUser;

        if (!user) {
          setError(
            "Please sign in with the customer account used to place this order."
          );
          setOrder(null);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch(
          `${API_URL}/api/orders/track/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.order) {
          throw new Error(
            result.message || "Unable to load this order."
          );
        }

        setOrder(result.order);
        setError("");
      } catch (err) {
        // Preserve the last successfully loaded order during refresh failures.
        setError(err.message || "Unable to load order tracking.");

        if (showLoading) {
          setOrder(null);
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [id]
  );

  useEffect(() => {
    let active = true;
    let interval;

    const load = async () => {
      if (!active) return;
      await fetchOrder(true);
    };

    load();

    interval = window.setInterval(() => {
      if (active) {
        fetchOrder(false);
      }
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [fetchOrder]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8f5] px-4 py-10">
        <div className="mx-auto max-w-md text-center text-sm text-[#6f6661]">
          Loading your order details…
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fff8f5] px-4 py-10">
        <div className="mx-auto max-w-md rounded-xl bg-white p-5 shadow-sm">
          <h1 className="text-lg font-bold text-[#8d1900]">
            Unable to track order
          </h1>

          <p className="mt-2 text-sm text-[#6f6661]">
            {error || "Order details are unavailable."}
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => fetchOrder(true)}
              className="rounded-lg bg-[#b32d0f] px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>

            <Link
              to="/profile"
              className="rounded-lg border border-[#e2bfb7] px-4 py-2 text-sm font-semibold text-[#8d1900]"
            >
              My Profile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = String(order.status || "confirmed").toLowerCase();
  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";

  return (
    <main className="min-h-screen bg-[#fff8f5] px-4 py-6">
      <div className="mx-auto w-full max-w-md space-y-4">
        <TrackingHeader />

        {isDelivered ? (
          <section className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-11 w-11 text-green-700"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </div>

            <h1 className="mt-4 text-xl font-bold text-green-800">
              Your Order Has Been Delivered!
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#6f6661]">
              Your delicious food has arrived. Thank you for
              ordering from Rohit Food Junction!
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#b32d0f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8d1900]"
            >
              Continue Shopping
            </Link>
          </section>
        ) : isCancelled ? (
          <section className="rounded-xl border border-red-200 bg-white p-5">
            <h2 className="text-lg font-bold text-red-700">
              Order Cancelled
            </h2>

            <p className="mt-2 text-sm text-[#6f6661]">
              This order has been cancelled. Its tracking progress
              is no longer active.
            </p>

            <Link
              to="/menu"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#b32d0f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8d1900]"
            >
              Continue Shopping
            </Link>
          </section>
        ) : (
          <OrderProgress currentStatus={status} />
        )}

        {!isDelivered && (
          <>
            {!isCancelled && (
              <CurrentStatus currentStatus={status} />
            )}

            <OrderDetails order={order} />

            <DeliveryAddress address={order.addresses} />

            <OrderItems items={order.order_items || []} />

            <PaymentSummary order={order} />

            <HelpSupport />

            <p className="pb-2 text-center text-xs text-[#8a817c]">
              Tracking refreshes automatically every 15 seconds.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default OrderTracking;
