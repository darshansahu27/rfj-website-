import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      // Allow only letters and spaces
      const filtered = value.replace(/[^A-Za-z\s]/g, "");
      setFormData({ ...formData, fullName: filtered });
      return;
    }

    if (name === "phone") {
      // Allow only digits (max 10)
      const filtered = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: filtered });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendOTP = () => {
    const { fullName, email, phone } = formData;

    if (!/^[A-Za-z\s]+$/.test(fullName)) {
  alert("Name should contain only letters.");
  return;
}

if (fullName.trim().length < 2) {
  alert("Please enter a valid name.");
  return;
}
    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      alert("Name should contain only letters.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/otpverification");
    }, 1200);
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

      <form className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-[#5A413B] mb-1">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#5A413B] mb-1">
            Email Address
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ✉
            </span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className="w-full h-14 rounded-xl border border-gray-200 bg-white pl-12 pr-4 outline-none focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#5A413B] mb-1">
            Mobile Number
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              📱
            </span>

            <span className="absolute left-12 top-1/2 -translate-y-1/2 font-semibold">
              +91
            </span>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full h-14 rounded-xl border border-gray-200 bg-white pl-24 pr-4 outline-none tracking-wider focus:border-[#B32D0F] focus:ring-2 focus:ring-[#B32D0F]/20"
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={loading}
          className={`mt-2 h-14 w-full rounded-full font-semibold text-white shadow-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#B32D0F] hover:opacity-90"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

      </form>

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