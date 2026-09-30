function OrderDetails() {
  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Heading */}
      <h2 className="text-lg font-bold text-[#1e1b18]">
        Order Details
      </h2>

      {/* Order information */}
      <div className="mt-4 space-y-3">

        {/* Order ID */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            Order ID
          </span>

          <span className="text-sm font-semibold text-[#1e1b18]">
            #RFJ1024
          </span>
        </div>

        {/* Order date */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            Order Date
          </span>

          <span className="text-sm font-semibold text-[#1e1b18]">
            30 Sep 2026
          </span>
        </div>

        {/* Items */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            Items
          </span>

          <span className="text-sm font-semibold text-[#1e1b18]">
            3 Items
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-[#efe6e2] pt-3">
          <span className="text-sm font-semibold text-[#1e1b18]">
            Total Amount
          </span>

          <span className="text-base font-bold text-[#8d1900]">
            ₹450
          </span>
        </div>

      </div>
    </section>
  );
}

export default OrderDetails;
