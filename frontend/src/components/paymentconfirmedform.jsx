
import { useLocation, useNavigate } from "react-router-dom";

function PaymentConfirmedForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;
  const paymentVerified = location.state?.paymentVerified === true;
  const paymentStatus = location.state?.paymentStatus;
  const paymentId = location.state?.paymentId;

  const isPaymentSuccessful =
    paymentVerified && paymentStatus === "successful";

  const handleTrackOrder = () => {
    if (!order?.id) {
      navigate("/profile");
      return;
    }

    navigate(`/ordertracking/${encodeURIComponent(order.id)}`);
  };

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
      <main className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col px-4 pb-5 pt-4">

        {/* Status Animation */}
        <section className="relative flex h-37.5 w-full items-center justify-center overflow-hidden">
          <div
            className="absolute right-12 top-2 h-7 w-7 rounded-full bg-[#fff0e4]"
            style={{
              animation: "paymentCircleFloat 3s ease-in-out infinite",
            }}
          />

          <div
            className="absolute bottom-2.5 left-12 h-7 w-7 rounded-full bg-[#fff0e4]"
            style={{
              animation: "paymentCircleFloatReverse 3.5s ease-in-out infinite",
            }}
          />

          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#fff0e4]"
            style={{
              animation: "paymentSuccessFloat 3s ease-in-out infinite",
            }}
          >
            <div
              className={`flex h-14.5 w-14.5 items-center justify-center rounded-full shadow-[0_8px_18px_rgba(179,45,15,0.18)] ${
                isPaymentSuccessful ? "bg-[#ffa43a]" : "bg-[#b58b68]"
              }`}
            >
              <span
                className="text-[38px] font-bold leading-none text-white"
                style={{
                  animation: "paymentCheck 0.8s ease-out 0.2s both",
                }}
              >
                {isPaymentSuccessful ? "✓" : "!"}
              </span>
            </div>
          </div>
        </section>

        {/* Status Heading */}
        <section className="text-center">
          <h1 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b211d]">
            {isPaymentSuccessful
              ? "Order Placed Successfully"
              : "Payment Status Unavailable"}
          </h1>

          <p className="mt-1 px-3 text-[10px] leading-4 text-[#6b5149]">
            {isPaymentSuccessful
              ? "Thank you for ordering from Rohit Food Junction. Your payment has been verified and your order has been confirmed."
              : "We could not confirm the payment status from this page. Please check your order status or contact Rohit Food Junction before attempting another payment."}
          </p>
        </section>

        {/* Order Details */}
        <section className="mt-4 rounded-xl border border-[#e2bfb7]/40 bg-[#fff0dd] p-3 shadow-sm">
          <h2 className="font-['Playfair_Display'] text-[10px] font-bold text-[#5a413b]">
            ORDER DETAILS
          </h2>

          <div className="mt-2 h-px bg-[#e2bfb7]/40" />

          <div className="mt-2 space-y-2">
            <div>
              <p className="text-[8px] text-[#8a7068]">Order ID</p>
              <p className="break-all text-[10px] font-semibold text-[#1e1b18]">
                {order?.order_number || order?.id || "Unavailable"}
              </p>
            </div>

            <div>
              <p className="text-[8px] text-[#8a7068]">
                Est. Preparation Time
              </p>
              <p className="text-[10px] font-semibold text-[#1e1b18]">
                {isPaymentSuccessful ? "20–25 Minutes" : "Not available"}
              </p>
            </div>

            <div>
              <p className="text-[8px] text-[#8a7068]">
                Payment Status
              </p>

              <p
                className={`text-[10px] font-semibold ${
                  isPaymentSuccessful
                    ? "text-[#169447]"
                    : "text-[#9a673b]"
                }`}
              >
                {isPaymentSuccessful
                  ? "✓ Payment Successful"
                  : "Payment not verified"}
              </p>
            </div>

            {paymentId && (
              <div>
                <p className="text-[8px] text-[#8a7068]">
                  Payment Reference
                </p>
                <p className="break-all text-[10px] font-semibold text-[#1e1b18]">
                  {paymentId}
                </p>
              </div>
            )}

            {isPaymentSuccessful && (
              <div>
                <p className="text-[8px] text-[#8a7068]">
                  Order Status
                </p>
                <p className="text-[10px] font-semibold text-[#169447]">
                  {order?.status === "confirmed"
                    ? "Confirmed"
                    : "Payment verified"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Order Tracking Information */}
        <section className="mt-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] text-[#b32d0f]">◉</span>

            <p className="text-[9px] leading-4 text-[#5a413b]">
              {isPaymentSuccessful
                ? "You can track your confirmed order in real time from your profile."
                : "You can check your order details and current status from your profile."}
            </p>
          </div>
        </section>

        {/* Order Actions */}
        <div className="mt-auto space-y-3 pt-5">
          <button
            type="button"
            onClick={handleTrackOrder}
            className="w-full rounded-xl bg-[#b32d0f] py-2.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#9f260c] active:scale-[0.98]"
          >
            Track Your Order
          </button>

          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full rounded-xl border border-[#b32d0f] bg-white py-2.5 text-[10px] font-bold text-[#b32d0f] shadow-sm transition-all duration-200 hover:bg-[#fff0e4] active:scale-[0.98]"
          >
            Continue Shopping
          </button>
        </div>
      </main>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes paymentSuccessFloat {
            0%, 100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-7px);
            }
          }

          @keyframes paymentCircleFloat {
            0%, 100% {
              transform: translate(0px, 0px);
            }

            50% {
              transform: translate(5px, -6px);
            }
          }

          @keyframes paymentCircleFloatReverse {
            0%, 100% {
              transform: translate(0px, 0px);
            }

            50% {
              transform: translate(-5px, 5px);
            }
          }

          @keyframes paymentCheck {
            0% {
              opacity: 0;
              transform: scale(0.4) rotate(-15deg);
            }

            60% {
              opacity: 1;
              transform: scale(1.15) rotate(3deg);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default PaymentConfirmedForm;
