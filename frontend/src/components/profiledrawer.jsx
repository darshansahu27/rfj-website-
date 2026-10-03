import { Link } from "react-router-dom";

function ProfileDrawer({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close profile drawer"
          onClick={onClose}
          className="fixed inset-0 z-60 h-full w-full bg-black/30 backdrop-blur-[1px]"
        />
      )}

      {/* Profile Drawer */}
      <aside
        className={`fixed right-0 top-0 z-70 h-full w-70 max-w-[82vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-5">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
              className="text-[16px] font-bold text-[#8d1900]"
            >
              My Profile
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5a413b] transition-colors hover:bg-[#f5ece7]"
            >
              <span className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>

          {/* Profile Information */}
          <div className="mb-5 flex flex-col items-center">

            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#e2bfb7]/40 bg-[#f5ece7]">
              <span className="text-lg font-semibold text-[#8d1900]">
                R
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
              className="mt-2 text-[13px] font-bold text-[#8d1900]"
            >
              Rohit Sharma
            </p>

            <p className="text-[9px] text-[#5a413b]">
              +91 98765 43210
            </p>

            <p className="mt-1 max-w-45 text-center text-[8px] leading-3 text-[#8e706a]">
              123 Foodie Lane, Sector 45,
              <br />
              Chandigarh, India
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full border border-[#b32d0f]/40 px-4 py-1 text-[9px] font-semibold text-[#b32d0f]"
            >
              Edit Profile
            </button>

          </div>

          {/* Profile Menu */}
          <nav className="flex flex-col gap-1">

            {/* Current Orders */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
            >
              <span className="flex items-center gap-3">
                <span className="text-[#b32d0f]">
                  🛒
                </span>

                <span>
                  Current Orders
                </span>
              </span>

              <span>
                ›
              </span>
            </button>

            {/* Previous Orders */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
            >
              <span className="flex items-center gap-3">
                <span className="text-[#b32d0f]">
                  ↻
                </span>

                <span>
                  Previous Orders
                </span>
              </span>

              <span>
                ›
              </span>
            </button>

            {/* Reviews */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
            >
              <span className="text-[#b32d0f]">
                ☆
              </span>

              <span>
                Reviews
              </span>
            </button>

            {/* Contact Us */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
            >
              <span className="text-[#b32d0f]">
                ♧
              </span>

              <span>
                Contact Us
              </span>
            </button>

            {/* About Us */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
            >
              <span className="text-[#b32d0f]">
                ⓘ
              </span>

              <span>
                About Us
              </span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] font-medium text-[#b32d0f] transition-colors hover:bg-[#fbf2ed]"
            >
              <span>
                ⇥
              </span>

              <span>
                Logout
              </span>
            </button>

          </nav>
        </div>
      </aside>
    </>
  );
}

export default ProfileDrawer;