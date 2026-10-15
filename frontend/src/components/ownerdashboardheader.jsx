import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

function OwnerDashboardHeader({ profileImage = "" }) {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [owner, setOwner] = useState({
    name: "",
    email: "",
    image: profileImage,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileError, setProfileError] = useState("");

  const loadOwnerProfile = useCallback(async (user) => {
    try {
      setProfileError("");

      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/profile/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load owner profile."
        );
      }

      const profile = result.profile || result;

      if (profile.role !== "owner") {
        await signOut(auth);
        navigate("/ownerlogin", { replace: true });
        return;
      }

      setOwner({
        name: profile.fullName || user.displayName || "Owner",
        email: profile.email || user.email || "",
        image: profile.avatarUrl || "",
      });
    } catch (error) {
      console.error("Unable to load owner profile:", error);
      setProfileError("Profile details could not be loaded.");

      // Keep the Firebase account details available as a fallback.
      setOwner((previous) => ({
        ...previous,
        name: user.displayName || previous.name || "Owner",
        email: user.email || previous.email || "",
      }));
    } finally {
      setLoadingProfile(false);
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoadingProfile(false);
        navigate("/ownerlogin", { replace: true });
        return;
      }

      setOwner((previous) => ({
        ...previous,
        name: user.displayName || previous.name || "Owner",
        email: user.email || previous.email || "",
      }));

      loadOwnerProfile(user);
    });

    return unsubscribe;
  }, [loadOwnerProfile, navigate]);

  // Use the image supplied by the parent until the backend profile loads.
  const displayedImage = owner.image || profileImage;
  const ownerInitial = (owner.name || "O").trim().charAt(0).toUpperCase();

  const handleProfileClick = () => {
    setShowProfileMenu((previous) => !previous);
  };

  const handleMyProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/ownerprofile");
  };

  const handleLogoutClick = async () => {
    setShowProfileMenu(false);
    setLoggingOut(true);

    try {
      await signOut(auth);
      navigate("/ownerlogin", { replace: true });
    } catch (error) {
      console.error("Unable to log out:", error);
      setProfileError("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fff8f5]/80 py-2 backdrop-blur-md">
      <div className="relative flex h-16 w-full items-center justify-between px-5">
        {/* Left side */}
        <div className="flex items-center">
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
          aria-expanded={showProfileMenu}
        >
          {displayedImage ? (
            <img
              src={displayedImage}
              alt="Owner profile"
              className="h-full w-full rounded-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#b32d0f] font-playfair text-sm font-bold text-white">
              {ownerInitial}
            </div>
          )}
        </button>

        {/* Owner Profile Menu */}
        {showProfileMenu && (
          <div className="absolute right-5 top-18 z-50 w-72 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-[#eadbd5]">
            {/* Owner information */}
            <div className="border-b border-[#eee2dd] px-4 py-4">
              <div className="flex items-center gap-3">
                {displayedImage ? (
                  <img
                    src={displayedImage}
                    alt="Owner profile"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b32d0f] font-playfair text-base font-bold text-white">
                    {ownerInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-playfair text-[16px] font-bold text-[#2b211e]">
                    {loadingProfile ? "Loading profile..." : owner.name}
                  </p>

                  <p className="break-all font-jakarta text-[11px] text-[#8a7068]">
                    {owner.email || "Owner account"}
                  </p>

                  {profileError && (
                    <p className="mt-1 font-jakarta text-[10px] text-red-600">
                      {profileError}
                    </p>
                  )}
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

            {/* View Account */}
            <button
              type="button"
              onClick={handleMyProfileClick}
              className="flex w-full items-center gap-3 border-t border-[#eee2dd] px-4 py-3 text-left transition-colors hover:bg-[#fff8f5]"
            >
              <span className="text-lg text-[#b32d0f]">⚙️</span>
              <span className="font-jakarta text-sm font-medium text-[#5a413b]">
                View Account
              </span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 border-t border-[#eee2dd] px-4 py-3 text-left transition-colors hover:bg-[#fff8f5] disabled:opacity-60"
            >
              <span className="text-lg text-[#b32d0f]">→</span>
              <span className="font-jakarta text-sm font-medium text-[#5a413b]">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default OwnerDashboardHeader;