import { useParams, useNavigate } from "react-router-dom";
import { useManagerOrders } from "../components/managerordercontext";
import ManagerBackButton from "../components/managerbackbutton";

function ManagerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    activeOrders,
    completedOrders,
    rejectedOrders,
    loading,
    error,
    updateOrderStatus,
  } = useManagerOrders();

  const order = [
    ...activeOrders,
    ...completedOrders,
    ...rejectedOrders,
  ].find((item) => String(item.id) === String(id));

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8f5]">
        <ManagerBackButton title="Order Details" />
        <p className="p-5 text-sm text-[#6b6b6b]">
          Loading order details...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#fff8f5]">
        <ManagerBackButton title="Order Details" />
        <section className="p-5">
          <p className="rounded-xl bg-white p-4 text-sm text-red-700">
            {error || "Order not found."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/managerorders")}
            className="mt-4 rounded-lg bg-[#8d1900] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Orders
          </button>
        </section>
      </main>
    );
  }

  const raw = order.raw || {};
  const items = raw.order_items || [];

  async function handleStatusChange(event) {
    const status = event.target.value;
    if (!status) return;

    try {
      await updateOrderStatus(order.orderId, status);
    } catch (updateError) {
      window.alert(
        updateError.message || "Unable to update order status."
      );
    }
  }

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <main className="min-h-screen bg-[#fff8f5] pb-10">
      <ManagerBackButton title="Order Details" />

      <div className="mx-auto max-w-175 space-y-4 px-4 py-5">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#8d1900]">
            ORDER NUMBER
          </p>
          <h1 className="mt-1 break-all font-playfair text-2xl font-bold text-[#2b211e]">
            {order.orderId}
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Status: {order.status}
          </p>
          <p className="mt-1 text-xs text-[#6b6b6b]">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-IN")
              : "Date unavailable"}
          </p>

          <label
            htmlFor="order-status"
            className="mt-5 block text-sm font-semibold text-[#2b211e]"
          >
            Update status
          </label>
          <select
            id="order-status"
            defaultValue=""
            onChange={handleStatusChange}
            className="mt-2 w-full rounded-lg border border-[#eadfce] bg-white p-3 text-sm"
          >
            <option value="">Choose status...</option>
            {[
              ["confirmed", "Confirmed"],
              ["preparing", "Preparing"],
              ["ready", "Ready"],
              ["out_for_delivery", "Out for Delivery"],
              ["delivered", "Delivered"],
              ["cancelled", "Rejected"],
            ]
              .filter(([value]) => value !== order.rawStatus)
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-lg font-bold text-[#2b211e]">
            Customer & Delivery
          </h2>
          <p className="mt-3 text-sm font-semibold text-[#2b211e]">
            {raw.customer_name || order.customer}
          </p>
          <p className="mt-1 text-sm text-[#5a413b]">
            {order.phone || "Phone unavailable"}
          </p>
          <p className="mt-3 text-sm text-[#5a413b]">
            {order.address || "Delivery address unavailable"}
          </p>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-lg font-bold text-[#2b211e]">
            Order Items
          </h2>

          {items.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b6b6b]">
              No item details are available.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-[#f0e5df]">
              {items.map((item, index) => (
                <div
                  key={item.id || `${item.item_name}-${index}`}
                  className="flex justify-between gap-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2b211e]">
                      {item.item_name}
                    </p>
                    <p className="mt-1 text-xs text-[#6b6b6b]">
                      {money(item.unit_price_at_order)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#2b211e]">
                    {money(
                      item.subtotal ??
                        Number(item.unit_price_at_order || 0) *
                          Number(item.quantity || 0)
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-[#f0e5df] pt-4">
            <div className="flex justify-between gap-4 font-bold text-[#8d1900]">
              <span>Total</span>
              <span>{money(raw.total_amount ?? order.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-lg font-bold text-[#2b211e]">
            Payment
          </h2>
          <p className="mt-2 text-sm text-[#5a413b]">
            {order.payment}
          </p>
        </section>
      </div>
    </main>
  );
}

export default ManagerOrderDetails;