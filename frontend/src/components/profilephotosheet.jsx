function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-1.5-3Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function ProfilePhotoSheet({
  open = false,
  onClose,
  onTakePhoto,
  onChooseFromGallery,
  onRemovePhoto,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close photo options"
      />

      <div className="relative w-full rounded-t-3xl bg-white px-5 pb-7 pt-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#eadfce]" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold text-[#8d1900]">
            Change Profile Photo
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#5a413b] transition-colors hover:bg-[#fff8f5]"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onTakePhoto}
            className="flex w-full items-center gap-3 rounded-xl border border-[#eadfce] px-4 py-3 text-left transition-colors hover:bg-[#fff8f5]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1ec] text-[#8d1900]">
              <CameraIcon />
            </span>

            <span className="font-jakarta text-sm font-semibold text-[#5a413b]">
              Take Photo
            </span>
          </button>

          <button
            type="button"
            onClick={onChooseFromGallery}
            className="flex w-full items-center gap-3 rounded-xl border border-[#eadfce] px-4 py-3 text-left transition-colors hover:bg-[#fff8f5]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1ec] text-[#8d1900]">
              <GalleryIcon />
            </span>

            <span className="font-jakarta text-sm font-semibold text-[#5a413b]">
              Choose from Gallery
            </span>
          </button>

          <button
            type="button"
            onClick={onRemovePhoto}
            className="w-full rounded-xl px-4 py-3 font-jakarta text-sm font-semibold text-[#8d1900] transition-colors hover:bg-[#fff8f5]"
          >
            Remove Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoSheet;
