function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function OwnerProfileHeader() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/ownerdashboard";
    }
  };

  return (
    <header className="fixed left-0 top-0 z-50 h-14 w-full border-b border-[#e9d9d3]/60 bg-[#fff8f5]">
      <div className="mx-auto flex h-full max-w-3xl items-center px-5">
        <button
          type="button"
          onClick={handleBack}
          className="mr-3 flex items-center justify-center rounded-full p-1.5 text-[#8d1900] transition hover:bg-[#f5ece7]"
          aria-label="Go back"
        >
          <BackIcon />
        </button>

        <h1 className="font-playfair text-[19px] font-bold text-[#8d1900]">
          My Profile
        </h1>
      </div>
    </header>
  );
}

export default OwnerProfileHeader;