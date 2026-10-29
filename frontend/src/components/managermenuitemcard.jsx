import { useEffect, useState } from "react";
import { managerAuth as auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "Starters",
  "Main Course",
  "Tandoor",
  "Chinese",
  "Rice and Biryani",
  "Breads",
  "Beverages",
  "Desserts",
];

const defaultImage =
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80";

function ManagerMenuItemCard({ item, onUpdated = () => {} }) {
  const [available, setAvailable] = useState(item.available);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image || defaultImage);
  const [price, setPrice] = useState(String(item.price ?? ""));
  const [foodType, setFoodType] = useState(item.foodType);

  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(
    item.description || ""
  );
  const [editCategory, setEditCategory] = useState(item.category);
  const [editImage, setEditImage] = useState(item.image || defaultImage);
  const [editPrice, setEditPrice] = useState(String(item.price ?? ""));
  const [editFoodType, setEditFoodType] = useState(item.foodType);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setAvailable(item.available);
    setName(item.name);
    setDescription(item.description || "");
    setCategory(item.category);
    setImage(item.image || defaultImage);
    setPrice(String(item.price ?? ""));
    setFoodType(item.foodType);
  }, [item]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const getToken = async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please sign in again to continue.");
    }

    return user.getIdToken();
  };

  const handleEditOpen = () => {
    setEditName(name);
    setEditDescription(description);
    setEditCategory(category);
    setEditImage(image);
    setEditPrice(price);
    setEditFoodType(foodType);
    setImageFile(null);
    setError("");
    setShowEditModal(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
  };

  const handleSave = async () => {
    setError("");

    if (!editName.trim()) {
      setError("Please enter the item name.");
      return;
    }

    if (
      editPrice.trim() === "" ||
      !Number.isFinite(Number(editPrice)) ||
      Number(editPrice) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("name", editName.trim());
      formData.append("description", editDescription.trim());
      formData.append("category", editCategory);
      formData.append("price", editPrice);
      formData.append("foodType", editFoodType);
      formData.append("available", String(available));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        `${API_URL}/api/menu/${item.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update menu item.");
      }

      const updatedItem = result.item;

      setName(updatedItem.name);
      setDescription(updatedItem.description || "");
      setCategory(updatedItem.category);
      setImage(updatedItem.image || defaultImage);
      setPrice(String(updatedItem.price ?? ""));
      setFoodType(updatedItem.foodType);
      setAvailable(updatedItem.available);

      onUpdated(updatedItem);
      setImageFile(null);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityChange = async () => {
    if (saving) return;

    setError("");
    setSaving(true);

    const updatedAvailable = !available;

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("available", String(updatedAvailable));

      const response = await fetch(
        `${API_URL}/api/menu/${item.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update availability."
        );
      }

      setAvailable(result.item.available);
      onUpdated(result.item);
    } catch (err) {
      setError(err.message || "Unable to update availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <article className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex gap-3 p-3">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f1e8e3]">
            <img
              src={image}
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
            disabled={saving}
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

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-130 overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
                Edit Menu Item
              </h2>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="font-jakarta text-[20px] text-[#6b6b6b] disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Image */}
              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Item Image
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1e8e3]">
                    <img
                      src={imagePreview || editImage || defaultImage}
                      alt="Menu preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <label className="cursor-pointer rounded-full border border-[#eadfce] px-4 py-2 font-jakarta text-[10px] font-semibold text-[#8d1900]">
                    Change Image

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={saving}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Item Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  disabled={saving}
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                />
              </div>

              {/* Description */}
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
                  disabled={saving}
                  className="mt-1 w-full resize-none rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] leading-5 text-[#2b211e] outline-none focus:border-[#8d1900]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Category
                </label>

                <select
                  value={editCategory}
                  onChange={(event) =>
                    setEditCategory(event.target.value)
                  }
                  disabled={saving}
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                >
                  {categories.map((itemCategory) => (
                    <option key={itemCategory} value={itemCategory}>
                      {itemCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
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
                    disabled={saving}
                    className="w-full bg-transparent px-2 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none"
                  />
                </div>
              </div>

              {/* Food Type */}
              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Food Type
                </label>

                <select
                  value={editFoodType}
                  onChange={(event) =>
                    setEditFoodType(event.target.value)
                  }
                  disabled={saving}
                  className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 font-jakarta text-[11px] text-red-700">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="flex-1 rounded-full border border-[#b9a9a2] py-3 font-jakarta text-[11px] font-semibold text-[#5a413b] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-[#8d1900] py-3 font-jakarta text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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