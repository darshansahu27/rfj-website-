import { useEffect, useState } from "react";

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Keep the form synchronized when the profile is loaded or updated.
  useEffect(() => {
    if (!editing) {
      setForm(profile);
    }
  }, [profile, editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);

    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      // Close the form only after the backend save succeeds.
      setEditing(false);
    } catch (error) {
      setSaveError(
        error.message || "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setSaveError("");
    setEditing(false);
  };

  const handleEdit = () => {
    setForm(profile);
    setSaveError("");
    setEditing(true);
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
            onClick={handleEdit}
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
            value={form.name || ""}
            onChange={handleChange}
            disabled={saving}
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            type="tel"
            disabled={saving}
          />

          <InputField
  label="Email Address"
  name="email"
  value={form.email || ""}
  type="email"
  disabled={true}
/>

          {saveError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {saveError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#b32d0f] py-3 font-jakarta text-sm font-bold text-white shadow-sm transition hover:bg-[#92240c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-full bg-[#efe6e2] py-3 font-jakarta text-sm font-bold text-[#2b211e] disabled:cursor-not-allowed disabled:opacity-60"
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

      <p className="wrap-break-word font-jakarta text-[12px] text-[#5a413b]">
        {value || "Not provided"}
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
  disabled = false,
}) {
  return (
    <div>
      <label
        htmlFor={`owner-profile-${name}`}
        className="ml-1 font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]"
      >
        {label}
      </label>

      <input
        id={`owner-profile-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        maxLength={name === "name" ? 100 : name === "phone" ? 25 : undefined}
        className="mt-1 w-full rounded-lg border border-[#e2bfb7] bg-[#fff8f5] px-3 py-3 font-jakarta text-sm text-[#2b211e] outline-none transition focus:border-[#b32d0f] focus:ring-2 focus:ring-[#b32d0f]/10 disabled:opacity-60"
      />
    </div>
  );
}

export default OwnerInformationCard;