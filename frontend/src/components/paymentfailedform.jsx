import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-5">

      <div className="w-full max-w-97.5 text-center">

        {/* Payment Failed Icon */}
        <div className="flex justify-center mb-6">

          <div className="payment-failed-float">

            <div className="relative flex items-center justify-center w-31.5 h-31.5 rounded-full bg-[#f9e9e4] shadow-[0_10px_25px_rgba(90,65,59,0.10)]">

              {/* Outer Ring */}
              <div className="absolute inset-2 rounded-full border-[6px] border-[#efd1c8] bg-white shadow-[0_7px_15px_rgba(90,65,59,0.12)]">

                {/* X */}
                <div className="absolute inset-0 flex items-center justify-center">

                  <span className="absolute w-9.5 h-1.25 rounded-full bg-[#a5260b] rotate-45"></span>

                  <span className="absolute w-9.5 h-1.25 rounded-full bg-[#a5260b] -rotate-45"></span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Heading */}
        <h1
          className="font-['Playfair_Display'] text-[28px] font-bold text-[#1e1b18] mb-1"
        >
          Payment Failed
        </h1>


        {/* Subtitle */}
        <p className="text-[16px] text-[#5a413b] mb-7">
          We couldn't process your payment.
        </p>


        {/* Information Box */}
        <div className="rounded-xl border border-[#e2bfb7]/50 bg-white px-5 py-4 shadow-sm mb-5">

          <p className="text-[12px] leading-4.5 text-[#5a413b]">
            Don't worry. If any amount was deducted, it will be automatically
            reversed by your bank or payment provider according to their
            processing time.
          </p>

        </div>


        {/* Retry Payment */}
        <button
          type="button"
          onClick={() => navigate("/payment")}
          className="w-full rounded-xl bg-[#b32d0f] py-3 text-[12px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#982609] hover:-translate-y-px active:translate-y-0"
        >
          Retry Payment
        </button>


        {/* Change Payment Method */}
        <button
          type="button"
          onClick={() => navigate("/checkoutpage")}
          className="mt-3 w-full rounded-xl bg-[#f9a23b] py-3 text-[12px] font-semibold text-[#5a413b] shadow-sm transition-all duration-200 hover:bg-[#f39a2f] hover:-translate-y-px active:translate-y-0"
        >
          Change Payment Method
        </button>


        {/* Back To Cart */}
        <button
          type="button"
          onClick={() => navigate("/customercart")}
          className="mt-3 w-full rounded-xl border border-[#e2bfb7] bg-[#fff8f5] py-3 text-[12px] font-semibold text-[#5a413b] transition-all duration-200 hover:bg-white hover:-translate-y-px active:translate-y-0"
        >
          Back to Cart
        </button>

      </div>


      {/* Floating Animation */}
      <style>
        {`
          @keyframes paymentFailedFloat {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-10px);
            }

            100% {
              transform: translateY(0px);
            }
          }

          .payment-failed-float {
            animation: paymentFailedFloat 3s ease-in-out infinite;
          }
        `}
      </style>

    </div>
  );
}

export default PaymentFailed;