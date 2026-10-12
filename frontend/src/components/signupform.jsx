import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function SignupForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Please enter a name between 2 and 100 characters.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    let userCreated = false;

    try {
      // Step 1: Create the Firebase account.
      const credential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      userCreated = true;

      // Step 2: Save the customer's name in Firebase Authentication.
      await updateProfile(credential.user, {
        displayName: trimmedName,
      });

      // Step 3: Get a Firebase ID token.
      const idToken = await credential.user.getIdToken();

      // Step 4: Create the customer profile in Supabase through the backend.
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/profile/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fullName: trimmedName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create your customer profile."
        );
      }

      // Step 5: Redirect only after profile creation succeeds.
      navigate("/menu", { replace: true });
    } catch (err) {
      console.error("Customer signup failed:", err);

      if (userCreated) {
        try {
          // Sign out if registration did not finish successfully.
          await signOut(auth);
        } catch (signOutError) {
          console.error("Sign-out after signup failure failed:", signOutError);
        }
      }

      if (err.code === "auth/email-already-in-use") {
        setError("An account already exists with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Please choose a stronger password.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email and password signup is disabled in Firebase.");
      } else if (err.message === "Failed to fetch") {
        setError("Cannot connect to the backend. Please try again.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow pt-24 pb-12 px-5 max-w-md mx-auto w-full">
      <section className="mb-8">
        <h2 className="font-playfair text-4xl font-bold text-[#2D2926] mb-2">
          Create Your Account
        </h2>

        <p className="font-jakarta text-[#5A413B]">
          Create your account here and start ordering your favorite meals.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-[#5A413B] mb-1"
          >
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
          />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#5A413B] mb-1"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            required
            className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-[#5A413B] mb-1"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={6}
              required
              className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 pr-14 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8D1900]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="text-sm text-[#5A413B] mt-2">
            Use at least 6 characters.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-14 w-full rounded-full font-semibold text-white shadow-lg transition bg-[#B32D0F] hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Your Account"}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-[#2D2926]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#B32D0F] underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignupForm;