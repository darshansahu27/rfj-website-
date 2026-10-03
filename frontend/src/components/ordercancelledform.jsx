import { useNavigate } from "react-router-dom";

function OrderCancelledForm() {
  const navigate = useNavigate();

  /* Continue Shopping */
  const handleContinueShopping = () => {
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">

      {/* Main Content */}
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 py-8">

        {/* Cancellation Visual */}
        <section className="relative mb-6">

          {/* Main Floating Circle */}
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#ffdad6]"
            style={{
              animation: "cancelFloatPulse 3s ease-in-out infinite",
            }}
          >

            {/* Red X */}
            <span
              className="text-[48px] font-bold leading-none text-[#ba1a1a]"
              style={{
                animation: "cancelXAppear 0.7s ease-out",
              }}
            >
              ×
            </span>

          </div>

          {/* Ambient Glow */}
          <div className="absolute inset-0 -z-10 rounded-full bg-[#ba1a1a]/10 blur-2xl" />

        </section>


        {/* Heading Section */}
        <section className="mb-8 text-center">

          <h1 className="font-['Playfair_Display'] text-[28px] font-bold leading-9 text-[#1e1b18]">
            Order Cancelled
          </h1>

          <p className="mx-auto mt-3 max-w-[320px] text-[14px] leading-5 text-[#5a413b]">
            We're sorry. Unfortunately, we were unable to process your
            order due to an operational issue. Any eligible refund has
            been initiated automatically. Thank you for your understanding.
          </p>

        </section>


        {/* Information Cards */}
        <div className="mb-8 w-full space-y-4">

          {/* Reason For Cancellation */}
          <section className="rounded-xl border border-[#e2bfb7]/30 bg-white p-4 shadow-[0_4px_12px_rgba(45,41,38,0.08)]">

            <div className="mb-2 flex items-center gap-2">

              <span className="text-[18px] text-[#b32d0f]">
                ⓘ
              </span>

              <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#5a413b]">
                Reason For Order Cancellation
              </h2>

            </div>

            <p className="text-[14px] leading-5 text-[#1e1b18]">
              The selected food item is temporarily unavailable.
            </p>

          </section>


          {/* Order Details */}
          <section className="rounded-xl border border-[#e2bfb7]/30 bg-white p-4 shadow-[0_4px_12px_rgba(45,41,38,0.08)]">

            <div className="mb-4 flex items-center gap-2">

              <span className="text-[18px] text-[#b32d0f]">
                ▣
              </span>

              <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#5a413b]">
                Order Details
              </h2>

            </div>


            <div className="grid grid-cols-2 gap-y-3">

              {/* Order ID */}
              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
                  Order ID
                </p>

                <p className="mt-1 text-[13px] font-bold text-[#1e1b18]">
                  RFJ-2026-000123
                </p>

              </div>


              {/* Order Amount */}
              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
                  Order Amount
                </p>

                <p className="mt-1 text-[13px] font-bold text-[#1e1b18]">
                  ₹840
                </p>

              </div>


              {/* Payment Method */}
              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
                  Payment Method
                </p>

                <p className="mt-1 text-[13px] text-[#1e1b18]">
                  UPI
                </p>

              </div>

            </div>

          </section>


          {/* Refund Status */}
          <section className="relative overflow-hidden rounded-xl border border-[#e2bfb7]/30 bg-white p-4 shadow-[0_4px_12px_rgba(45,41,38,0.08)]">

            {/* Green Status Border */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#2e7d32]" />


            <div className="mb-3 flex items-center justify-between gap-2">

              <div className="flex items-center gap-2">

                <span className="text-[18px] text-[#2e7d32]">
                  ▣
                </span>

                <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#5a413b]">
                  Refund Status
                </h2>

              </div>


              {/* Refund Initiated Badge */}
              <div className="flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-1">

                <span className="h-1.5 w-1.5 rounded-full bg-[#2e7d32]" />

                <span className="text-[8px] font-bold uppercase tracking-wide text-[#2e7d32]">
                  Refund Initiated
                </span>

              </div>

            </div>


            <p className="mb-2 text-[13px] leading-5 text-[#1e1b18]">
              Your refund has been initiated successfully.
              Expected Refund Time:{" "}
              <strong>3–5 Business Days.</strong>
            </p>


            <p className="text-[10px] italic leading-4 text-[#5a413b]">
              The refund will be credited to the original payment method
              used during checkout.
            </p>

          </section>

        </div>


        {/* Continue Shopping */}
        <div className="w-full">

          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full rounded-xl bg-[#b32d0f] py-3 text-[14px] font-bold text-white shadow-[0_6px_14px_rgba(179,45,15,0.20)] transition-all duration-200 hover:bg-[#9f260c] active:scale-[0.98]"
          >
            Continue Shopping
          </button>

        </div>


        {/* Contact Support */}
        <p className="mt-6 text-center text-[10px] text-[#5a413b]">

          Need help?{" "}

          <span className="cursor-pointer underline transition-colors hover:text-[#b32d0f]">
            Contact Support
          </span>

        </p>

      </main>


      {/* Cancellation Animation */}
      <style>
        {`
          @keyframes cancelFloatPulse {
            0% {
              transform: translateY(0px) scale(1);
              opacity: 0.9;
            }

            50% {
              transform: translateY(-10px) scale(1.05);
              opacity: 1;
            }

            100% {
              transform: translateY(0px) scale(1);
              opacity: 0.9;
            }
          }

          @keyframes cancelXAppear {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-12deg);
            }

            60% {
              opacity: 1;
              transform: scale(1.08) rotate(3deg);
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

export default OrderCancelledForm;