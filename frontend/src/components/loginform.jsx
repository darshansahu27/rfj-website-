
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Step 1: Authenticate the customer with Firebase.
      const credential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      // Step 2: Get the Firebase ID token.
      const idToken = await credential.user.getIdToken();

      // Step 3: Verify that the account has a customer profile.
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/profile/customer`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      let result = null;
const responseText = await response.text();

if (responseText) {
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error(
      "Profile API returned a non-JSON response:",
      response.status,
      responseText.slice(0, 200)
    );
  }
}

if (!response.ok || !result?.success) {
  await signOut(auth);

  if (response.status === 404 || response.status === 405) {
    throw new Error(
      "The customer profile service is unavailable. Please try again later."
    );
  }

  throw new Error(
    result?.message ||
      "We couldn't verify your customer profile. Please try again."
  );
}

      if (!response.ok || !result.success) {
        await signOut(auth);

        throw new Error(
          result.message || "Your customer profile could not be verified."
        );
      }

      if (result.profile?.role !== "customer") {
        await signOut(auth);

        throw new Error(
          "This account is not authorized for customer login."
        );
      }

      // Step 4: Redirect after authentication and profile verification.
      navigate("/menu", { replace: true });
    } catch (err) {
      console.error("Customer login failed:", err);

      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email address or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Please wait before trying again."
        );
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else if (err.message === "Failed to fetch") {
        setError("Cannot connect to the backend. Please try again.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();

    setError("");
    setMessage("");

    if (!trimmedEmail) {
      setError("Enter your email address first to reset your password.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);

      setMessage(
        "If an account exists for this email, a password reset email will be sent. Check your inbox and spam folder."
      );
    } catch (err) {
      console.error("Password reset request failed:", err);

      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait before trying again.");
      } else {
        // Avoid disclosing whether a particular email is registered.
        setMessage(
          "If an account exists for this email, a password reset email will be sent. Check your inbox and spam folder."
        );
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center px-5 py-8 sm:py-10 lg:py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2BFB7] shadow-lg px-6 py-8 sm:px-8 sm:py-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FFDAD2] text-[#8D1900] text-3xl mx-auto mb-4">
            🍴
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#8D1900] mb-2">
            Welcome Back
          </h1>

          <p className="font-jakarta text-base leading-6 text-[#5A413B]">
            Log in with your email and password to continue ordering your
            favorite meals from Rohit Food Junction.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-semibold text-[#241714] mb-2"
            >
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="w-full h-14 rounded-xl border border-[#E2BFB7] bg-white px-4 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-[#241714] mb-2"
            >
              Password
            </label>

            <div className="flex items-center w-full h-14 rounded-xl border border-[#E2BFB7] bg-white focus-within:border-[#B32D0F] focus-within:ring-2 focus-within:ring-[#B32D0F]/20">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="flex-1 min-w-0 h-full rounded-xl bg-transparent px-4 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="px-4 text-sm font-semibold text-[#8D1900]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-sm font-semibold text-[#8D1900] underline disabled:opacity-50"
              >
                {resetLoading ? "Sending reset email..." : "Forgot Password?"}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-[#B32D0F] text-white font-semibold shadow-md hover:bg-[#8D1900] transition disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Logging In..." : "Log In →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E2BFB7] text-center">
          <p className="text-sm sm:text-base text-[#5A413B]">
            New to Rohit Food Junction?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#8D1900] underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
