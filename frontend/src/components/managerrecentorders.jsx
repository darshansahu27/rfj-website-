import { useNavigate } from "react-router-dom";
import { useManagerOrders } from "./managerordercontext";

function ManagerRecentOrders() {
  const navigate = useNavigate();

  const { activeOrders, loading, error } = useManagerOrders();

  const recentOrders = [...activeOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  return (
    <section className="mx-auto w-full max-w-150 px-4 pt-6 pb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-playfair text-[17px] font-bold text-[#2b211e]">
          Recent Active Orders
        </h2>

        <button
          type="button"
          onClick={() => navigate("/managerorders")}
          className="font-jakarta text-[10px] font-bold text-[#c92f0f]"
        >
          View All ↗
        </button>
      </div>

      {loading ? (
        <p className="rounded-xl bg-white p-4 text-sm text-[#6b6b6b]">
          Loading recent orders...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl bg-white p-4 text-sm text-red-700">
          {error}
        </p>
      ) : recentOrders.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm text-[#6b6b6b]">
          No active orders right now.
        </p>
      ) : (
        <div className="space-y-2">
          {recentOrders.map((order) => {
            const accent =
              order.rawStatus === "confirmed"
                ? "border-l-[#c92f0f]"
                : "border-l-[#ff9d2e]";

            const createdAt = order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Time unavailable";

            return (
              <div
                key={order.id}
                className={`flex min-h-16.5 items-center justify-between rounded-xl border-l-2 bg-white px-3 py-2 shadow-sm ${accent}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-jakarta text-[10px] font-bold text-[#2b211e]">
                      {order.orderId}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[#c92f0f]" />

                    <span className="font-jakarta text-[9px] font-semibold text-[#6b6b6b]">
                      {order.status}
                    </span>
                  </div>

                  <p className="mt-0.5 font-jakarta text-[11px] font-bold text-[#2b211e]">
                    {order.customer}
                  </p>

                  <p className="font-jakarta text-[8px] text-[#6b6b6b]">
                    {createdAt} · {order.items}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/managerorders/${order.id}`)
                  }
                  className="ml-3 shrink-0 rounded-full bg-[#fff3ef] px-3 py-2 font-jakarta text-[9px] font-bold text-[#c92f0f]"
                >
                  View →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ManagerRecentOrders;