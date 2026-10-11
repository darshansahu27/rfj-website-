function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
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

function ManagerDashboardHeader({
  onMenuClick,
  onProfileClick,
  profileImage = "",
}) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-[#fff8f5]/80 px-4 py-4 backdrop-blur-md transition-all duration-300">
      {/* Dashboard Title */}
      <h1 className="font-playfair text-[24px] font-bold leading-8 text-[#8d1900]">
        Manager Dashboard
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full p-1 text-[#1e1b18] transition-colors hover:bg-[#f5ece7] active:scale-90"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        {/* Profile Button */}
        <button
          type="button"
          onClick={onProfileClick}
          className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#8d1900]/10 transition-transform active:scale-90"
          aria-label="Open manager profile"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Manager Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#b32d0f] font-playfair text-sm font-bold text-white">
              M
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

export default ManagerDashboardHeader;