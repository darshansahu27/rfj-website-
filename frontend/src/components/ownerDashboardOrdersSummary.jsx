import { useNavigate } from "react-router-dom";

function OwnerDashboardOrdersSummary() {
  const navigate = useNavigate();

  const handleActiveOrdersClick = () => {
    navigate("/manageractiveorders", {
      state: { from: "/ownerdashboard" },
    });
  };

  return (
    <section className="grid grid-cols-2 gap-3 px-5 pt-4">
      {/* Total Orders */}
      <div className="rounded-xl bg-white px-4 py-4 shadow-[0_2px_8px_rgba(88,42,30,0.08)]">
        <p className="font-jakarta text-[11px] font-medium leading-4 text-[#8e706a]">
          Total Orders
        </p>

        <p className="mt-1 font-playfair text-[30px] font-bold leading-9 text-[#2b211e]">
          1,286
        </p>

        <p className="mt-1 font-jakarta text-[9px] leading-4 text-[#8e706a]">
          This month
        </p>
      </div>

      {/* Active Orders */}
      <button
        type="button"
        onClick={handleActiveOrdersClick}
        className="w-full rounded-xl bg-white px-4 py-4 text-left shadow-[0_2px_8px_rgba(88,42,30,0.08)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(88,42,30,0.12)] active:scale-[0.98]"
        aria-label="Open Active Orders"
      >
        <p className="font-jakarta text-[11px] font-medium leading-4 text-[#8e706a]">
          Active Orders
        </p>

        <p className="mt-1 font-playfair text-[30px] font-bold leading-9 text-[#2b211e]">
          8
        </p>

        <p className="mt-1 font-jakarta text-[9px] leading-4 text-[#8e706a]">
          Currently processing
        </p>
      </button>
    </section>
  );
}

export default OwnerDashboardOrdersSummary;