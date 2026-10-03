import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginOtpVerificationForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const mobileNumber = "+919876543210";

  function handleOtpChange(value, index) {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(event, index) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleVerifyOtp() {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    console.log("Entered OTP:", enteredOtp);

    // Add your actual OTP verification logic here.
  }

  function handleResendOtp() {
    console.log("Resend OTP");

    // Add your actual resend OTP logic here.
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-[#fff8f5] px-4 pt-8">
      <div className="w-full max-w-102 text-center">

        {/* Heading */}
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-[30px] font-bold leading-9 text-[#1e1b18]"
        >
          Verify Your Mobile Number
        </h1>

        {/* Description */}
        <p className="mt-2 text-[14px] leading-5 text-[#5a413b]">
          We've sent a 6-digit verification code to
        </p>

        {/* Mobile Number */}
        <p className="text-[14px] font-semibold leading-5 text-[#8d1900]">
          {mobileNumber}
        </p>

        {/* Change Mobile Number */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-1 text-[13px] font-semibold text-[#1e1b18] hover:underline"
        >
          Change Mobile Number
        </button>

        {/* OTP Inputs */}
        <div className="mt-8 flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleOtpChange(event.target.value, index)
              }
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="h-14 w-14 rounded-lg border border-[#e2bfb7] bg-white text-center text-[20px] font-semibold text-[#1e1b18] outline-none focus:border-[#8d1900] focus:ring-1 focus:ring-[#8d1900]"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <button
          type="button"
          onClick={handleResendOtp}
          className="mt-6 text-[14px] font-medium text-[#8d1900] hover:underline"
        >
          ↻ Resend OTP
        </button>

        {/* Verify OTP */}
        <button
          type="button"
          onClick={handleVerifyOtp}
          className="mt-6 h-12 w-full rounded-lg bg-[#b32d0f] text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#8d1900]"
        >
          Verify OTP
        </button>

        {/* Back to Login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 text-[13px] font-medium text-[#5a413b] hover:underline"
        >
          ← Back to Login
        </button>
      </div>
    </section>
  );
}

export default LoginOtpVerificationForm;