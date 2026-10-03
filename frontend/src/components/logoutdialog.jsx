function LogoutDialog({
  open = false,
  onClose,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close logout dialog"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1ec] text-[#8d1900]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </svg>
          </div>

          <h2 className="font-playfair text-xl font-bold text-[#8d1900]">
            Logout
          </h2>

          <p className="mt-2 font-jakarta text-sm leading-6 text-[#6b6b6b]">
            Are you sure you want to logout from your account?
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-[#eadfce] bg-white font-jakarta text-sm font-semibold text-[#5a413b] transition-colors hover:bg-[#fff8f5] active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-[#8d1900] font-jakarta text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#7f1625] active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutDialog;