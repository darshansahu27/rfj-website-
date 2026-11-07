import { useState } from "react";

function ManagerOrderCard({
  orderId,
  customer,
  status,
  items,
  payment,
  total,
  onReject,
  onSendForDelivery,
  onDelivered,
  readOnly = false,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_");

  const isConfirmed = normalizedStatus === "confirmed";

  const isOutForDelivery =
    normalizedStatus === "out_for_delivery";

  const isRejected =
    normalizedStatus === "rejected" ||
    normalizedStatus === "cancelled";

  const isDelivered =
    normalizedStatus === "delivered";

  const canReject = isConfirmed && !readOnly;

  const canSendForDelivery = isConfirmed && !readOnly;

  const canMarkDelivered = isOutForDelivery && !readOnly;

  // Format order items for display.
  const formattedItems = Array.isArray(items)
    ? items
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          const name = item.name || item.item_name || "Item";
          const quantity = item.quantity || 1;

          return `${name} x ${quantity}`;
        })
        .join(", ")
    : items || "No items available";

  // Format total amount.
  const formattedTotal = `₹${Number(total || 0).toFixed(2)}`;

  return (
    <>
      <article className="mx-auto w-full max-w-150 rounded-xl border border-[#eadfce] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(45,41,38,0.08)]">

        {/* Order Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-jakarta text-[14px] font-bold leading-5 text-[#2b211e]">
              ID #{orderId}
            </p>

            <p className="mt-0.5 font-jakarta text-[12px] leading-5 text-[#6b6b6b]">
              Customer: {customer}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 font-jakarta text-[10px] font-bold leading-4 ${
              isRejected
                ? "bg-[#fde4e4] text-[#c92f0f]"
                : isDelivered
                ? "bg-[#dcf8e7] text-[#159447]"
                : isOutForDelivery
                ? "bg-[#e4edff] text-[#2459a6]"
                : "bg-[#fff0d9] text-[#a35b00]"
            }`}
          >
            ● {status}
          </span>
        </div>

        {/* Order Items */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="max-w-[70%] font-jakarta text-[13px] leading-6 text-[#5f514c]">
            {formattedItems}
          </p>

          <p className="font-jakarta text-[14px] font-bold leading-6 text-[#2b211e]">
            {formattedTotal}
          </p>
        </div>

        {/* Payment Details */}
        <div className="mt-1 flex items-center justify-between">
          <p className="font-jakarta text-[12px] leading-5 text-[#6b6b6b]">
            {payment || "Payment information unavailable"}
          </p>

          <p className="font-jakarta text-[13px] font-bold leading-5 text-[#c92f0f]">
            Total: {formattedTotal}
          </p>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 rounded-lg bg-[#fff8f5] p-3">
            <p className="font-jakarta text-[12px] font-bold text-[#2b211e]">
              Order Details
            </p>

            <p className="mt-2 font-jakarta text-[11px] leading-5 text-[#5f514c]">
              {formattedItems}
            </p>

            <div className="mt-2 flex justify-between">
              <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                Payment
              </span>

              <span className="font-jakarta text-[11px] font-semibold text-[#2b211e]">
                {payment || "Not available"}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                Total
              </span>

              <span className="font-jakarta text-[11px] font-bold text-[#c92f0f]">
                {formattedTotal}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                Status
              </span>

              <span className="font-jakarta text-[11px] font-bold text-[#2b211e]">
                {status}
              </span>
            </div>
          </div>
        )}

        {/* Active Order Actions */}
        {!readOnly &&
          (canReject || canSendForDelivery || canMarkDelivered) && (
            <div className="mt-3 flex items-center gap-2">

              {canReject && (
                <button
                  type="button"
                  onClick={() => setShowRejectDialog(true)}
                  className="rounded-full border border-[#b9a9a2] px-4 py-2 font-jakarta text-[10px] font-semibold leading-4 text-[#2b211e]"
                >
                  Reject Order
                </button>
              )}

              {canSendForDelivery && (
                <button
                  type="button"
                  onClick={onSendForDelivery}
                  className="flex-1 rounded-full bg-[#a92d15] px-4 py-2 font-jakarta text-[10px] font-bold leading-4 text-white shadow-sm"
                >
                  Send for Delivery
                </button>
              )}

              {canMarkDelivered && (
                <button
                  type="button"
                  onClick={onDelivered}
                  className="flex-1 rounded-full bg-[#159447] px-4 py-2 font-jakarta text-[10px] font-bold leading-4 text-white shadow-sm"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          )}

        {/* View Details */}
        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1 font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8d1900]"
        >
          {showDetails ? "Hide Details" : "View Details"}

          <span className="text-[12px]">
            {showDetails ? "⌃" : "⌄"}
          </span>
        </button>
      </article>

      {/* Reject Confirmation */}
      {showRejectDialog && canReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-85 rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="font-playfair text-[18px] font-bold text-[#2b211e]">
              Reject Order?
            </h3>

            <p className="mt-2 font-jakarta text-[11px] leading-5 text-[#6b6b6b]">
              Are you sure you want to reject order #{orderId}?
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 rounded-full border border-[#b9a9a2] px-4 py-2 font-jakarta text-[10px] font-semibold text-[#2b211e]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRejectDialog(false);
                  onReject?.();
                }}
                className="flex-1 rounded-full bg-[#c92f0f] px-4 py-2 font-jakarta text-[10px] font-bold text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerOrderCard;