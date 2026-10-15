function ArrowBackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function CustomerProfileHeader({ onBack }) {
  return (
    <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center bg-[#fff8f5]/80 px-5 shadow-sm backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 rounded-full p-2 text-[#8d1900] transition-transform hover:opacity-80 active:scale-95"
        aria-label="Go back"
      >
        <ArrowBackIcon />
      </button>

      <h1 className="flex-1 text-center font-playfair text-[28px] font-bold leading-9 text-[#8d1900] md:text-[24px]">
        My Profile
      </h1>

      <div className="w-10" />
    </header>
  );
}

export default CustomerProfileHeader;