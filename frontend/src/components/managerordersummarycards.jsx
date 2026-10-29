import { useNavigate } from "react-router-dom";

function ManagerOrderSummaryCards({
  activeOrdersFrom = "/managerdashboard",
}) {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[600px] px-4 pt-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            navigate("/manageractiveorders", {
              state: { from: activeOrdersFrom },
            })
          }
          className="flex h-[72px] items-center justify-center rounded-xl bg-[#c92f0f] text-white shadow-sm transition-transform active:scale-[0.97]"
        >
          <div className="flex flex-col items-center">
            <span className="font-playfair text-[17px] font-bold leading-5">
              Active
            </span>

            <span className="mt-0.5 font-jakarta text-[10px] font-semibold leading-4">
              Orders
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/managercompletedorders", {
              state: { from: "/managerorders" },
            })
          }
          className="flex h-[72px] items-center justify-center rounded-xl bg-white text-[#5a413b] shadow-sm transition-transform active:scale-[0.97]"
        >
          <div className="flex flex-col items-center">
            <span className="font-playfair text-[17px] font-bold leading-5">
              Completed
            </span>

            <span className="mt-0.5 font-jakarta text-[10px] font-semibold leading-4">
              Orders
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}

export default ManagerOrderSummaryCards;