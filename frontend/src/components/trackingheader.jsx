function BackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function TrackingHeader() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <header className="relative flex h-12 items-center justify-center">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-[#1e1b18] transition hover:bg-[#f5ebe6]"
      >
        <BackIcon />
      </button>

      {/* Page Title */}
      <h1 className="font-playfair text-xl font-bold text-[#1e1b18]">
        Order Tracking
      </h1>

    </header>
  );
}

export default TrackingHeader;
