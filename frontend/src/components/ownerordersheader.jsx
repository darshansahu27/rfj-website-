import { useNavigate } from "react-router-dom";

function OwnerOrdersHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center bg-[#fff8f5] px-3 py-3">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/ownerdashboard")}
        className="flex h-9 w-9 items-center justify-center text-[#8d1900] active:scale-95"
        aria-label="Go back"
      >
        <span className="text-[28px] leading-none">
          ←
        </span>
      </button>

      {/* Page Title */}
      <h1 className="flex-1 pr-9 text-center font-playfair text-[18px] font-bold text-[#8d1900]">
        View Orders
      </h1>

    </header>
  );
}

export default OwnerOrdersHeader;