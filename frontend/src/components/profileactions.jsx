function EditIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1-1-4Z" />
    </svg>
  );
}

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

function LogoutIcon() {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  );
}

function ProfileActions({
  editing = true,
  onSave,
  onEdit,
  onLogout,
}) {
  return (
    <div className="mx-5 mt-6 space-y-3">
      {/* Save / Edit */}
      <button
        type="button"
        onClick={editing ? onSave : onEdit}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8d1900] font-jakarta text-sm font-bold text-white shadow-md transition-all hover:bg-[#7f1625] active:scale-[0.98]"
      >
        {editing ? <CheckIcon /> : <EditIcon />}

        <span>
          {editing ? "Save Changes" : "Edit Profile"}
        </span>
      </button>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#8d1900] bg-transparent font-jakarta text-sm font-bold text-[#8d1900] transition-all hover:bg-[#8d1900] hover:text-white active:scale-[0.98]"
      >
        <LogoutIcon />

        <span>Logout</span>
      </button>
    </div>
  );
}

export default ProfileActions;