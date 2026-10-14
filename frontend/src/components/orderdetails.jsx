function OrderDetails({ order = {} }) {
  const items = order.order_items || [];
  const total = Number(order.total_amount || 0);

  return (
    <section className="rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <h2 className="text-lg font-bold text-[#1e1b18]">Order Details</h2>
      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm text-[#7a716c]">Order Number</span>
          <span className="break-all text-right text-sm font-semibold text-[#1e1b18]">
            {order.order_number || "Unavailable"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#7a716c]">Order Date</span>
          <span className="text-right text-sm font-semibold text-[#1e1b18]">
            {order.created_at
              ? new Date(order.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Unavailable"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">Items</span>
          <span className="text-sm font-semibold text-[#1e1b18]">
            {items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[#efe6e2] pt-3">
          <span className="text-sm font-semibold text-[#1e1b18]">Order Total</span>
          <span className="text-base font-bold text-[#8d1900]">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
