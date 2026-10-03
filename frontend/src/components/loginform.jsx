import React from "react";
import { useNavigate } from "react-router-dom";


function LoginForm() {
    const navigate = useNavigate();
  return (
    <section className="w-full flex justify-center px-4 py-8 sm:py-10 lg:py-12">
      <div
        className="
          w-full
          max-w-105
          bg-white
          rounded-[18px]
          border border-[#eadfd9]
          shadow-[0_2px_6px_rgba(0,0,0,0.10)]
          px-7
          py-9
          sm:px-8
          sm:py-10
          lg:px-10
          lg:py-10
        "
      >
        {/* Cutlery Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-16
              h-16
              rounded-full
              bg-[#ffd9d2]
              flex
              items-center
              justify-center
            "
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Fork */}
              <path
                d="M7 3V10"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M5 3V7"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M9 3V7"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M5 7C5 9 6 10 7 10C8 10 9 9 9 7"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10V21"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Knife */}
              <path
                d="M15 3V21"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M15 3C18 4 19 6.5 19 9C19 10.2 17.5 11 15 11"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1
            className="
              font-playfair
              text-[30px]
              sm:text-[32px]
              font-bold
              leading-[1.1]
              text-[#8d1900]
            "
          >
            Welcome Back
          </h1>

          <p
  className="
    mt-2
    mx-auto
    max-w-90
    font-jakarta
    text-[15px]
    sm:text-[16px]
    leading-[1.35]
    text-[#5a413b]
  "
>
  Login with your mobile number to continue ordering your favourite meals
  from Rohit Food Junction.
</p>
        </div>

        {/* Mobile Number */}
        <div className="mt-8">
          <label
            htmlFor="login-mobile"
            className="
              block
              font-jakarta
              text-[13px]
              font-semibold
              text-[#241714]
              mb-2
            "
          >
            Mobile Number
          </label>

          <div
            className="
              w-full
              h-14
              flex
              items-center
              overflow-hidden
              rounded-xl
              border
              border-[#efb9ad]
              bg-white
            "
          >
            {/* Phone Icon + Country Code */}
            <div
              className="
                h-full
                flex
                items-center
                gap-2
                px-4
                border-r
                border-[#efb9ad]
                shrink-0
              "
            >
              {/* Phone icon */}
              <svg
                width="14"
                height="18"
                viewBox="0 0 24 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="2"
                  width="14"
                  height="24"
                  rx="2.5"
                  stroke="#5A413B"
                  strokeWidth="1.7"
                />
                <path
                  d="M9 5H15"
                  stroke="#5A413B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="22.5"
                  r="1"
                  fill="#5A413B"
                />
              </svg>

              <span
                className="
                  font-jakarta
                  text-[14px]
                  text-[#5a413b]
                  whitespace-nowrap
                "
              >
                +91
              </span>
            </div>

            {/* Number Input */}
            <input
              id="login-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter Mobile Number"
              className="
                min-w-0
                flex-1
                h-full
                px-4
                outline-none
                bg-transparent
                font-jakarta
                text-[16px]
                text-[#3d2924]
                placeholder:text-[#b6a6a1]
              "
            />
          </div>
        </div>

        {/* Send OTP Button */}
        <button
          type="button"
          onClick={() => navigate("/loginotpverification")}
          className="
            w-full
            h-14
            mt-5
            rounded-full
            bg-[#d72b08]
            hover:bg-[#c52707]
            active:bg-[#b92306]
            text-white
            font-jakarta
            text-[16px]
            font-medium
            shadow-[0_5px_8px_rgba(0,0,0,0.16)]
            transition-colors
            duration-200
          "
        >
          Send OTP
          <span className="ml-1 text-[20px] align-[-2px]">→</span>
        </button>

        {/* Sign Up Link */}
        <div className="mt-7 text-center">
          <p
            className="
              font-jakarta
              text-[14px]
              sm:text-[15px]
              text-[#5a413b]
            "
          >
            New to Rohit Food Junction?{" "}
            <a
              href="/signup"
              className="
                text-[#8d1900]
                font-medium
                hover:underline
              "
            >
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;