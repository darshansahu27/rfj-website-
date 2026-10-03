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

function ManagerAddMenuItem({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [price, setPrice] = useState("");
  const [foodType, setFoodType] = useState("Veg");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      category,
      price,
      foodType,
      available,
      image,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl bg-white p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-[20px] font-bold text-[#2b211e]">
            Add New Item
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="font-jakarta text-[20px] text-[#6b6b6b]"
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
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1e8e3]">
                {image ? (
                  <img
                    src={image}
                    alt="New menu preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-jakarta text-[9px] text-[#9a9a9a]">
                    No Image
                  </span>
                )}
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

          {/* Name */}
          <div>
            <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
              Item Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter item name"
              className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none placeholder:text-[#9a9a9a] focus:border-[#8d1900]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
              Description
            </label>

            <textarea
              rows="3"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter item description"
              className="mt-1 w-full resize-none rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] leading-5 text-[#2b211e] outline-none placeholder:text-[#9a9a9a] focus:border-[#8d1900]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
              Category
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
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
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0"
                className="w-full bg-transparent px-2 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none placeholder:text-[#9a9a9a]"
              />
            </div>
          </div>

          {/* Food Type */}
          <div>
            <label className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
              Food Type
            </label>

            <select
              value={foodType}
              onChange={(event) => setFoodType(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#eadfce] bg-white px-3 py-3 font-jakarta text-[12px] text-[#2b211e] outline-none focus:border-[#8d1900]"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between rounded-xl border border-[#eadfce] px-3 py-3">
            <div>
              <p className="font-jakarta text-[11px] font-semibold text-[#5a413b]">
                Availability
              </p>

              <p className="mt-0.5 font-jakarta text-[9px] text-[#9a9a9a]">
                {available ? "Available" : "Unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAvailable((current) => !current)}
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
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-[#b9a9a2] py-3 font-jakarta text-[11px] font-semibold text-[#5a413b]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-full bg-[#8d1900] py-3 font-jakarta text-[11px] font-bold text-white"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerAddMenuItem;