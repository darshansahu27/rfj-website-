function DashboardIcon() {
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
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function MenuIcon() {
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
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

function OrdersIcon() {
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
      <path d="M6 3h12v18H6z" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </svg>
  );
}

function LogoutIcon() {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  );
}

function ManagerDashboardDrawer({
  open = false,
  onClose,
  onDashboardClick,
  onMenuClick,
  onOrdersClick,
  onLogoutClick,
  profileImage = "",
  managerName = "Ananya Sharma",
  role = "General Manager",
  shift = "Morning",
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40"
        aria-label="Close navigation menu"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-[60] flex w-80 max-w-[85vw] flex-col rounded-r-xl bg-[#fff8f5] py-6 shadow-[-8px_0_24px_rgba(45,25,22,0.12)]">
        {/* Manager Information */}
        <div className="mb-8 px-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#b32d0f]">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Manager Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-playfair text-lg font-bold text-white">
                  A
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-playfair text-[18px] font-semibold leading-6 text-[#8d1900]">
                {managerName}
              </h2>

              <p className="font-jakarta text-sm font-semibold leading-5 text-[#5a413b]">
                {role}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-[#fbf2ed] px-4 py-2">
            <span className="font-jakarta text-xs font-bold tracking-wide text-[#8c4f00]">
              Shift: {shift}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <button
            type="button"
            onClick={onDashboardClick}
            className="mx-2 flex w-[calc(100%-16px)] items-center gap-4 rounded-full bg-[#b32d0f] px-6 py-3 text-left font-jakarta text-sm font-semibold text-white transition-all active:scale-[0.98]"
          >
            <DashboardIcon />

            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onMenuClick}
            className="mx-2 flex w-[calc(100%-16px)] items-center gap-4 rounded-full px-6 py-3 text-left font-jakarta text-sm font-semibold text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
          >
            <MenuIcon />

            <span>Manage Menu</span>
          </button>

          <button
            type="button"
            onClick={onOrdersClick}
            className="mx-2 flex w-[calc(100%-16px)] items-center gap-4 rounded-full px-6 py-3 text-left font-jakarta text-sm font-semibold text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
          >
            <OrdersIcon />

            <span>Order Management</span>
          </button>
        </nav>

        {/* Sign Out */}
        <div className="mt-auto border-t border-[#e2bfb7]/30 px-6 pt-6">
          <button
            type="button"
            onClick={onLogoutClick}
            className="flex w-full items-center gap-4 rounded-full px-4 py-3 text-left font-jakarta text-sm font-semibold text-[#5a413b] transition-colors hover:bg-[#ba1a1a]/5 hover:text-[#ba1a1a]"
          >
            <LogoutIcon />

            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ManagerDashboardDrawer;