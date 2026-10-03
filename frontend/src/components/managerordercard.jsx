import { useState } from "react";

function ManagerOrderCard({
  orderId,
  customer,
  status,
  items,
  payment,
  total,
  onReject,
  onDelivered,
  readOnly = false,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const isRejected = status === "Rejected";
  const isDelivered = status === "Delivered" || status === "Completed";

  return (
    <>
      <article className="mx-auto w-full max-w-[600px] rounded-xl border border-[#eadfce] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(45,41,38,0.08)]">
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
                : "bg-[#dcf8e7] text-[#159447]"
            }`}
          >
            ● {status}
          </span>
        </div>

        {/* Order Items */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="max-w-[70%] font-jakarta text-[13px] leading-6 text-[#5f514c]">
            {items}
          </p>

          <p className="font-jakarta text-[14px] font-bold leading-6 text-[#2b211e]">
            {total}
          </p>
        </div>

        {/* Payment + Total */}
        <div className="mt-1 flex items-center justify-between">
          <p className="font-jakarta text-[12px] leading-5 text-[#6b6b6b]">
            {payment}
          </p>

          <p className="font-jakarta text-[13px] font-bold leading-5 text-[#c92f0f]">
            {total} Total
          </p>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 rounded-lg bg-[#fff8f5] p-3">
            <p className="font-jakarta text-[12px] font-bold text-[#2b211e]">
              Order Details
            </p>

            <p className="mt-2 font-jakarta text-[11px] leading-5 text-[#5f514c]">
              {items}
            </p>

            <div className="mt-2 flex justify-between">
              <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                Payment
              </span>

              <span className="font-jakarta text-[11px] font-semibold text-[#2b211e]">
                {payment}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                Total
              </span>

              <span className="font-jakarta text-[11px] font-bold text-[#c92f0f]">
                {total}
              </span>
            </div>

            {readOnly && (
              <div className="mt-1 flex justify-between">
                <span className="font-jakarta text-[11px] text-[#6b6b6b]">
                  Status
                </span>

                <span
                  className={`font-jakarta text-[11px] font-bold ${
                    isRejected
                      ? "text-[#c92f0f]"
                      : "text-[#159447]"
                  }`}
                >
                  {isRejected
                    ? "Rejected"
                    : isDelivered
                    ? "Delivered"
                    : status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Active Order Actions */}
        {!readOnly && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRejectDialog(true)}
              className="rounded-full border border-[#b9a9a2] px-4 py-1.5 font-jakarta text-[10px] font-semibold leading-4 text-[#2b211e]"
            >
              Reject Order
            </button>

            <button
              type="button"
              onClick={onDelivered}
              className="flex-1 rounded-full bg-[#a92d15] px-4 py-1.5 font-jakarta text-[10px] font-bold leading-4 text-white shadow-sm"
            >
              Mark as Delivered
            </button>
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
      {showRejectDialog && !readOnly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-xl">
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
                  onReject();
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