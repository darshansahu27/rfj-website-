import { useRef, useState } from "react";

function OwnerProfileModals({
  imageOpen,
  managerOpen,
  logoutOpen,
  onClose,
  manager,
  onSaveManager,
  onSaveImage,
  onLogout,
}) {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  const [managerForm, setManagerForm] = useState({
    name: manager.name,
    email: manager.email,
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      onSaveImage(URL.createObjectURL(file));
      onClose("image");
    }

    e.target.value = "";
  };

  const handleManagerChange = (e) => {
    setManagerForm({
      ...managerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleManagerSave = (e) => {
    e.preventDefault();

    if (
      managerForm.password &&
      managerForm.password !== managerForm.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (!managerForm.password) {
      setError("Please enter a new password.");
      return;
    }

    onSaveManager({
      name: managerForm.name,
      email: managerForm.email,
    });

    setError("");
    onClose("manager");
  };

  return (
    <>
      {/* Profile Image Modal */}
      {imageOpen && (
        <Modal onClose={() => onClose("image")}>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5e9e4] text-[#8d1900]">
              <CameraIcon />
            </div>

            <h3 className="font-playfair text-xl font-bold text-[#8d1900]">
              Update Profile Photo
            </h3>

            <p className="mt-1.5 font-jakarta text-xs text-[#8e706a]">
              Choose an option to update your profile photo
            </p>
          </div>

          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleImage}
          />

          <div className="space-y-3">
            <PhotoOption
              title="Upload Image"
              description="Upload a photo from your device"
              onClick={() => galleryRef.current?.click()}
              icon={<UploadIcon />}
              primary
            />

            <PhotoOption
              title="Choose from Gallery"
              description="Select an existing photo"
              onClick={() => galleryRef.current?.click()}
              icon={<GalleryIcon />}
            />

            <PhotoOption
              title="Take Photo"
              description="Take a new photo with your camera"
              onClick={() => cameraRef.current?.click()}
              icon={<CameraIcon />}
            />

            <button
              type="button"
              onClick={() => onClose("image")}
              className="mt-2 w-full rounded-xl py-3 font-jakarta text-sm font-bold text-[#8e706a] transition hover:bg-[#f5e9e4]"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Manager Credentials Modal */}
      {managerOpen && (
        <Modal onClose={() => onClose("manager")} bottom>
          <h3 className="mb-5 font-playfair text-xl font-bold text-[#8d1900]">
            Manager Credentials
          </h3>

          <form onSubmit={handleManagerSave} className="space-y-4">
            <ModalInput
              label="Manager Name"
              name="name"
              value={managerForm.name}
              onChange={handleManagerChange}
            />

            <ModalInput
              label="Manager Email"
              name="email"
              type="email"
              value={managerForm.email}
              onChange={handleManagerChange}
            />

            <div>
              <label className="font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
                New Password
              </label>

              <div className="relative mt-1">
                <input
                  required
                  minLength={6}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={managerForm.password}
                  onChange={handleManagerChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-[#e2bfb7] bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#b32d0f]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e706a]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <ModalInput
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={managerForm.confirmPassword}
              onChange={handleManagerChange}
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-[#b32d0f] py-3 text-sm font-bold text-white"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => onClose("manager")}
                className="flex-1 rounded-full bg-[#efe6e2] py-3 text-sm font-bold text-[#2b211e]"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Logout Confirmation Modal */}
      {logoutOpen && (
        <Modal onClose={() => onClose("logout")}>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a]">
              <WarningIcon />
            </div>

            <h3 className="font-playfair text-xl font-bold text-[#2b211e]">
              Confirm Logout?
            </h3>

            <p className="mb-5 mt-2 font-jakarta text-sm leading-6 text-[#8e706a]">
              You will need to sign back in to access the owner portal.
            </p>

            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-full bg-[#ba1a1a] py-3 font-jakarta text-sm font-bold text-white"
              >
                Yes, Logout
              </button>

              <button
                type="button"
                onClick={() => onClose("logout")}
                className="w-full py-3 font-jakarta text-sm font-bold text-[#8e706a]"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose, bottom = false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e1b18]/40 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-md rounded-3xl bg-[#fff8f5] p-6 shadow-2xl ${
          bottom ? "mt-auto rounded-b-none sm:mt-0 sm:rounded-3xl" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function PhotoOption({
  title,
  description,
  icon,
  onClick,
  primary = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.99] ${
        primary
          ? "border-[#b32d0f] bg-[#b32d0f] text-white hover:bg-[#9f270d]"
          : "border-[#eadbd5] bg-white text-[#2b211e] hover:border-[#c9a79b] hover:bg-[#fdf7f4]"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          primary
            ? "bg-white/15 text-white"
            : "bg-[#f5e9e4] text-[#8d1900]"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block font-jakarta text-sm font-bold ${
            primary ? "text-white" : "text-[#2b211e]"
          }`}
        >
          {title}
        </span>

        <span
          className={`mt-0.5 block font-jakarta text-xs ${
            primary ? "text-white/75" : "text-[#8e706a]"
          }`}
        >
          {description}
        </span>
      </span>

      <ChevronIcon
        className={primary ? "text-white/70" : "text-[#b09d96]"}
      />
    </button>
  );
}

function ModalInput({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]">
        {label}
      </label>

      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[#e2bfb7] bg-white px-4 py-3 text-sm outline-none focus:border-[#b32d0f]"
      />
    </div>
  );
}

/* ---------- SVG Icons ---------- */

function UploadIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M21 15l-4-4-7 7" />
      <path d="M14 16l2-2 5 5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h3l1.5-2h7L17 7h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6 0 9.5 7 9.5 7a17.4 17.4 0 0 1-3.1 3.9" />
      <path d="M6.6 6.6C4.1 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1.2 0 2.3-.2 3.3-.6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.8L2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.8a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default OwnerProfileModals;


