import { useState } from "react";

const API_URL = "http://localhost:5000/api/menu";


const categories = [
  "Starters",
  "Main Course",
  "Tandoor",
  "Chinese",
  "Biryani",
  "Beverages",
  "Desserts",
];

const defaultImage =
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80";

function ManagerMenuItemCard({
  item = {
    id: "butter-chicken-default",
    name: "Butter Chicken",
    description:
      "Creamy tomato-based chicken curry cooked with aromatic spices.",
    category: "Main Course",
    price: "380",
    foodType: "Veg",
    available: true,
    image: defaultImage,
  },
}) {
  const [available, setAvailable] = useState(item.available);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image || defaultImage);
  const [price, setPrice] = useState(item.price);
  const [foodType, setFoodType] = useState(item.foodType);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(
    item.description
  );
  const [editCategory, setEditCategory] = useState(item.category);
  const [editImage, setEditImage] = useState(
    item.image || defaultImage
  );
  const [editPrice, setEditPrice] = useState(item.price);
  const [editFoodType, setEditFoodType] = useState(item.foodType);

  const [saving, setSaving] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] =
    useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEditOpen = () => {
    setEditName(name);
    setEditDescription(description);
    setEditCategory(category);
    setEditImage(image);
    setEditPrice(price);
    setEditFoodType(foodType);
    setError("");
    setMessage("");
    setShowEditModal(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Preview only. Uploading images to persistent storage
    // will be connected separately.
    setEditImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const trimmedName = editName.trim();
    const numericPrice = Number(editPrice);

    if (!trimmedName) {
      setError("Please enter a dish name.");
      return;
    }

    if (
      editPrice === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: editDescription.trim(),
          price: numericPrice,
          dietary_type:
            editFoodType === "Veg"
              ? "vegetarian"
              : "non_vegetarian",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to save menu item."
        );
      }

      const savedItem = result.data;

      setName(savedItem.name);
      setDescription(savedItem.description || "");
      setPrice(String(savedItem.price));
      setFoodType(
        savedItem.dietary_type === "vegetarian"
          ? "Veg"
          : "Non-Veg"
      );
      setAvailable(savedItem.is_available);

      // Category and image are not persisted by this request.
      setMessage("Menu item saved successfully.");
      setShowEditModal(false);
    } catch (err) {
      console.error("Unable to save menu item:", err);
      setError(
        err.message ||
          "Could not save changes. Check that the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityChange = async () => {
    const nextAvailable = !available;

    setUpdatingAvailability(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_available: nextAvailable,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update availability."
        );
      }

      setAvailable(result.data.is_available);
      setMessage("Availability updated successfully.");
    } catch (err) {
      console.error("Unable to update availability:", err);
      setError(
        err.message ||
          "Could not update availability. Please try again."
      );
    } finally {
      setUpdatingAvailability(false);
    }
  };

  return (
    <>
      <article className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex gap-3 p-3">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f1e8e3]">
            <img
              src={image || defaultImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`font-jakarta text-[9px] font-semibold ${
                    foodType === "Veg"
                      ? "text-[#159447]"
                      : "text-[#c92f0f]"
                  }`}
                >
                  ● {foodType}
                </span>

                <h3 className="mt-0.5 font-playfair text-[16px] font-bold leading-5 text-[#2b211e]">
                  {name}
                </h3>

                <p className="font-jakarta text-[9px] text-[#8e706a]">
                  {category}
                </p>
              </div>

              <button
                type="button"
                onClick={handleEditOpen}
                className="shrink-0 rounded-full border border-[#eadfce] px-3 py-1 font-jakarta text-[9px] font-semibold text-[#8d1900]"
              >
                Edit
              </button>
            </div>

            <p className="mt-1 line-clamp-2 font-jakarta text-[10px] leading-4 text-[#6b6b6b]">
              {description}
            </p>

            <p className="mt-1.5 font-jakarta text-[12px] font-bold text-[#c92f0f]">
              ₹{price}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0e5df] px-3 py-2.5">
          <span
            className={`font-jakarta text-[10px] font-semibold ${
              available ? "text-[#5a413b]" : "text-[#9a9a9a]"
            }`}
          >
            {available ? "Available" : "Unavailable"}
          </span>

          <button
            type="button"
            onClick={handleAvailabilityChange}
            disabled={updatingAvailability}
            className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
              available ? "bg-[#159447]" : "bg-[#b9a9a2]"
            }`}
            aria-label={
              available ? "Mark unavailable" : "Mark available"
            }
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ${
                available ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </article>

      {message && (
        <p className="mt-2 text-xs text-green-700" role="status">
          {message}
        </p>
      )}

      {error && !showEditModal && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
                Edit Menu Item
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setError("");
                }}
                className="font-jakarta text-[20px] text-[#6b6b6b]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Item Image
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1e8e3]">
                    <img
                      src={editImage || defaultImage}
                      alt="Menu preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <label className="cursor-pointer rounded-full border border-[#eadfce] px-4 py-2 font-jakarta text-[10px] font-semibold text-[#8d1900]">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="mt-1 text-[10px] text-[#8e706a]">
                  Image upload is preview-only for now.
                </p>
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Item Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                />
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  className="mt-1 w-full resize-none rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] leading-5 text-[#2b211e] outline-none focus:border-[#8d1900]"
                />
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Category
                </label>

                <select
                  value={editCategory}
                  onChange={(event) =>
                    setEditCategory(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                >
                  {categories.map((itemCategory) => (
                    <option key={itemCategory} value={itemCategory}>
                      {itemCategory}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-[10px] text-[#8e706a]">
                  Category changes are not saved yet.
                </p>
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Price
                </label>

                <div className="mt-1 flex items-center rounded-xl border border-[#eadfce] bg-white px-3">
                  <span className="font-jakarta text-[12px] text-[#6b6b6b]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editPrice}
                    onChange={(event) =>
                      setEditPrice(event.target.value)
                    }
                    className="w-full bg-transparent px-2 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Food Type
                </label>

                <select
                  value={editFoodType}
                  onChange={(event) =>
                    setEditFoodType(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setError("");
                }}
                disabled={saving}
                className="flex-1 rounded-full border border-[#b9a9a2] py-3 font-jakarta text-[11px] font-semibold text-[#5a413b] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-[#8d1900] py-3 font-jakarta text-[11px] font-bold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerMenuItemCard;

