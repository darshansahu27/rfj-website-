import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.7" />
      <path d="M6.1 6.1C3.7 8.1 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.9-.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function LockNoticeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3h-2V7a2 2 0 0 0-4 0v3H8Z" />
    </svg>
  );
}

function OwnerLoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    // Temporary frontend login simulation.
    // Replace this with the real API call later.
    setTimeout(() => {
      setLoading(false);

      if (rememberMe) {
        localStorage.setItem("rfj_owner_email", trimmedEmail);
      }

      navigate("/managerdashboard");
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl bg-white p-5 shadow-sm"
    >
      {/* Email */}
      <div>
        <label className="font-jakarta text-[12px] font-semibold text-[#5a413b]">
          Email Address
        </label>

        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e706a]">
            <MailIcon />
          </span>

          <input
            type="email"
            value={email}
            disabled={loading}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="Enter your owner email"
            className="h-11 w-full rounded-lg bg-[#f8ebe5] pl-10 pr-3 font-jakarta text-[12px] text-[#2b211e] outline-none placeholder:text-[#b9a9a2] focus:ring-2 focus:ring-[#8d1900]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mt-4">
        <label className="font-jakarta text-[12px] font-semibold text-[#5a413b]">
          Password
        </label>

        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e706a]">
            <LockIcon />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            disabled={loading}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg bg-[#f8ebe5] pl-10 pr-11 font-jakarta text-[12px] text-[#2b211e] outline-none placeholder:text-[#b9a9a2] focus:ring-2 focus:ring-[#8d1900]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e706a] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-lg bg-[#fff0ec] px-3 py-2 font-jakarta text-[11px] font-semibold text-[#c92f0f]">
          {error}
        </p>
      )}

      {/* Remember Me */}
      <label
        className={`mt-4 flex items-center gap-2 ${
          loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={rememberMe}
          disabled={loading}
          onChange={(event) => setRememberMe(event.target.checked)}
          className="h-4 w-4 rounded border-[#eadfce] accent-[#8d1900]"
        />

        <span className="font-jakarta text-[11px] text-[#6b6b6b]">
          Remember Me
        </span>
      </label>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#c92f0f] font-jakarta text-[12px] font-bold text-white shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-5 flex items-start gap-2 text-[#b9a9a2]">
        <span className="mt-0.5 shrink-0">
          <LockNoticeIcon />
        </span>

        <p className="font-jakarta text-[9px] leading-4">
          This portal is restricted to restaurant owner only. Only authorized
          personnel may access this system.
        </p>
      </div>
    </form>
  );
}

export default OwnerLoginForm;