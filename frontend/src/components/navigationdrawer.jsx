
import { Link, useLocation } from "react-router-dom";

// RFJ Google Business Profile
const GOOGLE_REVIEWS_URL =
  "https://g.page/r/CZKPvAt8YICJEBM/review";

// Restaurant contact number
const RESTAURANT_PHONE = "+918264380438";

// Check restaurant calling hours using Indian Standard Time.
function isRestaurantOpenForCalls() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const hours = Number(
    parts.find((part) => part.type === "hour").value
  );

  const minutes = Number(
    parts.find((part) => part.type === "minute").value
  );

  const currentTime = hours * 60 + minutes;

  const lunchStart = 11 * 60;
  const lunchEnd = 15 * 60;

  const eveningStart = 18 * 60;
  const eveningEnd = 23 * 60;

  return (
    (currentTime >= lunchStart && currentTime < lunchEnd) ||
    (currentTime >= eveningStart && currentTime < eveningEnd)
  );
}

function handleRestaurantContact() {
  if (!isRestaurantOpenForCalls()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const hours = Number(
      parts.find((part) => part.type === "hour").value
    );

    const minutes = Number(
      parts.find((part) => part.type === "minute").value
    );

    const currentTime = hours * 60 + minutes;

    let message;

    if (currentTime < 11 * 60) {
      message = "The restaurant opens at 11:00 AM.";
    } else if (currentTime < 18 * 60) {
      message = "The restaurant reopens at 6:00 PM.";
    } else {
      message =
        "The restaurant is closed now. It opens tomorrow at 11:00 AM.";
    }

    window.alert(
      "Rohit Food Junction is currently closed for calls.\n\n" +
      message +
      "\n\nLunch: 11:00 AM – 3:00 PM\n" +
      "Evening: 6:00 PM – 11:00 PM"
    );

    return;
  }

  window.location.href = `tel:${RESTAURANT_PHONE}`;
}

function HomeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 10.5L12 3.5L20.5 10.5" />
      <path d="M5.5 9.5V20H18.5V9.5" />
      <path d="M9.5 20V14H14.5V20" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4V20" />
      <path d="M9 4V9" />
      <path d="M12 4V9" />
      <path d="M9 9C9 11 7.5 12 6 12" />
      <path d="M17 4V20" />
      <path d="M17 4C14.5 7 14.5 10 17 12" />
    </svg>
  );
}

function ReviewsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.8L14.5 9L20.2 9.8L16.1 13.8L17.1 19.5L12 16.8L6.9 19.5L7.9 13.8L3.8 9.8L9.5 9L12 3.8Z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="1.5"
      />
      <path d="M4 6L12 12L20 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function NavigationDrawer({ isOpen, onClose }) {
  const location = useLocation();

  const isHome =
    location.pathname === "/" ||
    location.pathname === "/customerhome";

  const isMenu = location.pathname === "/menu";

  return (
    <>
      {/* Overlay */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-60 bg-black/20"
        />
      )}

      {/* Drawer */}

      <aside
        className={`fixed right-0 top-0 z-70 h-full w-70 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}

        <div className="flex items-center justify-between px-4 pb-5 pt-7">
          <h2
            className="text-[18px] font-bold text-[#8d1900]"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Explore
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-[#5a413b]"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-1 px-4">
          {/* Home */}

          <Link
            to="/"
            onClick={onClose}
            className={`flex h-10.5 items-center gap-3 rounded-lg px-3 text-[12px] ${
              isHome
                ? "bg-[#b32d0f] text-white"
                : "text-[#5a413b]"
            }`}
          >
            <HomeIcon />
            <span>Home</span>
          </Link>

          {/* Menu */}

          <Link
            to="/menu"
            onClick={onClose}
            className={`flex h-10.5 items-center gap-3 rounded-lg px-3 text-[12px] ${
              isMenu
                ? "bg-[#b32d0f] text-white"
                : "text-[#5a413b]"
            }`}
          >
            <MenuIcon />
            <span>Menu</span>
          </Link>

          {/* Reviews */}

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex h-10.5 items-center gap-3 rounded-lg px-3 text-[12px] text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
          >
            <ReviewsIcon />
            <span>Reviews</span>
          </a>

          {/* Contact Us */}

          <button
            type="button"
            onClick={() => {
              onClose();
              handleRestaurantContact();
            }}
            className="flex h-10.5 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
          >
            <ContactIcon />
            <span>Contact Us</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default NavigationDrawer;
