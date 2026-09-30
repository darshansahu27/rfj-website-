import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RESEND_TIME = 10;

function OtpVerificationForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  /* Focus first OTP box */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* Countdown */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* OTP input */
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* Keyboard navigation */
  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* Paste OTP */
  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  /* Resend OTP */
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(RESEND_TIME);
    inputRefs.current[0]?.focus();
  };

  /* Verify OTP */
  const handleVerify = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      /*
       * Temporary frontend behavior.
       * Real backend verification will be connected later.
       */
      navigate("/");
    }, 1200);
  };

  const otpComplete = otp.join("").length === 6;

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#FFF8F5]
        px-4
        py-12

        sm:px-6
        sm:py-16

        lg:px-8
        lg:py-20
      "
    >
      {/* ONE central layout column */}
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-130
          flex-col
          items-center
        "
      >
        {/* ================================
            HEADING
        ================================= */}
        <div className="w-full text-center">
          <h1
            className="
              font-playfair
              text-[28px]
              font-bold
              leading-[1.15]
              text-[#2D2926]

              sm:text-[30px]

              lg:text-[34px]
            "
          >
            Verify Your Mobile Number
          </h1>

          <p className="mt-2 text-center font-jakarta text-[14px] leading-5 text-[#5A413B]">
                We've sent a 6-digit verification code to your registered mobile number.
 </p>

          <p
            className="
              mt-1
              font-jakarta
              text-[14px]
              font-bold
              leading-5
              text-[#8D1900]
            "
          >
            +91 98765 43210
          </p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="
              mt-2
              font-jakarta
              text-[13px]
              leading-5
              text-[#8D1900]
              underline
              underline-offset-4
              transition-opacity
              hover:opacity-80
            "
          >
            Change Mobile Number
          </button>
        </div>

        {/* ================================
            OTP BOXES
        ================================= */}
        <div
          className="
            mt-9
            flex
            w-full
            items-center
            justify-center
            gap-2

            sm:mt-10
            sm:gap-3
          "
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={
                index === 0 ? "one-time-code" : "off"
              }
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleOtpChange(
                  index,
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              aria-label={`OTP digit ${index + 1}`}
              className="
                h-12
                w-10
                shrink-0
                rounded-xl
                border
                border-[#E2BFB7]
                bg-white
                text-center
                font-jakarta
                text-lg
                font-semibold
                text-[#2D2926]
                outline-none
                transition-all

                focus:border-[#8D1900]
                focus:ring-2
                focus:ring-[#8D1900]/20

                sm:h-14
                sm:w-11

                lg:h-16
                lg:w-12
              "
            />
          ))}
        </div>

        {/* ================================
            TIMER
        ================================= */}
        <div
          className="
            mt-7
            w-full
            text-center
          "
        >
          {timeLeft > 0 ? (
            <p
              className="
                font-jakarta
                text-[12px]
                leading-4
                text-[#5A413B]
              "
            >
              Resend OTP in{" "}
              <span className="font-bold text-[#8D1900]">
                00:{String(timeLeft).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="
                font-jakarta
                text-[13px]
                font-semibold
                leading-4
                text-[#8D1900]
                hover:underline
              "
            >
              Resend Code
            </button>
          )}
        </div>

        {/* ================================
            VERIFY BUTTON
        ================================= */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!otpComplete || loading}
          className={`
            mt-7
            h-14
            w-full
            rounded-xl
            font-jakarta
            text-[14px]
            font-semibold
            text-white
            shadow-md
            transition-all

            ${
              !otpComplete || loading
                ? "cursor-not-allowed bg-[#B8AAA5]"
                : "bg-[#B32D0F] hover:opacity-90 active:scale-[0.99]"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span
                className="
                  mr-2
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-white/30
                  border-t-white
                "
              />

              Verifying...
            </span>
          ) : (
            "Verify & Create Account"
          )}
        </button>

        {/* ================================
            BACK TO SIGNUP
        ================================= */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="
            mt-6
            font-jakarta
            text-[13px]
            leading-5
            text-[#5A413B]
            transition-colors
            hover:text-[#8D1900]
          "
        >
          ← Back to Sign Up
        </button>
      </div>
    </main>
  );
}

export default OtpVerificationForm;