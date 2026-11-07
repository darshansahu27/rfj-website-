function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l4 4L19 6" />
    </svg>
  );
}

function DeliveryIcon() {
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
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function PackageIcon() {
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
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

const steps = [
  {
    id: "confirmed",
    label: "Confirmed",
    icon: CheckIcon,
  },
  {
    id: "out_for_delivery",
    label: "Out for Delivery",
    icon: DeliveryIcon,
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: PackageIcon,
  },
];

function OrderProgress({ currentStatus = "confirmed" }) {
  const normalizedStatus = String(currentStatus)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const currentIndex = steps.findIndex(
    (step) => step.id === normalizedStatus
  );

  const progressWidth =
    currentIndex >= 0
      ? `${(currentIndex / (steps.length - 1)) * 80}%`
      : "0%";

  return (
    <section className="rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="relative flex items-start justify-between px-2 pt-4">

        {/* Background progress line */}
        <div className="absolute left-[10%] right-[10%] top-4 z-0 h-1 rounded-full bg-[#efe6e2]" />

        {/* Completed progress line */}
        <div
          className="absolute left-[10%] top-4 z-10 h-1 rounded-full bg-[#8d1900] transition-all duration-700"
          style={{ width: progressWidth }}
        />

        {steps.map((step, index) => {
          const StepIcon = step.icon;

          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div
              key={step.id}
              className={`relative z-20 flex w-1/3 flex-col items-center ${
                isUpcoming ? "opacity-40" : ""
              }`}
            >
              {/* Step circle */}
              {isCompleted ? (
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#8d1900] text-white">
                  <CheckIcon />
                </div>
              ) : isActive ? (
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#8d1900] bg-white text-[#8d1900]">
                  <StepIcon />
                </div>
              ) : (
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#e9e1dc] text-[#1e1b18]">
                  <StepIcon />
                </div>
              )}

              {/* Step label */}
              <span
                className={`text-center text-[10px] leading-4 ${
                  isActive
                    ? "font-bold text-[#8d1900]"
                    : "font-semibold text-[#1e1b18]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default OrderProgress;