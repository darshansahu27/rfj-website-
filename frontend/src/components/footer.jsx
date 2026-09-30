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
          font-style: normal;
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

          <div className="rfj-footer-brand">
            <p className="rfj-footer-title">
              Rohit Food Junction
            </p>

            <p className="rfj-footer-copy">
              © 2024 Rohit Food Junction. All rights reserved.
            </p>
          </div>

          <nav className="rfj-footer-nav">
            <a href="#contact">Contact</a>

            <span className="rfj-footer-divider">|</span>

            <a href="#address">Address</a>

            <span className="rfj-footer-divider">|</span>

            <a href="#hours">Restaurant Hours</a>

            <span className="rfj-footer-divider">|</span>

            <a href="#reviews">Reviews</a>

            <span className="rfj-footer-divider">|</span>

            <a href="#login">Login</a>
          </nav>

          <div className="rfj-footer-actions">
            <a
              href="#"
              className="rfj-footer-action"
              aria-label="Website"
            >
              <GlobeIcon />
            </a>

            <button
              type="button"
              className="rfj-footer-action"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Rohit Food Junction",
                    url: window.location.href,
                  });
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