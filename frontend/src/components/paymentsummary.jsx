function PaymentSummary({ order = {} }) {
  const subtotal = Number(order.subtotal || 0);
  const delivery = Number(order.delivery_fee || 0);
  const discount = Number(order.discount || 0);
  const total = Number(order.total_amount || 0);
  // Derive tax/other included charges from the stored order total.
  const taxOrOther = Math.max(0, total - subtotal - delivery + discount);
  const payments = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;
  const paymentWasRecorded = Boolean(payments?.payment_method);

  return (
    <section className="rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <h2 className="text-lg font-bold text-[#1e1b18]">Payment Summary</h2>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">Item Subtotal</span>
          <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7a716c]">Discount</span>
            <span className="text-sm font-medium">−₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7a716c]">Delivery Charge</span>
          <span className="text-sm font-medium">
            {delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
          </span>
        </div>
        {taxOrOther > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7a716c]">Tax / Other Charges</span>
            <span className="text-sm font-medium">₹{taxOrOther.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#efe6e2] pt-4">
        <span className="text-base font-bold">Order Total</span>
        <span className="text-xl font-bold text-[#8d1900]">₹{total.toFixed(2)}</span>
      </div>

      <div className="mt-4 rounded-lg bg-[#fff8f5] p-3">
        <p className="text-xs text-[#8a817c]">Payment</p>
        <p className="mt-1 text-sm font-semibold text-[#1e1b18]">
          {paymentWasRecorded
            ? `${payments.payment_method}${payments.payment_status ? ` (${payments.payment_status})` : ""}`
            : "Demo checkout — no payment collected"}
        </p>
        {!paymentWasRecorded && (
          <p className="mt-1 text-xs text-[#8a817c]">
            This order was saved for demonstration; no real payment was processed.
          </p>
        )}
      </div>
    </section>
  );
}

export default PaymentSummary;
