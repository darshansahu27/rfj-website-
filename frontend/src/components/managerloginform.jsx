import { useState } from "react";

function VisibilityIcon({ visible }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.5 4 10 8a16 16 0 0 1-3.1 4.7" />
          <path d="M6.6 6.6C4.9 7.7 3.7 9.5 2 12c1.5 4 5 8 10 8 1.2 0 2.3-.2 3.3-.6" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function ManagerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const handleEmailChange = (event) => {
    const value = event.target.value;

    setEmail(value);
    setError(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailValid(emailRegex.test(value));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h2
          className="font-playfair text-[28px] font-bold text-[#2d2926] md:text-[32px]"
          style={{
            lineHeight: "34px",
            margin: 0,
          }}
        >
          Manager Login
        </h2>

        <p
          className="max-w-[360px] text-[#6b6b6b]"
          style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "18px",
            margin: "2px 0 0 0",
            padding: 0,
          }}
        >
          Sign in to access the Restaurant Management Dashboard and manage
          orders, menu items, and daily operations.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-xl bg-[#fbf2ed] p-5 shadow-[0_4px_12px_rgba(45,41,38,0.08)] sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="manager-email"
              className="mb-1.5 block font-jakarta text-xs font-semibold text-[#5a413b]"
            >
              Email Address
            </label>

            <div className="relative">
              <input
                id="manager-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your registered email"
                required
                className="h-11 w-full rounded-lg border border-[#8e706a]/20 bg-[#fff8f5] px-3 pr-11 font-jakarta text-sm text-[#1e1b18] outline-none placeholder:text-[#8e706a] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
              />

              {emailValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d1900]">
                  <CheckCircleIcon />
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="manager-password"
              className="mb-1.5 block font-jakarta text-xs font-semibold text-[#5a413b]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="manager-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                className="h-11 w-full rounded-lg border border-[#8e706a]/20 bg-[#fff8f5] px-3 pr-11 font-jakarta text-sm text-[#1e1b18] outline-none placeholder:text-[#8e706a] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a413b] transition-colors hover:text-[#8d1900]"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <VisibilityIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              className="h-4 w-4 rounded border-[#8e706a]/30 accent-[#8d1900]"
            />

            <span className="font-jakarta text-xs font-semibold text-[#5a413b]">
              Remember Me
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6] p-3 text-[#93000a]">
              <div className="mt-0.5 shrink-0">
                <ErrorIcon />
              </div>

              <p className="font-jakarta text-xs font-semibold leading-5">
                Invalid email address or password. Please try again.
              </p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b32d0f] font-jakarta text-sm font-bold text-white shadow-md transition-all hover:bg-[#9d1c2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />

                <span>Signing In...</span>
              </>
            ) : (
              <span>Manager Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManagerLoginForm;