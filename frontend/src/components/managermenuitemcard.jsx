import { useState } from "react";

const categories = [
  "Starters",
  "Main Course",
  "Tandoor",
  "Chinese",
  "Biryani",
  "Beverages",
  "Desserts",
];

const STORAGE_KEY = "rfj_menu_items";

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
  const [showEditModal, setShowEditModal] = useState(false);

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image);
  const [price, setPrice] = useState(item.price);
  const [foodType, setFoodType] = useState(item.foodType);

  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editImage, setEditImage] = useState(item.image);
  const [editPrice, setEditPrice] = useState(item.price);
  const [editFoodType, setEditFoodType] = useState(item.foodType);

  const handleEditOpen = () => {
    setEditName(name);
    setEditDescription(description);
    setEditCategory(category);
    setEditImage(image);
    setEditPrice(price);
    setEditFoodType(foodType);
    setShowEditModal(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setEditImage(imageUrl);
  };

  const handleSave = () => {
    const updatedItem = {
      ...item,
      name: editName,
      description: editDescription,
      category: editCategory,
      image: editImage,
      price: editPrice,
      foodType: editFoodType,
      available,
    };

    setName(editName);
    setDescription(editDescription);
    setCategory(editCategory);
    setImage(editImage);
    setPrice(editPrice);
    setFoodType(editFoodType);

    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      const currentItems = savedItems ? JSON.parse(savedItems) : [];

      const updatedItems = currentItems.map((currentItem) =>
        currentItem.id === item.id ? updatedItem : currentItem
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedItems)
      );
    } catch (error) {
      console.error("Unable to save menu item:", error);
    }

    setShowEditModal(false);
  };

  const handleAvailabilityChange = () => {
    setAvailable((current) => {
      const updatedAvailable = !current;

      try {
        const savedItems = localStorage.getItem(STORAGE_KEY);
        const currentItems = savedItems ? JSON.parse(savedItems) : [];

        const updatedItems = currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                available: updatedAvailable,
              }
            : currentItem
        );

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedItems)
        );
      } catch (error) {
        console.error("Unable to save availability:", error);
      }

      return updatedAvailable;
    });
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
            className={`relative h-5 w-9 rounded-full transition-colors ${
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
          <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
                Edit Menu Item
              </h2>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
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
                      src={editImage}
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
              </div>

              <div>
                <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                  Item Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
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
                    value={editPrice}
                    onChange={(event) => setEditPrice(event.target.value)}
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

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-full border border-[#b9a9a2] py-3 font-jakarta text-[11px] font-semibold text-[#5a413b]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-full bg-[#8d1900] py-3 font-jakarta text-[11px] font-bold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerMenuItemCard;