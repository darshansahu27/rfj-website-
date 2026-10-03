function CheckIcon() {
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
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ProfileToast({
  open = false,
  message = "Profile updated successfully",
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[90] w-[calc(100%-40px)] max-w-sm -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl bg-[#8d1900] px-4 py-3 text-white shadow-lg">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <CheckIcon />
        </span>

        <p className="font-jakarta text-sm font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
}

export default ProfileToast;