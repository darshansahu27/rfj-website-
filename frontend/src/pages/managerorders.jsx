import ManagerOrderManagementHeader from "../components/managerordermanagementheader";
import ManagerDashboardGreeting from "../components/managerdashboardgreeting";
import ManagerOrderSummaryCards from "../components/managerordersummarycards";
import ManagerNewOrdersHeader from "../components/managernewordersheader";
import ManagerOrderCard from "../components/managerordercard";

import { useManagerOrders } from "../components/managerordercontext";

function ManagerOrders() {
  const {
    activeOrders,
    rejectOrder,
    deliverOrder,
  } = useManagerOrders();

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerOrderManagementHeader
        onMenuClick={() => console.log("Menu clicked")}
        onProfileClick={() => console.log("Profile clicked")}
      />

      <ManagerDashboardGreeting />

      <ManagerOrderSummaryCards />

      <ManagerNewOrdersHeader />

      <div className="space-y-3 pb-6">
        {activeOrders.length === 0 ? (
          <div className="mx-4 rounded-xl border border-[#eadfce] bg-white px-4 py-10 text-center shadow-sm">
            <h3 className="font-playfair text-[18px] font-bold text-[#2b211e]">
              No Active Orders
            </h3>

            <p className="mt-1 font-jakarta text-[11px] leading-5 text-[#6b6b6b]">
              New orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <ManagerOrderCard
              key={order.orderId}
              orderId={order.orderId}
              customer={order.customer}
              status={order.status}
              items={order.items}
              payment={order.payment}
              total={order.total}
              onReject={() => rejectOrder(order.orderId)}
              onDelivered={() => deliverOrder(order.orderId)}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default ManagerOrders;