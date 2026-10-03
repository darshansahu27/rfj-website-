import { useState } from "react";
import { useLocation } from "react-router-dom";

import ManagerMenuHeader from "../components/managermenuheader";
import ManagerMenuSearch from "../components/managermenusearch";
import ManagerMenuCategories from "../components/managermenucategories";
import ManagerMenuItemCard from "../components/managermenuitemcard";
import ManagerAddMenuItem from "../components/manageraddmenuitem";

const STORAGE_KEY = "rfj_menu_items";

const defaultImage =
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80";

const defaultMenuItem = {
  id: "butter-chicken-default",
  name: "Butter Chicken",
  description:
    "Creamy tomato-based chicken curry cooked with aromatic spices.",
  category: "Main Course",
  price: "380",
  foodType: "Veg",
  available: true,
  image: defaultImage,
};

function ManagerMenu() {
  const location = useLocation();

  const [showAddModal, setShowAddModal] = useState(false);

  const backTo = location.state?.from || "/managerdashboard";

  const [menuItems, setMenuItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);

      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);

        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          return parsedItems;
        }
      }
    } catch {
      // Use default item if saved data cannot be read.
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([defaultMenuItem])
    );

    return [defaultMenuItem];
  });

  const handleSaveNewItem = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
    };

    setMenuItems((currentItems) => {
      const updatedItems = [...currentItems, newItem];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedItems)
      );

      return updatedItems;
    });

    setShowAddModal(false);
  };

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerMenuHeader backTo={backTo} />

      <div className="p-5">
        <ManagerMenuSearch />

        <div className="mt-4">
          <ManagerMenuCategories />
        </div>

        {/* Add New Item Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full rounded-xl bg-[#8d1900] py-3 font-jakarta text-[12px] font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            + Add New Item
          </button>
        </div>

        {/* Menu Items */}
        <div className="mt-5 space-y-4">
          {menuItems.map((item) => (
            <ManagerMenuItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>

      {/* Add New Item */}
      {showAddModal && (
        <ManagerAddMenuItem
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNewItem}
        />
      )}
    </main>
  );
}

export default ManagerMenu;