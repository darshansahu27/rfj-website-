function PersonalInformation({
  formData,
  editing = true,
  onChange,
}) {
  return (
    <section className="mx-5 rounded-xl bg-white p-4 shadow-sm">
      {/* Section title */}
      <div className="mb-4 border-b border-[#eadfce] pb-3">
        <h2 className="font-playfair text-base font-semibold text-[#8d1900]">
          Personal Information
        </h2>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="profile-full-name"
            className="mb-1.5 block font-jakarta text-xs font-medium text-[#5a413b]"
          >
            Full Name
          </label>

          <input
            id="profile-full-name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            disabled={!editing}
            className={`h-11 w-full rounded-lg border border-[#e2bfb7] px-3 font-jakarta text-sm text-[#5a413b] outline-none transition ${
              editing
                ? "bg-[#fff8f5] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
                : "bg-[#f8f5f2]"
            }`}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="profile-phone"
            className="mb-1.5 block font-jakarta text-xs font-medium text-[#5a413b]"
          >
            Phone Number
          </label>

          <input
            id="profile-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            disabled={!editing}
            className={`h-11 w-full rounded-lg border border-[#e2bfb7] px-3 font-jakarta text-sm text-[#5a413b] outline-none transition ${
              editing
                ? "bg-[#fff8f5] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
                : "bg-[#f8f5f2]"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="profile-email"
            className="mb-1.5 block font-jakarta text-xs font-medium text-[#5a413b]"
          >
            Email
          </label>

          <input
            id="profile-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            disabled={!editing}
            className={`h-11 w-full rounded-lg border border-[#e2bfb7] px-3 font-jakarta text-sm text-[#5a413b] outline-none transition ${
              editing
                ? "bg-[#fff8f5] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
                : "bg-[#f8f5f2]"
            }`}
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label
            htmlFor="profile-address"
            className="mb-1.5 block font-jakarta text-xs font-medium text-[#5a413b]"
          >
            Delivery Address
          </label>

          <textarea
            id="profile-address"
            name="address"
            value={formData.address}
            onChange={onChange}
            disabled={!editing}
            rows="3"
            className={`w-full resize-none rounded-lg border border-[#e2bfb7] px-3 py-2.5 font-jakarta text-sm text-[#5a413b] outline-none transition ${
              editing
                ? "bg-[#fff8f5] focus:border-[#8d1900] focus:ring-2 focus:ring-[#8d1900]/10"
                : "bg-[#f8f5f2]"
            }`}
          />
        </div>
      </div>
    </section>
  );
}

export default PersonalInformation;