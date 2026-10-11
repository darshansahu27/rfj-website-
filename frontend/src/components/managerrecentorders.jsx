import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "#9402",
    status: "Cooking",
    customer: "Rahul Mehra",
    time: "12:45 PM",
    items: "4 Items",
    accent: "border-l-[#ff9d2e]",
  },
  {
    id: "#9405",
    status: "New Order",
    customer: "Priya Singh",
    time: "12:52 PM",
    items: "2 Items",
    accent: "border-l-[#c92f0f]",
  },
  {
    id: "#9398",
    status: "Ready to Serve",
    customer: "Amit Varma",
    time: "12:30 PM",
    items: "6 Items",
    accent: "border-l-[#ff9d2e]",
  },
];

function ManagerRecentOrders() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-8">
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

      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`flex min-h-[66px] items-center justify-between rounded-xl border-l-2 bg-white px-3 py-2 shadow-sm ${order.accent}`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-jakarta text-[10px] font-bold text-[#2b211e]">
                  {order.id}
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
                {order.time} • {order.items}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/managerorders/${order.id.replace("#", "")}`)}
              className="ml-3 shrink-0 rounded-full bg-[#fff3ef] px-3 py-2 font-jakarta text-[9px] font-bold text-[#c92f0f]"
            >
              View →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ManagerRecentOrders;