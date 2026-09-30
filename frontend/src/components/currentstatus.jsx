function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CurrentStatus({ currentStatus = "preparing" }) {
  const statusDetails = {
    confirmed: {
      title: "Order Confirmed",
      message: "Your order has been confirmed by the restaurant.",
      time: "Preparing your order soon",
    },

    preparing: {
      title: "Preparing Your Order",
      message: "Our kitchen is preparing your food fresh for you.",
      time: "Estimated preparation time: 20–30 minutes",
    },

    ready: {
      title: "Your Order Is Ready",
      message: "Your food is ready and waiting for delivery.",
      time: "Getting ready for delivery",
    },

    delivery: {
      title: "Out for Delivery",
      message: "Your order is on its way to you.",
      time: "Please keep your phone available",
    },

    delivered: {
      title: "Order Delivered",
      message: "Your order has been delivered. Enjoy your meal!",
      time: "Thank you for ordering with us",
    },
  };

  const current = statusDetails[currentStatus] || statusDetails.preparing;

  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Current status heading */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8d1900]" />

        <span className="text-xs font-semibold uppercase tracking-wide text-[#8d1900]">
          Current Status
        </span>
      </div>

      {/* Status information */}
      <div className="flex items-start gap-4">

        {/* Clock icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f9ebe6] text-[#8d1900]">
          <ClockIcon />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#1e1b18]">
            {current.title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#6f6661]">
            {current.message}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[#8d1900]">
            <ClockIcon />

            <span className="text-xs font-semibold">
              {current.time}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-5 border-t border-[#efe6e2] pt-4">
        <p className="text-xs leading-5 text-[#8a817c]">
          Your order status will update as your order moves through each step.
        </p>
      </div>
    </section>
  );
}

export default CurrentStatus;
