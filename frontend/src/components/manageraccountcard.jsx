function BadgeIcon() {
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
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M8 17c.8-2 2.1-3 4-3s3.2 1 4 3" />
    </svg>
  );
}

function ManageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3.2 2.6-5 5.5-5 1.2 0 2.2.3 3.1.9" />
      <path d="M17 13v7" />
      <path d="M13.5 16.5H20.5" />
    </svg>
  );
}

function ManagerAccountCard({ manager, onEdit }) {
  const initials = manager.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-xl border border-[#e9e1dc]/70 bg-white p-4 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-playfair text-[17px] font-bold text-[#8d1900]">
        <BadgeIcon />
        Manager Account
      </h3>

      <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#fff8f5] p-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fea13e] font-jakarta text-sm font-bold text-[#6b3b00]">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="font-jakarta text-[12px] font-semibold text-[#2b211e]">
            {manager.name}
          </p>

          <p className="break-all font-jakarta text-[10px] text-[#5a413b]">
            {manager.email}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b32d0f] py-3 font-jakarta text-[12px] font-bold text-white shadow-sm transition hover:bg-[#8d1900] active:scale-[0.98]"
      >
        <ManageIcon />
        Edit Manager Credentials
      </button>
    </section>
  );
}

export default ManagerAccountCard;