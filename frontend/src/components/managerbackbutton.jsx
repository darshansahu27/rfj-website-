import { useLocation, useNavigate } from "react-router-dom";

function ArrowBackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ManagerBackButton({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const backTo = location.state?.from || "/managerdashboard";

  return (
    <header className="flex h-16 items-center border-b border-[#eadfce] bg-[#fff8f5] px-4">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#8d1900] transition-colors hover:bg-[#f5e9e3] active:scale-95"
        aria-label="Back"
      >
        <ArrowBackIcon />
      </button>

      <h1 className="ml-2 font-playfair text-xl font-bold text-[#8d1900]">
        {title}
      </h1>
    </header>
  );
}

export default ManagerBackButton;