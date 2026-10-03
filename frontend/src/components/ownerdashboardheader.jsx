function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function OwnerDashboardHeader({
  onMenuClick,
  onProfileClick,
  profileImage = "",
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#fff8f5]/80 py-2 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-full p-2 text-[#8d1900] transition-colors hover:bg-[#f5ece7] active:scale-90"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          <h1 className="font-playfair text-[24px] font-bold leading-8 text-[#8d1900]">
            Owner Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="h-10 w-10 overflow-hidden rounded-full p-0.5 transition-transform active:scale-95"
          aria-label="Open owner profile"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Owner Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#b32d0f] font-playfair text-sm font-bold text-white">
              O
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

export default OwnerDashboardHeader;