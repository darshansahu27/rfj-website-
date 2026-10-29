function ManagerMenuCategories({ value = "All", onChange = () => {} }) {
  const categories = [
    "All",
    "Starters",
    "Main Course",
    "Tandoor",
    "Chinese",
    "Rice and Biryani",
    "Breads",
    "Beverages",
    "Desserts",
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
            value === category
              ? "bg-[#8d1900] text-white shadow-sm"
              : "bg-white text-[#6b514a] hover:bg-[#f7e9e5]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default ManagerMenuCategories;