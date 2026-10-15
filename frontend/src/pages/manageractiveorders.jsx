import ManagerBackButton from "../components/managerbackbutton";
import ManagerOrderCard from "../components/managerordercard";

import { useManagerOrders } from "../components/managerordercontext";

function ManagerActiveOrders() {
  const {
    activeOrders,
    rejectOrder,
    deliverOrder,
  } = useManagerOrders();

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerBackButton title="Active Orders" />

      <section className="px-4 pt-6">
        <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
          Active Orders
        </h2>

        <p className="mt-1 font-jakarta text-[12px] text-[#6b6b6b]">
          View all active orders.
        </p>
      </section>

      <section className="mt-5 space-y-3 pb-6">
        {activeOrders.map((order) => (
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
        ))}
      </section>
    </main>
  );
}

export default ManagerActiveOrders;