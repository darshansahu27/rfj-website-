function PaymentSummary() {
  const itemTotal = 450;
  const gst = 81;
  const deliveryCharge = 0;
  const total = itemTotal + gst + deliveryCharge;

  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Heading */}
      <h2 className="text-lg font-bold text-[#1e1b18]">
        Payment Summary
      </h2>

      {/* Price details */}
      <div className="mt-4 space-y-3">

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            Item Total
          </span>

          <span className="text-sm font-medium text-[#1e1b18]">
            ₹{itemTotal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            GST
          </span>

          <span className="text-sm font-medium text-[#1e1b18]">
            ₹{gst}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">
            Delivery Charge
          </span>

          <span className="text-sm font-medium text-[#1e1b18]">
            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
          </span>
        </div>

      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t border-[#efe6e2] pt-4">
        <span className="text-base font-bold text-[#1e1b18]">
          Total Paid
        </span>

        <span className="text-xl font-bold text-[#8d1900]">
          ₹{total}
        </span>
      </div>

      {/* Payment method */}
      <div className="mt-4 rounded-lg bg-[#fff8f5] p-3">
        <p className="text-xs text-[#8a817c]">
          Payment Method
        </p>

        <p className="mt-1 text-sm font-semibold text-[#1e1b18]">
          UPI
        </p>
      </div>

    </section>
  );
}

export default PaymentSummary;
