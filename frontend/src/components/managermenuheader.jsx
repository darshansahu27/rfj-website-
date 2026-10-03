import { useNavigate } from "react-router-dom";

function ArrowBackIcon() {
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
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ManagerMenuHeader({ backTo = "/managerdashboard" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-[#fff8f5]/80 px-5 shadow-sm backdrop-blur-md">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-10 w-10 items-center justify-center text-[#8d1900] transition-transform active:scale-95"
        aria-label="Go back"
      >
        <ArrowBackIcon />
      </button>

      <h1 className="font-playfair text-[20px] font-bold leading-7 text-[#8d1900]">
        Menu Management
      </h1>

      <div className="h-10 w-10" />
    </header>
  );
}

export default ManagerMenuHeader;