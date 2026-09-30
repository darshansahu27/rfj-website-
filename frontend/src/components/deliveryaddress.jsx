function LocationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function DeliveryAddress() {
  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9ebe6] text-[#8d1900]">
          <LocationIcon />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1e1b18]">
            Delivery Address
          </h2>

          <p className="text-xs text-[#8a817c]">
            Your order will be delivered here
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="mt-4 rounded-lg bg-[#fff8f5] p-4">
        <p className="text-sm font-semibold text-[#1e1b18]">
          Poulomi Maiti
        </p>

        <p className="mt-1 text-sm leading-5 text-[#6f6661]">
          123, Example Society,
          <br />
          Ahmedabad, Gujarat - 380001
        </p>

        <p className="mt-2 text-xs text-[#8a817c]">
          Phone: +91 XXXXX XXXXX
        </p>
      </div>
    </section>
  );
}

export default DeliveryAddress;
