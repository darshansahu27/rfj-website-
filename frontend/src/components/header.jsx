import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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

function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full bg-[#fff8f5]/85 backdrop-blur-md[12px] shadow-sm">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
        
        {/* Logo */}
        <a
          href="#"
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
        </a>

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
  className="block px-4 py-3 text-[14px] font-semibold leading-5 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
>
  Login
</Link>

                <Link
  to="/signup"
  className="block px-4 py-3 text-[14px] font-semibold leading-5 text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
>
  Sign Up
</Link>
              </div>
            )}
          </div>

          {/* Menu */}
          <button
            type="button"
            className="flex items-center justify-center rounded-full p-2 text-[#8d1900] transition-colors hover:bg-[#e9e1dc]/50"
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;