import { useEffect, useState } from "react";

const STORAGE_KEY = "rfj_menu_items";

function OwnerDashboardMenuOverview() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenuItems = () => {
      try {
        const savedItems = localStorage.getItem(STORAGE_KEY);

        if (!savedItems) {
          setMenuItems([]);
          return;
        }

        const parsedItems = JSON.parse(savedItems);

        if (Array.isArray(parsedItems)) {
          setMenuItems(parsedItems);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Unable to load menu items:", error);
        setMenuItems([]);
      }
    };

    loadMenuItems();

    window.addEventListener("storage", loadMenuItems);

    return () => {
      window.removeEventListener("storage", loadMenuItems);
    };
  }, []);

  const vegItems = menuItems.filter(
    (item) => item.foodType === "Veg"
  ).length;

  const nonVegItems = menuItems.filter(
    (item) => item.foodType === "Non-Veg"
  ).length;

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