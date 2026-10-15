import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

function ProfileDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fullName = user?.displayName?.trim() || "";
  const email = user?.email || "";

  const initials = fullName
    ? fullName
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email
      ? email[0].toUpperCase()
      : "?";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      await signOut(auth);
      onClose();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Customer logout failed:", err);
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  const closeDrawer = () => {
    setShowAccountDetails(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close profile drawer"
          onClick={closeDrawer}
          className="fixed inset-0 z-60 h-full w-full bg-black/30 backdrop-blur-[1px]"
        />
      )}

      <aside
        aria-label="Customer profile"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-70 h-full w-70 max-w-[82vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[16px] font-bold text-[#8d1900]"
            >
              {showAccountDetails ? "Account Details" : "My Profile"}
            </span>

            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close profile"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5a413b] transition-colors hover:bg-[#f5ece7]"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          {/* Customer Information */}
          <div className="mb-5 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#e2bfb7]/40 bg-[#f5ece7]">
              <span className="text-lg font-semibold text-[#8d1900]">
                {loading ? "..." : initials}
              </span>
            </div>

            <p
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="mt-2 text-center text-[13px] font-bold text-[#8d1900]"
            >
              {loading ? "Loading profile..." : fullName || "Customer"}
            </p>

            {!loading && email && (
              <p className="mt-1 max-w-full break-all text-center text-[10px] text-[#5a413b]">
                {email}
              </p>
            )}

            {!loading && !user && (
              <p className="mt-1 text-center text-[10px] text-[#8e706a]">
                You are not logged in.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-2 text-center text-xs text-red-700">
                {error}
              </p>
            )}

            
{user && !showAccountDetails && (
  <div className="mt-2 flex w-full flex-col items-center gap-2">
    <button
      type="button"
      onClick={() => setShowAccountDetails(true)}
      className="rounded-full border border-[#b32d0f]/40 px-4 py-1 text-[10px] font-semibold text-[#b32d0f] transition-colors hover:bg-[#fbf2ed]"
    >
      Account Details
    </button>

    <button
      type="button"
      onClick={() => {
        closeDrawer();
        navigate("/customerprofile");
      }}
      className="rounded-full bg-[#b32d0f] px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#8d1900]"
    >
      View Full Profile
    </button>
  </div>
)}

          </div>

          {/* Account Details */}
          {showAccountDetails && (
            <section className="mb-5 rounded-xl border border-[#e2bfb7]/40 bg-[#fff8f5] p-4">
              <h3 className="mb-4 text-sm font-semibold text-[#8d1900]">
                Your Information
              </h3>

              <div className="space-y-4 text-sm text-[#5a413b]">
                <div>
                  <p className="text-xs text-[#8e706a]">Full Name</p>
                  <p className="wrap-break-word font-medium">
                    {fullName || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8e706a]">Email Address</p>
                  <p className="break-all font-medium">
                    {email || "Not provided"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAccountDetails(false)}
                className="mt-5 w-full rounded-full border border-[#b32d0f]/40 px-4 py-2 text-xs font-semibold text-[#b32d0f] transition-colors hover:bg-white"
              >
                Back to My Profile
              </button>
            </section>
          )}

          {/* Profile Menu */}
          {!showAccountDetails && (
            <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/customercart");
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#b32d0f]">🛒</span>
                  <span>Current Orders</span>
                </span>
                <span>›</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#b32d0f]">↻</span>
                  <span>Previous Orders</span>
                </span>
                <span>›</span>
              </button>

              <Link
                to="/reviews"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <span className="text-[#b32d0f]">☆</span>
                <span>Reviews</span>
              </Link>

              <Link
                to="/contactus"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <span className="text-[#b32d0f]">♧</span>
                <span>Contact Us</span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <span className="text-[#b32d0f]">ⓘ</span>
                <span>About Us</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut || loading || !user}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-[#b32d0f] transition-colors hover:bg-[#fbf2ed] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>⇥</span>
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}

export default ProfileDrawer;