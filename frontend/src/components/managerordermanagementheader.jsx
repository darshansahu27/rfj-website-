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
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function ManagerOrderManagementHeader({
  onMenuClick,
  onProfileClick,
}) {
  return (
    <header className="w-full bg-[#fff8f5] px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#8d1900]"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

          <h1 className="font-playfair text-[20px] font-bold leading-7 text-[#8d1900]">
            Order Management
          </h1>
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b32d0f] font-playfair text-sm font-bold text-white"
          aria-label="Open manager profile"
        >
          R
        </button>
      </div>
    </header>
  );
}

export default ManagerOrderManagementHeader;