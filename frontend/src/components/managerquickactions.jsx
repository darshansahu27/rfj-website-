import { useNavigate } from "react-router-dom";


function MenuIcon() {
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
      <path d="M4 7h10" />
      <path d="M4 12h7" />
      <path d="M4 17h10" />
      <path d="m16 14 4-4" />
      <path d="m20 10-4-4" />
    </svg>
  );
}

function OrdersIcon() {
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
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h2" />
      <path d="M14 11h2" />
      <path d="M8 15h2" />
      <path d="M14 15h2" />
    </svg>
  );
}

function ManagerQuickActions() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[600px] px-4 pt-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("/managermenu")}
          className="flex h-[72px] flex-col items-center justify-center gap-2 rounded-xl bg-[#eee5e0] text-[#8d1900] shadow-sm transition-transform active:scale-[0.97]"
        >
          <MenuIcon />

          <span className="font-jakarta text-[11px] font-semibold text-[#2b211e]">
            Manage Menu
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/managerorders")}
          className="flex h-[72px] flex-col items-center justify-center gap-2 rounded-xl bg-[#eee5e0] text-[#8d1900] shadow-sm transition-transform active:scale-[0.97]"
        >
          <OrdersIcon />

          <span className="font-jakarta text-[11px] font-semibold text-[#2b211e]">
            Orders
          </span>
        </button>
      </div>
    </section>
  );
}

export default ManagerQuickActions;