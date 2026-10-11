import { useNavigate } from "react-router-dom";

function OwnerDashboardQuickActions() {
  const navigate = useNavigate();

  const handleManageMenuClick = () => {
    navigate("/managermenu", {
      state: { from: "/ownerdashboard" },
    });
  };

  const handleViewOrdersClick = () => {
    navigate("/ownerorders");
  };

  return (
    <section className="px-5 pt-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Manage Menu */}
        <button
          type="button"
          onClick={handleManageMenuClick}
          className="flex min-h-[82px] flex-col items-center justify-center rounded-xl bg-[#c92f0f] px-3 py-3 text-white shadow-[0_2px_8px_rgba(88,42,30,0.08)] transition-transform active:scale-[0.98]"
        >
          <span className="font-playfair text-[17px] font-bold leading-5">
            Manage Menu
          </span>

          <span className="mt-1 font-jakarta text-[9px] font-medium leading-4 opacity-90">
            Update items & availability
          </span>
        </button>

        {/* View All Orders */}
        <button
          type="button"
          onClick={handleViewOrdersClick}
          className="flex min-h-[82px] flex-col items-center justify-center rounded-xl bg-white px-3 py-3 text-[#5a413b] shadow-[0_2px_8px_rgba(88,42,30,0.08)] transition-transform active:scale-[0.98]"
        >
          <span className="font-playfair text-[17px] font-bold leading-5">
            View All Orders
          </span>

          <span className="mt-1 font-jakarta text-[9px] font-medium leading-4 text-[#8e706a]">
            Review order history
          </span>
        </button>
      </div>
    </section>
  );
}

export default OwnerDashboardQuickActions;