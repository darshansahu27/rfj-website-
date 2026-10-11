
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  profileImage = "",
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleMyProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/ownerprofile");
  };

  const handleLogoutClick = () => {
    setShowProfileMenu(false);

    // Logout functionality can be connected to authentication later.
    navigate("/ownerlogin");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fff8f5]/80 py-2 backdrop-blur-md">
      <div className="relative flex h-16 w-full items-center justify-between px-5">
        {/* Left side */}
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

        {/* Profile button */}
        <button
          type="button"
          onClick={handleProfileClick}
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

        {/* Owner Profile Menu */}
        {showProfileMenu && (
          <div className="absolute right-5 top-[68px] z-50 w-64 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-[#eadbd5]">
            {/* Owner information */}
            <div className="border-b border-[#eee2dd] px-4 py-4">
              <div className="flex items-center gap-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Owner Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b32d0f] font-playfair text-base font-bold text-white">
                    O
                  </div>
                )}

                <div>
                  <p className="font-playfair text-[16px] font-bold text-[#2b211e]">
                    Owner
                  </p>

                  <p className="font-jakarta text-[11px] text-[#8a7068]">
                    Restaurant Owner
                  </p>
                </div>
              </div>
            </div>

            {/* My Profile */}
            <button
              type="button"
              onClick={handleMyProfileClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#fff8f5]"
            >
              <span className="text-lg text-[#b32d0f]">👤</span>

              <span className="font-jakarta text-sm font-medium text-[#5a413b]">
                My Profile
              </span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-3 border-t border-[#eee2dd] px-4 py-3 text-left transition-colors hover:bg-[#fff8f5]"
            >
              <span className="text-lg text-[#b32d0f]">→</span>

              <span className="font-jakarta text-sm font-medium text-[#5a413b]">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default OwnerDashboardHeader;

