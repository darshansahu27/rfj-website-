
function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9" />
      <path d="M12 3c-2.2 2.5-3.3 5.5-3.3 9s1.1 6.5 3.3 9" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="2.3" />
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="19" r="2.3" />
      <path d="M8.1 10.8l7.8-4.5" />
      <path d="M8.1 13.2l7.8 4.5" />
    </svg>
  );
}

// RFJ Google Business Profile
const GOOGLE_MAPS_URL =
   "https://www.google.com/maps/search/?api=1&query=Rohit%20Food%20Junction";

// Direct Google Review page
const GOOGLE_REVIEWS_URL =
  "https://g.page/r/CZKPvAt8YICJEBM/review";

// Restaurant contact number
const RESTAURANT_PHONE = "+918264380438";

// Check restaurant calling hours using Indian Standard Time.
function isRestaurantOpenForCalls() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

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

function handleRestaurantContact(event) {
  if (!isRestaurantOpenForCalls()) {
    event.preventDefault();

    window.alert(
      "Rohit Food Junction is currently closed for calls.\n\n" +
      "Please contact us during:\n" +
      "Lunch: 11:00 AM – 3:00 PM\n" +
      "Evening: 6:00 PM – 11:00 PM"
    );
  }
}

function Footer() {
  return (
    <>
      <style>{`
        .rfj-footer {
          width: 100%;
          box-sizing: border-box;
          background: #fbf2ed;
          border-top: 1px solid rgba(226, 191, 183, 0.25);
          padding: 32px 60px;
        }

        .rfj-footer-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .rfj-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 7px;
          flex-shrink: 0;
        }

        .rfj-footer-title {
          margin: 0;
          color: #8d1900;
          font-family: "Playfair Display", Georgia, serif;
          font-size: 18px;
          line-height: 24px;
          font-weight: 600;
          font-style: italic;
        }

        .rfj-footer-copy {
          margin: 0;
          color: #5a413b;
          font-family: "Plus Jakarta Sans", Arial, sans-serif;
          font-size: 13px;
          line-height: 20px;
          font-weight: 400;
          white-space: nowrap;
        }

        .rfj-footer-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
        }

        .rfj-footer-nav a {
          color: #5a413b;
          font-family: "Plus Jakarta Sans", Arial, sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .rfj-footer-nav a:hover {
          color: #8d1900;
        }

        .rfj-footer-divider {
          color: #b9a49e;
          margin: 0 14px;
          font-family: "Plus Jakarta Sans", Arial, sans-serif;
          font-size: 14px;
        }

        .rfj-footer-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .rfj-footer-action {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #eee4df;
          color: #1e1b18;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .rfj-footer-action:hover {
          background: #8d1900;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .rfj-footer {
            padding: 28px 24px;
          }

          .rfj-footer-inner {
            flex-direction: column;
            text-align: center;
            gap: 22px;
          }

          .rfj-footer-brand {
            align-items: center;
          }

          .rfj-footer-copy {
            white-space: normal;
          }

          .rfj-footer-nav {
            max-width: 600px;
          }

          .rfj-footer-actions {
            justify-content: center;
          }
        }

        @media (max-width: 520px) {
          .rfj-footer {
            padding: 28px 16px;
          }

          .rfj-footer-nav {
            row-gap: 8px;
          }

          .rfj-footer-divider {
            margin-left: 9px;
            margin-right: 9px;
          }

          .rfj-footer-nav a {
            font-size: 13px;
          }
        }
      `}</style>

      <footer className="rfj-footer">
        <div className="rfj-footer-inner">

          {/* Brand */}
          <div className="rfj-footer-brand">
            <p className="rfj-footer-title">
              Rohit Food Junction
            </p>

            <p className="rfj-footer-copy">
              © 2024 Rohit Food Junction. All rights reserved.
            </p>
          </div>

          {/* Footer navigation */}
          <nav
            className="rfj-footer-nav"
            aria-label="Footer navigation"
          >
            <a
              href={`tel:${RESTAURANT_PHONE}`}
              onClick={handleRestaurantContact}
              aria-label="Call Rohit Food Junction during operating hours"
            >
              Contact
            </a>

            <span className="rfj-footer-divider">|</span>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Address
            </a>

            <span className="rfj-footer-divider">|</span>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Restaurant Hours
            </a>

            <span className="rfj-footer-divider">|</span>

            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reviews
            </a>

            <span className="rfj-footer-divider">|</span>

            <a href="login">
              Login
            </a>
          </nav>

          {/* Footer actions */}
          <div className="rfj-footer-actions">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rfj-footer-action"
              aria-label="Find Rohit Food Junction on Google Maps"
              title="Find us on Google Maps"
            >
              <GlobeIcon />
            </a>

            <button
              type="button"
              className="rfj-footer-action"
              aria-label="Share Rohit Food Junction"
              title="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Rohit Food Junction",
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(
                    window.location.href
                  );
                }
              }}
            >
              <ShareIcon />
            </button>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;
