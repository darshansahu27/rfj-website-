import { useNavigate, useLocation, Navigate } from "react-router-dom";

function PaymentConfirmedForm() {
const navigate = useNavigate();
const location = useLocation();

const order = location.state?.order;
const simulatedPayment = location.state?.simulatedPayment;

// Only show confirmation after a successful backend response.
if (!order?.id || !order?.order_number || !simulatedPayment) {
return <Navigate to="/customercart" replace />;
}

const handleContinueShopping = () => {
navigate("/menu");
};

return (
<div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
<main className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col px-4 pb-5 pt-4">
<section className="relative flex h-37.5 w-full items-center justify-center overflow-hidden">
<div
className="absolute right-12 top-2 h-7 w-7 rounded-full bg-[#fff0e4]"
style={{ animation: "paymentCircleFloat 3s ease-in-out infinite" }}
/>

      <div
        className="absolute bottom-2.5 left-12 h-7 w-7 rounded-full bg-[#fff0e4]"
        style={{ animation: "paymentCircleFloatReverse 3.5s ease-in-out infinite" }}
      />

      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#fff0e4]"
        style={{ animation: "paymentSuccessFloat 3s ease-in-out infinite" }}
      >
        <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full bg-[#ffa43a] shadow-[0_8px_18px_rgba(179,45,15,0.18)]">
          <span
            className="text-[38px] font-bold leading-none text-white"
            style={{ animation: "paymentCheck 0.8s ease-out 0.2s both" }}
          >
            ✓
          </span>
        </div>
      </div>
    </section>

    <section className="text-center">
      <h1 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b211d]">
        Order Placed Successfully
      </h1>

      <p className="mt-1 px-3 text-[10px] leading-4 text-[#6b5149]">
        Thank you for ordering from Rohit Food Junction.
        Your demo order has been saved successfully.
        No real payment was processed.
      </p>
    </section>

    <section className="mt-4 rounded-xl border border-[#e2bfb7]/40 bg-[#fff0dd] p-3 shadow-sm">
      <h2 className="font-['Playfair_Display'] text-[10px] font-bold text-[#5a413b]">
        ORDER DETAILS
      </h2>

      <div className="mt-2 h-px bg-[#e2bfb7]/40" />

      <div className="mt-2 space-y-3">
        <div>
          <p className="text-[8px] text-[#8a7068]">Order Number</p>
          <p className="break-all text-[10px] font-semibold text-[#1e1b18]">
            {order.order_number}
          </p>
        </div>

        <div>
          <p className="text-[8px] text-[#8a7068]">Order Total</p>
          <p className="text-[10px] font-semibold text-[#1e1b18]">
            ₹{Number(order.total_amount).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-[8px] text-[#8a7068]">Order Status</p>
          <p className="text-[10px] font-semibold capitalize text-[#169447]">
            {String(order.status || "confirmed").replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-[8px] text-[#8a7068]">Payment Status</p>
          <p className="text-[10px] font-semibold text-[#8a5a00]">
            Demo checkout — no payment collected
          </p>
        </div>
      </div>
    </section>

    <section className="mt-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 text-center shadow-sm">
      <p className="text-[9px] leading-4 text-[#5a413b]">
        Use Track Order below to view the latest status of this order.
      </p>
    </section>

    <div className="mt-auto space-y-3 pt-5">
      <button
        type="button"
        onClick={() => navigate(`/ordertracking/${order.id}`)}
        className="w-full rounded-xl bg-[#8d1900] py-2.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#751500] active:scale-[0.98]"
      >
        Track Order
      </button>
      <button
        type="button"
        onClick={handleContinueShopping}
        className="w-full rounded-xl bg-[#b32d0f] py-2.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#9f260c] active:scale-[0.98]"
      >
        Continue Shopping
      </button>
    </div>
  </main>

  <style>
    {`
      @keyframes paymentSuccessFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-7px); }
      }

      @keyframes paymentCircleFloat {
        0%, 100% { transform: translate(0px, 0px); }
        50% { transform: translate(5px, -6px); }
      }

      @keyframes paymentCircleFloatReverse {
        0%, 100% { transform: translate(0px, 0px); }
        50% { transform: translate(-5px, 5px); }
      }

      @keyframes paymentCheck {
        0% { opacity: 0; transform: scale(0.4) rotate(-15deg); }
        60% { opacity: 1; transform: scale(1.15) rotate(3deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
    `}
  </style>
</div>

);
}

export default PaymentConfirmedForm;