

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setIsLoggedIn(Boolean(user));
        setAuthLoading(false);
      },
      (error) => {
        console.error("Unable to check authentication:", error);
        setIsLoggedIn(false);
        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleOurMenuClick = () => {
    if (authLoading) return;
    navigate(isLoggedIn ? "/menu" : "/login");
  };

  return (
    <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#fff8f5] px-6 py-16 sm:px-10 lg:px-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fff8f5] via-[#fffaf8] to-[#fff8f5]" />

      {/* Left-aligned hero content */}
      <div className="relative z-10 mx-0 w-full max-w-5xl">
        <div className="flex flex-col items-start text-left">
          <h1 className="m-0 font-playfair text-4xl font-bold leading-tight tracking-tight text-[#8d1900] sm:text-5xl md:text-6xl">
            Welcome to
            <br />
            Rohit Food Junction
          </h1>

          <p className="mt-5 max-w-3xl font-jakarta text-base font-medium leading-7 text-[#5a413b] sm:text-lg sm:leading-8">
            Experience the authentic taste of India with freshly prepared
            vegetarian and non-vegetarian dishes made using premium
            ingredients, traditional recipes, and exceptional hospitality.
          </p>

          <button
            type="button"
            onClick={handleOurMenuClick}
            disabled={authLoading}
            className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-[#8d1900] px-8 py-4 font-jakarta text-base font-bold text-white shadow-md transition duration-200 hover:bg-[#b32d0f] hover:shadow-lg active:scale-95 disabled:cursor-wait disabled:opacity-70"
          >
            {authLoading ? "Checking..." : "Our Menu"}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
