
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function OwnerDashboardOrdersSummary() {
  const navigate = useNavigate();

  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadOrdersSummary = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error("Please log in again to view order statistics.");
        }

        const token = await user.getIdToken();

        const response = await fetch(`${API_URL}/api/orders/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load order statistics."
          );
        }

        if (isMounted) {
          setTotalOrders(result.summary?.totalOrders ?? 0);
          setActiveOrders(result.summary?.activeOrders ?? 0);
        }
      } catch (error) {
        console.error("Unable to load orders summary:", error);
      }
    };

    loadOrdersSummary();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {totalOrders.toLocaleString()}
        </p>

        <p className="mt-1 font-jakarta text-[9px] leading-4 text-[#8e706a]">
          All orders
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
          {activeOrders.toLocaleString()}
        </p>

        <p className="mt-1 font-jakarta text-[9px] leading-4 text-[#8e706a]">
          Currently processing
        </p>
      </button>
    </section>
  );
}

export default OwnerDashboardOrdersSummary;
