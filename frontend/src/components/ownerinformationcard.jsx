import { useState } from "react";

function PersonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4.1 3.4-6 8-6s7.3 1.9 8 6" />
    </svg>
  );
}

function OwnerInformationCard({ profile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <section className="rounded-xl border border-[#e9e1dc]/70 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-playfair text-[17px] font-bold text-[#8d1900]">
          <PersonIcon />
          Owner Information
        </h3>

        {!editing && (
          <button
            id="edit-profile-btn"
            type="button"
            onClick={() => setEditing(true)}
            className="font-jakarta text-[11px] font-semibold text-[#b32d0f] hover:underline"
          >
            Edit Profile
          </button>
        )}
      </div>

      {!editing ? (
        <div className="space-y-2">
          <InfoItem label="Full Name" value={profile.name} />
          <InfoItem label="Phone Number" value={profile.phone} />
          <InfoItem label="Email Address" value={profile.email} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-3">
          <InputField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
          />

          <InputField
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-[#b32d0f] py-3 font-jakarta text-sm font-bold text-white shadow-sm"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-full bg-[#efe6e2] py-3 font-jakarta text-sm font-bold text-[#2b211e]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg bg-[#fff8f5] px-3 py-2.5">
      <p className="mb-0.5 font-jakarta text-[9px] font-bold uppercase tracking-wide text-[#8e706a]">
        {label}
      </p>

      <p className="break-words font-jakarta text-[12px] text-[#5a413b]">
        {value}
      </p>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="ml-1 font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 w-full rounded-lg border border-[#e2bfb7] bg-[#fff8f5] px-3 py-3 font-jakarta text-sm text-[#2b211e] outline-none transition focus:border-[#b32d0f] focus:ring-2 focus:ring-[#b32d0f]/10"
      />
    </div>
  );
}

export default OwnerInformationCard;