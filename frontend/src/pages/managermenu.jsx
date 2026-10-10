import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ManagerMenuHeader from "../components/managermenuheader";
import ManagerMenuSearch from "../components/managermenusearch";
import ManagerMenuCategories from "../components/managermenucategories";
import ManagerMenuItemCard from "../components/managermenuitemcard";
import ManagerAddMenuItem from "../components/manageraddmenuitem";

const API_URL = "http://localhost:5000/api/menu";

function ManagerMenu() {
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backTo = location.state?.from || "/managerdashboard";

  // Fetch menu items from the Express backend.
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load menu items.");
      }

      const formattedItems = result.data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        categoryId: item.category_id,
        category: item.category_id,
        price: String(item.price),
        foodType:
          item.dietary_type === "vegetarian" ? "Veg" : "Non-Veg",
        available: item.is_available,
        image: item.image_url || "",
        isPopular: item.is_popular,
      }));

      setMenuItems(formattedItems);
    } catch (err) {
      console.error("Failed to fetch manager menu:", err);

      setError(
        "Unable to load menu items. Check that your backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Adding new items will be connected to the API in a later step.
  
const handleSaveNewItem = async (item) => {
  try {
    setError("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to create menu item."
      );
    }

    // Refresh the menu from Supabase.
    await fetchMenuItems();

    // Close the form after a successful save.
    setShowAddModal(false);
  } catch (err) {
    console.error("Failed to add menu item:", err);
    setError(err.message || "Unable to save the new menu item.");
  }
};

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerMenuHeader backTo={backTo} />

      <div className="p-5">
        <ManagerMenuSearch />

        <div className="mt-4">
          <ManagerMenuCategories />
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full rounded-xl bg-[#8d1900] py-3 font-jakarta text-[12px] font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            + Add New Item
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-[#5a413b]">
              Loading menu items...
            </p>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={fetchMenuItems}
                className="mt-4 rounded-lg bg-[#8d1900] px-5 py-2 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          ) : menuItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#5a413b]">
              No menu items found.
            </p>
          ) : (
            menuItems.map((item) => (
              <ManagerMenuItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>

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

