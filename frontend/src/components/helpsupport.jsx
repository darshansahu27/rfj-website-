function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2
        19.79 19.79 0 0 1-8.63-3.07
        19.5 19.5 0 0 1-6-6
        19.79 19.79 0 0 1-3.07-8.67
        A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
        12.84 12.84 0 0 0 .7 2.81
        2 2 0 0 1-.45 2.11L8.09 9.91
        a16 16 0 0 0 6 6l1.27-1.27
        a2 2 0 0 1 2.11-.45
        12.84 12.84 0 0 0 2.81.7
        A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

function HelpIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.25 1.8c-.9.7-1.75 1.2-1.75 2.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HelpSupport() {
  return (
    <section className="mt-4 rounded-xl border border-[rgba(142,112,106,0.1)] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9ebe6] text-[#8d1900]">
          <HelpIcon />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1e1b18]">
            Need Help?
          </h2>

          <p className="text-xs text-[#8a817c]">
            We're here to help with your order
          </p>
        </div>
      </div>

      {/* Support buttons */}
      <div className="mt-4 flex gap-3">

        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#8d1900] px-3 py-2.5 text-xs font-semibold text-[#8d1900] transition hover:bg-[#f9ebe6]"
        >
          <PhoneIcon />
          Call Restaurant
        </button>

        <button
          type="button"
          className="flex-1 rounded-lg bg-[#8d1900] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#721500]"
        >
          Contact Support
        </button>

      </div>
    </section>
  );
}

export default HelpSupport;
