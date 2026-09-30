import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function OtpVerificationForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  /*
   * Start focus on the first OTP box.
   */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /*
   * Resend countdown.
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /*
   * Handle typing into an OTP box.
   */
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    /*
     * Automatically move to the next box.
     */
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
   * Handle keyboard navigation.
   */
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
   * Allow the user to paste a complete 6-digit OTP.
   */
  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const updatedOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  /*
   * Resend OTP.
   */
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(10);
    inputRefs.current[0]?.focus();
  };

  /*
   * Verify OTP.
   *
   * This is currently frontend-only.
   * The real backend/API verification will be connected later.
   */
  const handleVerify = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      /*
       * Temporary behavior until the backend authentication
       * system is connected.
       *
       * For now, return to the home page after successful
       * frontend verification.
       */
      navigate("/");
    }, 1200);
  };

  const otpComplete = otp.join("").length === 6;

  return (
    <main className="flex min-h-[calc(100vh-64px)] w-screen items-center justify-center px-5 py-16">
      <section className="flex w-full max-w-md flex-col items-center">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="font-playfair text-[28px] font-bold leading-9 text-[#1E1B18] md:text-[32px] md:leading-10">
            Verify Your Mobile Number
          </h1>

          <p className="mt-2 text-center font-jakarta text-[14px] leading-5 text-[#5A413B]">
                We've sent a 6-digit verification code to your registered mobile number.
          </p>

          <p className="mt-1 font-jakarta text-[14px] font-bold leading-5 text-[#8D1900]">
            +91 98765 43210
          </p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-2 font-jakarta text-[12px] font-bold leading-4 text-[#8D1900] underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Change Mobile Number
          </button>
        </div>

        {/* OTP inputs */}
        <div
        className="mb-5 flex justify-center gap-2"
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
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleOtpChange(index, event.target.value)
              }
              onKeyDown={(event) => handleKeyDown(index, event)}
              aria-label={`OTP digit ${index + 1}`}
              className="
                h-14
                w-11
                rounded-xl
                border
                border-[#E2BFB7]
                bg-white
                text-center
                font-jakarta
                text-xl
                font-semibold
                text-[#1E1B18]
                outline-none
                transition-all
                focus:border-[#8D1900]
                focus:ring-2
                focus:ring-[#8D1900]/20
                md:h-16
                md:w-12
              "
            />
          ))}
        </div>

        {/* Resend timer */}
        <div className="mb-7 text-center">
          {timeLeft > 0 ? (
            <p className="font-jakarta text-[12px] leading-4 text-[#5A413B]">
              Resend OTP in{" "}
              <span className="font-bold text-[#8D1900]">
                00:{String(timeLeft).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-jakarta text-[12px] font-bold leading-4 text-[#8D1900] hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Verify button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!otpComplete || loading}
          className={`
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-xl
            font-jakarta
            text-[14px]
            font-bold
            text-white
            shadow-md
            transition-all
            ${
              !otpComplete || loading
                ? "cursor-not-allowed bg-[#B8AAA5]"
                : "bg-[#B32D0F] hover:opacity-90 active:scale-[0.98]"
            }
          `}
        >
          {loading ? (
            <>
              <span
                className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              Verifying...
            </>
          ) : (
            "Verify & Create Account"
          )}
        </button>

        {/* Back to signup */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mx-auto mt-5 flex items-center justify-center gap-1 font-jakarta text-[12px] leading-4 text-[#5A413B] transition-colors hover:text-[#8D1900]"
        >
          <span aria-hidden="true">←</span>
          Back to Sign Up
        </button>
      </section>
    </main>
  );
}

export default OtpVerificationForm;