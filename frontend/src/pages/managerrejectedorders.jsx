import ManagerBackButton from "../components/managerbackbutton";
import ManagerOrderCard from "../components/managerordercard";

import { useManagerOrders } from "../components/managerordercontext";

function ManagerRejectedOrders() {
  const { rejectedOrders } = useManagerOrders();

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerBackButton title="Rejected Orders" />

      <section className="px-4 pt-6">
        <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
          Rejected Orders
        </h2>

        <p className="mt-1 font-jakarta text-[12px] text-[#6b6b6b]">
          View all rejected orders.
        </p>
      </section>

      <section className="mt-5 space-y-3 pb-6">
        {rejectedOrders.length === 0 ? (
          <div className="mx-4 rounded-xl border border-[#eadfce] bg-white px-4 py-8 text-center shadow-sm">
            <p className="font-playfair text-[17px] font-bold text-[#2b211e]">
              No Rejected Orders
            </p>

            <p className="mt-1 font-jakarta text-[11px] text-[#6b6b6b]">
              Rejected orders will appear here.
            </p>
          </div>
        ) : (
          rejectedOrders.map((order) => (
            <ManagerOrderCard
              key={order.orderId}
              orderId={order.orderId}
              customer={order.customer}
              status="Rejected"
              items={order.items}
              payment={order.payment}
              total={order.total}
              readOnly={true}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default ManagerRejectedOrders;