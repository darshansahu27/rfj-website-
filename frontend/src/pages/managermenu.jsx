
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase";

import ManagerMenuHeader from "../components/managermenuheader";
import ManagerMenuSearch from "../components/managermenusearch";
import ManagerMenuCategories from "../components/managermenucategories";
import ManagerMenuItemCard from "../components/managermenuitemcard";
import ManagerAddMenuItem from "../components/manageraddmenuitem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ManagerMenu() {
  const location = useLocation();
  const backTo = location.state?.from || "/managerdashboard";

  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in again to manage the menu.");
    }

    return user.getIdToken();
  }, []);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/menu`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load menu items.");
      }

      setMenuItems(Array.isArray(result.items) ? result.items : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load menu items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const handleSaveNewItem = async (item) => {
    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("name", item.name.trim());
      formData.append("description", item.description || "");
      formData.append("category", item.category);
      formData.append("price", String(item.price));
      formData.append("foodType", item.foodType);
      formData.append("available", String(item.available));

      if (item.imageFile) {
        formData.append("image", item.imageFile);
      }

      const response = await fetch(`${API_URL}/api/menu`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.item) {
        throw new Error(result.message || "Unable to create menu item.");
      }

      setMenuItems((current) => [result.item, ...current]);
      setShowAddModal(false);
    } catch (saveError) {
      const message =
        saveError.message || "Unable to create menu item.";

      setError(message);

      // Allow the add-item form to display the error inside its modal.
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleItemUpdated = (updatedItem) => {
    setMenuItems((current) =>
      current.map((existing) =>
        existing.id === updatedItem.id ? updatedItem : existing
      )
    );
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return menuItems.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        description.includes(query);

      const normalizedCategory =
        selectedCategory === "Biryani"
          ? "Rice and Biryani"
          : selectedCategory;

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === normalizedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerMenuHeader backTo={backTo} />

      <div className="p-5">
        <ManagerMenuSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="mt-4">
          <ManagerMenuCategories
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              setError("");
              setShowAddModal(true);
            }}
            className="w-full rounded-xl bg-[#8d1900] py-3 font-jakarta text-[12px] font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            + Add New Item
          </button>
        </div>

        {error && !showAddModal && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-5 text-sm text-[#8e706a]">
            Loading menu items...
          </p>
        ) : error && menuItems.length === 0 ? (
          <div className="mt-5">
            <p className="text-sm text-[#8e706a]">
              Unable to load the menu.
            </p>

            <button
              type="button"
              onClick={loadMenu}
              className="mt-3 rounded-full bg-[#8d1900] px-5 py-2 font-jakarta text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="mt-5 text-sm text-[#8e706a]">
            No menu items match your search or category.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredItems.map((item) => (
              <ManagerMenuItemCard
                key={item.id}
                item={item}
                onUpdated={handleItemUpdated}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <ManagerAddMenuItem
          onClose={() => {
            if (!saving) {
              setShowAddModal(false);
              setError("");
            }
          }}
          onSave={handleSaveNewItem}
          saving={saving}
        />
      )}
    </main>
  );
}

export default ManagerMenu;
