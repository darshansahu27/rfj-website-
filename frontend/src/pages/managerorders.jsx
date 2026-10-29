import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerBackButton from "../components/managerbackbutton";
import { useManagerOrders } from "../components/managerordercontext";

function ManagerOrders() {
  const navigate = useNavigate();
  const { activeOrders, completedOrders, rejectedOrders, loading, error } =
    useManagerOrders();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const allOrders = useMemo(
    () => [...activeOrders, ...completedOrders, ...rejectedOrders].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    ),
    [activeOrders, completedOrders, rejectedOrders]
  );

  const filteredOrders = allOrders.filter((order) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && activeOrders.some((item) => item.id === order.id)) ||
      (filter === "Completed" && order.rawStatus === "delivered") ||
      (filter === "Rejected" && order.rawStatus === "cancelled");

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      String(order.orderId).toLowerCase().includes(query) ||
      String(order.customer).toLowerCase().includes(query) ||
      String(order.phone).toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerBackButton title="Order Management" />

      <section className="mx-auto max-w-175 px-4 py-6">
        <div className="mb-5">
          <h1 className="font-playfair text-2xl font-bold text-[#2b211e]">
            All Orders
          </h1>
          <p className="mt-1 font-jakarta text-sm text-[#6b6b6b]">
            Review and track customer orders.
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by order number, customer or phone"
          className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-3 font-jakarta text-sm outline-none focus:border-[#c92f0f]"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {["All", "Active", "Completed", "Rejected"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-4 py-2 font-jakarta text-xs font-bold ${
                filter === option
                  ? "bg-[#8d1900] text-white"
                  : "bg-white text-[#5a413b] ring-1 ring-[#eadfce]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-[#6b6b6b]">Loading orders...</p>
        ) : error ? (
          <div className="mt-6 rounded-xl bg-white p-4">
            <p role="alert" className="text-sm text-red-700">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="mt-6 rounded-xl bg-white p-5 text-sm text-[#6b6b6b]">
            No orders match your selection.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-[#eadfce] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-jakarta text-sm font-bold text-[#2b211e]">
                      {order.orderId}
                    </h2>
                    <p className="mt-1 text-sm text-[#5a413b]">
                      {order.customer}
                    </p>
                    <p className="mt-1 text-xs text-[#6b6b6b]">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "Time unavailable"}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#fff3ef] px-3 py-1 text-xs font-semibold text-[#8d1900]">
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs leading-5 text-[#6b6b6b]">
                      {order.items}
                    </p>
                    <p className="mt-1 font-jakarta text-sm font-bold text-[#2b211e]">
                      {order.total}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/managerorders/${order.id}`)}
                    className="shrink-0 rounded-full bg-[#8d1900] px-4 py-2 text-xs font-bold text-white"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ManagerOrders;