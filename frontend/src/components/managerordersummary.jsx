import { useNavigate } from "react-router-dom";

function ManagerOrderSummary() {
  const navigate = useNavigate();

  const summaryCards = [
    {
      label: "Completed",
      count: 27,
      path: "/managercompletedorders",
      className: "bg-white text-[#5a413b]",
    },
    {
      label: "Active",
      count: 8,
      path: "/manageractiveorders",
      className: "bg-[#c92f0f] text-white",
      arrow: true,
    },
    {
      label: "Rejected",
      count: 2,
      path: "/managerrejectedorders",
      className: "bg-white text-[#5a413b]",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[600px] px-4 pt-5">
      <div className="grid grid-cols-3 gap-2">
        {summaryCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => navigate(card.path)}
            className={`flex h-[72px] items-center justify-center rounded-xl shadow-sm transition-transform active:scale-[0.97] ${card.className}`}
          >
            <div className="flex flex-col items-center">
              <span
                className={`font-playfair text-[17px] font-bold leading-5 ${
                  card.label === "Rejected"
                    ? "text-[#c92f0f]"
                    : ""
                }`}
              >
                {card.count}
              </span>

              <span className="mt-0.5 font-jakarta text-[10px] font-semibold leading-4">
                {card.label}
              </span>

              {card.arrow && (
                <span className="font-jakarta text-[13px] leading-3">
                  →
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ManagerOrderSummary;