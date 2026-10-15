
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function OwnerDashboardMenuOverview() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadMenuItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load menu items."
          );
        }

        if (isMounted) {
          setMenuItems(
            Array.isArray(result.items) ? result.items : []
          );
        }
      } catch (error) {
        console.error("Unable to load menu items:", error);

        if (isMounted) {
          setMenuItems([]);
        }
      }
    };

    loadMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // Count vegetarian and non-vegetarian items
  const vegItems = menuItems.filter(
    (item) => item.foodType === "Veg"
  ).length;

  const nonVegItems = menuItems.filter(
    (item) => item.foodType === "Non-Veg"
  ).length;

  // Count available and unavailable items
  const availableItems = menuItems.filter(
    (item) => item.available === true
  ).length;

  const unavailableItems = menuItems.filter(
    (item) => item.available === false
  ).length;

  return (
    <section className="px-5 pt-4">
      <h2 className="font-playfair text-[18px] font-bold leading-6 text-[#2b211e]">
        Menu Overview
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* Veg Items */}
        <div className="rounded-xl bg-white px-4 py-4 shadow-[0_2px_8px_rgba(88,42,30,0.08)]">
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            Veg Items
          </p>

          <p className="mt-1 font-playfair text-[27px] font-bold leading-8 text-[#159447]">
            {vegItems}
          </p>
        </div>

        {/* Non-Veg Items */}
        <div className="rounded-xl bg-white px-4 py-4 shadow-[0_2px_8px_rgba(88,42,30,0.08)]">
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            Non-Veg Items
          </p>

          <p className="mt-1 font-playfair text-[27px] font-bold leading-8 text-[#c92f0f]">
            {nonVegItems}
          </p>
        </div>

        {/* Available Items */}
        <div className="rounded-xl bg-white px-4 py-4 shadow-[0_2px_8px_rgba(88,42,30,0.08)]">
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            Available Items
          </p>

          <p className="mt-1 font-playfair text-[27px] font-bold leading-8 text-[#159447]">
            {availableItems}
          </p>
        </div>

        {/* Unavailable Items */}
        <div className="rounded-xl bg-white px-4 py-4 shadow-[0_2px_8px_rgba(88,42,30,0.08)]">
          <p className="font-jakarta text-[10px] font-medium text-[#8e706a]">
            Unavailable Items
          </p>

          <p className="mt-1 font-playfair text-[27px] font-bold leading-8 text-[#8d1900]">
            {unavailableItems}
          </p>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboardMenuOverview;
