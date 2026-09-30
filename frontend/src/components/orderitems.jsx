function OrderItems() {
  const items = [
    {
      name: "Chicken Tandoori",
      quantity: 1,
      price: 280,
      variant: "Full",
    },
    {
      name: "Paneer Tikka",
      quantity: 1,
      price: 170,
      variant: "Regular",
    },
  ];

  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1e1b18]">
          Your Order
        </h2>

        <span className="text-xs font-semibold text-[#8d1900]">
          {items.length} Items
        </span>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-[#efe6e2] pb-4 last:border-b-0 last:pb-0"
          >
            {/* Item information */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Quantity */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9ebe6] text-xs font-bold text-[#8d1900]">
                {item.quantity}x
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[#1e1b18]">
                  {item.name}
                </h3>

                <p className="mt-0.5 text-xs text-[#8a817c]">
                  {item.variant}
                </p>
              </div>
            </div>

            {/* Price */}
            <span className="ml-3 shrink-0 text-sm font-semibold text-[#1e1b18]">
              ₹{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between border-t border-[#efe6e2] pt-4">
        <span className="text-sm font-semibold text-[#1e1b18]">
          Item Total
        </span>

        <span className="text-base font-bold text-[#8d1900]">
          ₹450
        </span>
      </div>
    </section>
  );
}

export default OrderItems;
