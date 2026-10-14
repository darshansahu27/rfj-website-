import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function RestaurantIcon() {
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
      <path d="M6 2v7" />
      <path d="M3.5 2v4.5a2.5 2.5 0 0 0 5 0V2" />
      <path d="M6 9v13" />
      <path d="M15 2v20" />
      <path d="M15 2c3 2 4 5 4 8v3h-4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c.8-4 3.1-6 7-6s6.2 2 7 6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
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

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-5h6v5" />
    </svg>
  );
}

function RestaurantMenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <path d="M6 3v7" />
      <path d="M3.5 3v4a2.5 2.5 0 0 0 5 0V3" />
      <path d="M6 10v11" />
      <path d="M15 3v18" />
      <path d="M15 3c3 2 4 5 4 8v3h-4" />
    </svg>
  );
}

function ReviewsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6-4.3-4.2 6-.9L12 3.5z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const profileRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        setDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 h-16 w-full bg-[#fff8f5]/85 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">

          {/* Logo */}

          <Link
            to="/"
            className="group flex items-center gap-2"
            aria-label="Rohit Food Junction home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8d1900] text-white">
              <RestaurantIcon />
            </div>

            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[24px] font-semibold leading-8 italic text-[#8d1900]"
            >
              Rohit Food Junction
            </span>
          </Link>


          {/* Right controls */}

          <div className="flex items-center gap-4">

            {/* Profile */}

            <div ref={profileRef} className="relative">

              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center justify-center rounded-full p-2 text-[#8d1900] transition-colors hover:bg-[#e9e1dc]/50"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <ProfileIcon />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[#e2bfb7]/10 bg-[#fff8f5] py-2 shadow-xl">

                  <Link
                    to="/login"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-[14px] font-semibold leading-5 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-[14px] font-semibold leading-5 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
                  >
                    Sign Up
                  </Link>

                </div>
              )}

            </div>


            {/* Hamburger */}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center rounded-full p-2 text-[#8d1900] transition-colors hover:bg-[#e9e1dc]/50"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </button>

          </div>
        </div>
      </header>


      {/* Navigation Drawer */}

      {drawerOpen && (
        <div className="fixed inset-0 z-100">

          {/* Overlay */}

          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/30"
          />


          {/* Drawer */}

          <div
            ref={drawerRef}
            className="absolute right-0 top-0 h-full w-75 max-w-[85vw] bg-[#fff8f5] shadow-2xl"
          >

            {/* Drawer Header */}

            <div className="flex items-center justify-between px-5 py-6">

              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-[20px] font-bold text-[#8d1900]"
              >
                Explore
              </h2>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-[22px] text-[#5a413b]"
                aria-label="Close navigation menu"
              >
                ×
              </button>

            </div>


            {/* Navigation */}

            <nav className="px-4">

              {/* Home */}

              <Link
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="mb-2 flex items-center gap-4 rounded-lg bg-[#b32d0f] px-4 py-3 text-white"
              >
                <HomeIcon />

                <span className="text-[13px] font-semibold">
                  Home
                </span>
              </Link>


              {/* Menu */}

              <Link
                to="/menu"
                onClick={() => setDrawerOpen(false)}
                className="mb-2 flex items-center gap-4 rounded-lg px-4 py-3 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <RestaurantMenuIcon />

                <span className="text-[13px] font-semibold">
                  Menu
                </span>
              </Link>


              {/* Reviews */}

              <Link
                to="/reviews"
                onClick={() => setDrawerOpen(false)}
                className="mb-2 flex items-center gap-4 rounded-lg px-4 py-3 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <ReviewsIcon />

                <span className="text-[13px] font-semibold">
                  Reviews
                </span>
              </Link>


              {/* Contact Us */}

              <Link
                to="/contactus"
                onClick={() => setDrawerOpen(false)}
                className="mb-2 flex items-center gap-4 rounded-lg px-4 py-3 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
              >
                <ContactIcon />

                <span className="text-[13px] font-semibold">
                  Contact Us
                </span>
              </Link>

            </nav>

          </div>
        </div>
      )}
    </>
  );
}

export default Header;