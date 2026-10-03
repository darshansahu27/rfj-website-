function BellIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-5h-1V11a6 6 0 0 0-5-5.92V4a1 1 0 0 0-2 0v1.08A6 6 0 0 0 6 11v6H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z" />
    </svg>
  );
}

function OwnerDashboardNotification() {
  return (
    <section className="px-5 pt-3">
      <div className="flex items-center gap-2 rounded-lg bg-[#ffd8d1] px-3 py-2.5 text-[#c92f0f]">
        <BellIcon />

        <span className="font-jakarta text-[10px] font-medium leading-4">
          3 New orders pending review
        </span>
      </div>
    </section>
  );
}

export default OwnerDashboardNotification;