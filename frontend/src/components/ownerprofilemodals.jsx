import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase";

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
    name: manager?.name || "",
    email: manager?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [savingManager, setSavingManager] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Refresh the form when the modal opens or manager data changes.
  useEffect(() => {
    if (managerOpen) {
      setManagerForm({
        name: manager?.name || "",
        email: manager?.email || "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      setShowPassword(false);
    }
  }, [managerOpen, manager?.name, manager?.email]);

  const handleImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Please select a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);
    setImageError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "Please log in again to update your profile photo."
        );
      }

      const token = await user.getIdToken();
      const formData = new FormData();

      formData.append("avatar", file);

      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/profile/owner/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to upload profile photo."
        );
      }

      if (!result.avatarUrl) {
        throw new Error(
          "The server did not return the uploaded image URL."
        );
      }

      onSaveImage(result.avatarUrl);
      onClose("image");
    } catch (uploadError) {
      console.error(
        "Owner profile photo upload failed:",
        uploadError
      );

      setImageError(
        uploadError.message || "Unable to upload profile photo."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleManagerChange = (event) => {
    const { name, value } = event.target;

    setManagerForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleManagerSave = async (event) => {
    event.preventDefault();

    if (savingManager) return;

    const name = managerForm.name.trim();
    const email = managerForm.email.trim();
    const password = managerForm.password;
    const confirmPassword = managerForm.confirmPassword;

    if (name.length < 2 || name.length > 100) {
      setError("Manager name must be between 2 and 100 characters.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid manager email address.");
      return;
    }

    if (password && password.length < 6) {
      setError("The new password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSavingManager(true);

    try {
      // The parent handler calls the protected backend endpoint.
      await onSaveManager({
        name,
        email,
        password,
      });

      setManagerForm({
        name,
        email,
        password: "",
        confirmPassword: "",
      });

      setError("");
      onClose("manager");
    } catch (saveError) {
      setError(
        saveError.message || "Unable to update manager credentials."
      );
    } finally {
      setSavingManager(false);
    }
  };

  return (
    <>
      {/* Profile Image Modal */}
      {imageOpen && (
        <Modal
          onClose={() => {
            if (!uploadingImage) {
              setImageError("");
              onClose("image");
            }
          }}
        >
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

            {uploadingImage && (
              <p
                role="status"
                className="mt-3 text-sm text-[#8d1900]"
              >
                Uploading your photo...
              </p>
            )}

            {imageError && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-600"
              >
                {imageError}
              </p>
            )}
          </div>

          <input
            ref={galleryRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImage}
            disabled={uploadingImage}
          />

          <input
            ref={cameraRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="user"
            className="hidden"
            onChange={handleImage}
            disabled={uploadingImage}
          />

          <div className="space-y-3">
            <PhotoOption
              title="Upload Image"
              description="Upload a photo from your device"
              onClick={() => {
                setImageError("");
                galleryRef.current?.click();
              }}
              icon={<UploadIcon />}
              primary
              disabled={uploadingImage}
            />

            <PhotoOption
              title="Choose from Gallery"
              description="Select an existing photo"
              onClick={() => {
                setImageError("");
                galleryRef.current?.click();
              }}
              icon={<GalleryIcon />}
              disabled={uploadingImage}
            />

            <PhotoOption
              title="Take Photo"
              description="Take a new photo with your camera"
              onClick={() => {
                setImageError("");
                cameraRef.current?.click();
              }}
              icon={<CameraIcon />}
              disabled={uploadingImage}
            />

            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => {
                setImageError("");
                onClose("image");
              }}
              className="mt-2 w-full rounded-xl py-3 font-jakarta text-sm font-bold text-[#8e706a] transition hover:bg-[#f5e9e4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Manager Credentials Modal */}
      {managerOpen && (
        <Modal
          onClose={() => {
            if (!savingManager) {
              setError("");
              onClose("manager");
            }
          }}
          bottom
        >
          <h3 className="mb-2 font-playfair text-xl font-bold text-[#8d1900]">
            Edit Manager Credentials
          </h3>

          <p className="mb-5 text-xs leading-5 text-[#8e706a]">
            Changes will apply to the existing manager account.
            Leave the new password fields blank to keep the current
            password.
          </p>

          <form onSubmit={handleManagerSave} className="space-y-4">
            <ModalInput
              label="Manager Name"
              name="name"
              value={managerForm.name}
              onChange={handleManagerChange}
              disabled={savingManager}
            />

            <ModalInput
              label="Manager Email"
              name="email"
              type="email"
              value={managerForm.email}
              onChange={handleManagerChange}
              disabled={savingManager}
            />

            <div>
              <label
                htmlFor="manager-new-password"
                className="font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]"
              >
                New Password (Optional)
              </label>

              <div className="relative mt-1">
                <input
                  id="manager-new-password"
                  minLength={6}
                  name="password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  value={managerForm.password}
                  onChange={handleManagerChange}
                  placeholder="Leave blank to keep current password"
                  disabled={savingManager}
                  className="w-full rounded-xl border border-[#e2bfb7] bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#b32d0f] disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={savingManager}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e706a] disabled:opacity-50"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <ModalInput
              label="Confirm New Password"
              name="confirmPassword"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={managerForm.confirmPassword}
              onChange={handleManagerChange}
              disabled={savingManager}
              required={Boolean(managerForm.password)}
            />

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-[#fff0ec] px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savingManager}
                className="flex-1 rounded-full bg-[#b32d0f] py-3 text-sm font-bold text-white transition hover:bg-[#9f270d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingManager ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                disabled={savingManager}
                onClick={() => {
                  setError("");
                  onClose("manager");
                }}
                className="flex-1 rounded-full bg-[#efe6e2] py-3 text-sm font-bold text-[#2b211e] disabled:cursor-not-allowed disabled:opacity-60"
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#1e1b18]/40 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div
        className={`relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#fff8f5] p-6 shadow-2xl ${
          bottom
            ? "mt-auto rounded-b-none sm:mt-0 sm:rounded-3xl"
            : ""
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
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
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
  disabled = false,
  required = true,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={`manager-${name}`}
        className="font-jakarta text-[10px] font-bold uppercase tracking-wide text-[#8e706a]"
      >
        {label}
      </label>

      <input
        id={`manager-${name}`}
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-xl border border-[#e2bfb7] bg-white px-4 py-3 text-sm outline-none focus:border-[#b32d0f] disabled:opacity-60"
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