import { useState } from "react";

const categories = [
  "All",
  "Starters",
  "Main Course",
  "Tandoor",
  "Chinese",
  "Biryani",
  "Beverages",
  "Desserts",
];

function ManagerMenuCategories() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {categories.map((category) => {
          const selected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 font-jakarta text-[10px] font-semibold ${
                selected
                  ? "bg-[#8d1900] text-white"
                  : "bg-white text-[#5a413b] shadow-sm"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ManagerMenuCategories;