import OwnerOrderStatus from "./ownerorderstatus";

function OwnerOrderCard({ order }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(88,42,30,0.08)]">

      {/* Order ID + Status */}
      <div className="flex items-start justify-between">

        <div>
          <p className="font-jakarta text-[11px] font-medium text-[#8e706a]">
            Order ID
          </p>

          <h2 className="mt-1 font-jakarta text-[15px] font-bold text-[#8d1900]">
            {order.id}
          </h2>
        </div>

        {/* Order Status */}
        {order.status && (
          <OwnerOrderStatus status={order.status} />
        )}

      </div>

      {/* Customer */}
      <div className="mt-4">

        <p className="font-jakarta text-[15px] font-semibold text-[#2d2926]">
          {order.customer}
        </p>

        {/* Items */}
        <div className="mt-2 space-y-1">
          {order.items.map((item, index) => (
            <p
              key={index}
              className="font-jakarta text-[12px] leading-5 text-[#6f5a54]"
            >
              {item}
            </p>
          ))}
        </div>

      </div>

      {/* Bottom Information */}
      <div className="mt-4 flex items-end justify-between border-t border-[#f1e5e0] pt-3">

        {/* Payment + Time */}
        <div>
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            {order.payment}
          </p>

          <p className="mt-1 font-jakarta text-[10px] font-medium text-[#8e706a]">
            {order.time}
          </p>
        </div>

        {/* Total */}
        <div className="text-right">
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            Total
          </p>

          <p className="font-playfair text-[19px] font-bold text-[#8d1900]">
            {order.amount}
          </p>
        </div>

      </div>

    </article>
  );
}

export default OwnerOrderCard;