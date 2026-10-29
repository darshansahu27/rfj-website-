function OrderItems({ items = [] }) {
  const itemTotal = items.reduce(
    (sum, item) => sum + Number(item.subtotal ?? (
      Number(item.unit_price_at_order || 0) * Number(item.quantity || 0)
    )),
    0
  );

  return (
    <section className="rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1e1b18]">Your Order</h2>
        <span className="text-xs font-semibold text-[#8d1900]">
          {items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} items
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {items.length ? items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 border-b border-[#efe6e2] pb-4 last:border-b-0 last:pb-0">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9ebe6] text-xs font-bold text-[#8d1900]">
                {Number(item.quantity || 0)}x
              </div>
              <div className="min-w-0">
                <h3 className="break-words text-sm font-semibold text-[#1e1b18]">
                  {item.item_name || "Menu item"}
                </h3>
                <p className="mt-1 text-xs text-[#8a817c]">
                  ₹{Number(item.unit_price_at_order || 0).toFixed(2)} each
                </p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold text-[#1e1b18]">
              ₹{Number(item.subtotal ?? (
                Number(item.unit_price_at_order || 0) * Number(item.quantity || 0)
              )).toFixed(2)}
            </span>
          </div>
        )) : (
          <p className="text-sm text-[#6f6661]">No order items were returned.</p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#efe6e2] pt-4">
        <span className="text-sm font-semibold text-[#1e1b18]">Items Subtotal</span>
        <span className="text-base font-bold text-[#8d1900]">₹{itemTotal.toFixed(2)}</span>
      </div>
    </section>
  );
}

export default OrderItems;
