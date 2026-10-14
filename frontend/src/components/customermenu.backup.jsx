import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavigationDrawer from "./navigationdrawer";
import ProfileDrawer from "./profiledrawer";


const dishes = [
  {
    id: 1,
    category: "paneer-delights",
    categoryName: "Paneer Delights",
    name: "Paneer Tikka Masala",
    diet: "veg",
    description:
      "Cubes of grilled paneer simmered in a rich, creamy tomato gravy.",
    portion: "Regular",
    price: 280,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBjuOo5z-6CMGq6zCowROxZmzvTS8GCfjV2bQovjGPyPsyzGxX-gGhu291tN-r6ujzl_hFxAu-o0IkjB6jGy2gyqj55YwWe8-rnlavuRFGXqPPHKRRX0PsBT3zLH2bM9b711-SWjwTQuny-VqwvDwyA8as6ha9sAMSNJ5zBxdbpvcgLdsyq1zJ0vdlmdskqGIqaj4r8e5F3arHZ9BBWcCO4EUnHXnjI72_61fIiwapkb9sBZJMR5KI",
  },

  {
    id: 2,
    category: "paneer-delights",
    categoryName: "Paneer Delights",
    name: "Palak Paneer Special",
    diet: "veg",
    description:
      "Fresh spinach puree cooked with delicate paneer chunks.",
    portion: "1 Plate",
    price: 250,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCORIZKz0xhdb93L7dr0DxKre2srL5YE90FvtR9XGSR0cIxUd3H9r_5a8ao7wEFX9-_PkC3Cb9EPp3Hvbhuq0-Vj1emfNmQp1oFeL-GWzcpbO6iUBBmE4ykKiL8cFBbu-LPiJQL7rCW0YPoSlC6yFrwximxId5C8sReZ3r5kO0rtTkHEn7ceO5tBkrjyG--3mOAyUfc_-YGltvW-Sf9fkkbdWdK_m-s1EHqnKzGPEfckSl4SUrD7UTP",
  },

  {
    id: 3,
    category: "indian-varieties",
    categoryName: "Indian Varieties",
    name: "Tandoori Chicken",
    diet: "non-veg",
    description:
      "Juicy chicken marinated in yogurt and spices, grilled to perfection.",
    portion: "Half Plate",
    price: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNtILPmyxD37Kd6fXrFzE59D-CbR7p7SbNVQh3Z8C8xdhV1zVS7vK9ZTHdRMPPpUnHtPfrZCUu8JpuWi9ZqRln7UaAA3-OZqqLFH7ueDlpKaa-QeLVXnrKzsNhl9HG5i9fZZle0HmetLrFXQcjD8bFdPnkYG_LTAOvom7sDWZHFHyX8Ui0F8LS7bf8yXe8aK13x_v7ISAil7Y8SsLT5lCFTwQkqNBGX5_c6G8QEAudvY82jUlAt3Zo",
  },

  {
    id: 4,
    category: "indian-varieties",
    categoryName: "Indian Varieties",
    name: "Butter Chicken",
    diet: "non-veg",
    description:
      "Succulent tandoori chicken pieces in our signature buttery tomato sauce.",
    portion: "Full Plate",
    price: 320,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNtILPmyxD37Kd6fXrFzE59D-CbR7p7SbNVQh3Z8C8xdhV1zVS7vK9ZTHdRMPPpUnHtPfrZCUu8JpuWi9ZqRln7UaAA3-OZqqLFH7ueDlpKaa-QeLVXnrKzsNhl9HG5i9fZZle0HmetLrFXQcjD8bFdPnkYG_LTAOvom7sDWZHFHyX8Ui0F8LS7bf8yXe8aK13x_v7ISAil7Y8SsLT5lCFTwQkqNBGX5_c6G8QEAudvY82jUlAt3Zo",
  },

  {
    id: 5,
    category: "chinese",
    categoryName: "Chinese",
    name: "Veg Manchurian Dry",
    diet: "veg",
    description:
      "Crispy vegetable balls tossed in a spicy, tangy manchurian sauce.",
    portion: "Half Plate",
    price: 180,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBjuOo5z-6CMGq6zCowROxZmzvTS8GCfjV2bQovjGPyPsyzGxX-gGhu291tN-r6ujzl_hFxAu-o0IkjB6jGy2gyqj55YwWe8-rnlavuRFGXqPPHKRRX0PsBT3zLH2bM9b711-SWjwTQuny-VqwvDwyA8as6ha9sAMSNJ5zBxdbpvcgLdsyq1zJ0vdlmdskqGIqaj4r8e5F3arHZ9BBWcCO4EUnHXnjI72_61fIiwapkb9sBZJMR5KI",
  },

  {
    id: 6,
    category: "chinese",
    categoryName: "Chinese",
    name: "Chilli Chicken Dry",
    diet: "non-veg",
    description:
      "Tender chicken chunks tossed with bell peppers and spicy soy sauce.",
    portion: "Full Plate",
    price: 310,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNtILPmyxD37Kd6fXrFzE59D-CbR7p7SbNVQh3Z8C8xdhV1zVS7vK9ZTHdRMPPpUnHtPfrZCUu8JpuWi9ZqRln7UaAA3-OZqqLFH7ueDlpKaa-QeLVXnrKzsNhl9HG5i9fZZle0HmetLrFXQcjD8bFdPnkYG_LTAOvom7sDWZHFHyX8Ui0F8LS7bf8yXe8aK13x_v7ISAil7Y8SsLT5lCFTwQkqNBGX5_c6G8QEAudvY82jUlAt3Zo",
  },

  {
    id: 7,
    category: "biryani",
    categoryName: "Biryani",
    name: "Chicken Biryani",
    diet: "non-veg",
    description:
      "Fragrant basmati rice cooked with succulent chicken and aromatic spices.",
    portion: "Full Plate",
    price: 350,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNtILPmyxD37Kd6fXrFzE59D-CbR7p7SbNVQh3Z8C8xdhV1zVS7vK9ZTHdRMPPpUnHtPfrZCUu8JpuWi9ZqRln7UaAA3-OZqqLFH7ueDlpKaa-QeLVXnrKzsNhl9HG5i9fZZle0HmetLrFXQcjD8bFdPnkYG_LTAOvom7sDWZHFHyX8Ui0F8LS7bf8yXe8aK13x_v7ISAil7Y8SsLT5lCFTwQkqNBGX5_c6G8QEAudvY82jUlAt3Zo",
  },

  {
    id: 8,
    category: "dal",
    categoryName: "Dal",
    name: "Dal Makhani",
    diet: "veg",
    description:
      "Black lentils slow-cooked overnight with butter and cream.",
    portion: "Full Plate",
    price: 220,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBjuOo5z-6CMGq6zCowROxZmzvTS8GCfjV2bQovjGPyPsyzGxX-gGhu291tN-r6ujzl_hFxAu-o0IkjB6jGy2gyqj55YwWe8-rnlavuRFGXqPPHKRRX0PsBT3zLH2bM9b711-SWjwTQuny-VqwvDwyA8as6ha9sAMSNJ5zBxdbpvcgLdsyq1zJ0vdlmdskqGIqaj4r8e5F3arHZ9BBWcCO4EUnHXnjI72_61fIiwapkb9sBZJMR5KI",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "paneer-delights", label: "Paneer Delights" },
  { id: "indian-varieties", label: "Indian Varieties" },
  { id: "chinese", label: "Chinese" },
  { id: "biryani", label: "Biryani" },
  { id: "dal", label: "Dal" },
];

function RestaurantIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2v7" />
      <path d="M3.5 2v4.5a2.5 2.5 0 0 0 5 0V2" />
      <path d="M6 9v13" />
      <path d="M15 2v20" />
      <path d="M15 2c3 2 4 5 4 8v3h-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function CustomerMenu() {
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const [cart, setCart] = useState({});

  // Tandoori Chicken portion selection
  // Default is Half Plate.
  const [tandooriPortion, setTandooriPortion] = useState(200);

  // Stores the actual price used when an item was added.
  // This prevents changing the radio selection later
  // from changing an already-added item.
  const [cartPrices, setCartPrices] = useState({});

  const filteredDishes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesSearch =
        !searchValue ||
        dish.name.toLowerCase().includes(searchValue) ||
        dish.description.toLowerCase().includes(searchValue);

      const matchesDiet =
        dietFilter === "all" || dish.diet === dietFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        dish.category === categoryFilter;

      return matchesSearch && matchesDiet && matchesCategory;
    });
  }, [search, dietFilter, categoryFilter]);

  const groupedDishes = categories
    .filter((category) => category.id !== "all")
    .map((category) => ({
      ...category,
      dishes: filteredDishes.filter(
        (dish) => dish.category === category.id
      ),
    }))
    .filter((category) => category.dishes.length > 0);

  const cartItems = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const cartTotal = Object.entries(cart).reduce(
    (total, [id, quantity]) => {
      const dish = dishes.find((item) => item.id === Number(id));

      if (!dish) {
        return total;
      }

      const price =
        cartPrices[id] !== undefined
          ? cartPrices[id]
          : dish.price;

      if (price === null || price === undefined) {
        return total;
      }

      return total + price * quantity;
    },
    0
  );

  const addToCart = (dishId) => {
    const dish = dishes.find((item) => item.id === dishId);

    if (!dish) {
      return;
    }

    // Tandoori Chicken uses the selected portion price.
    const price =
      dish.name === "Tandoori Chicken"
        ? tandooriPortion
        : dish.price;

    // Do not add an item without a valid price.
    if (price === null || price === undefined) {
      return;
    }

    setCart((currentCart) => ({
      ...currentCart,
      [dishId]: (currentCart[dishId] || 0) + 1,
    }));

    // Save the price used for this cart item.
    setCartPrices((currentPrices) => ({
      ...currentPrices,
      [dishId]: price,
    }));
  };

  const updateQuantity = (dishId, change) => {
    setCart((currentCart) => {
      const currentQuantity = currentCart[dishId] || 0;
      const nextQuantity = currentQuantity + change;

      const nextCart = { ...currentCart };

      if (nextQuantity <= 0) {
        delete nextCart[dishId];
      } else {
        nextCart[dishId] = nextQuantity;
      }

      return nextCart;
    });

    // If the item is removed completely, remove its saved price too.
    const currentQuantity = cart[dishId] || 0;

    if (currentQuantity + change <= 0) {
      setCartPrices((currentPrices) => {
        const nextPrices = { ...currentPrices };
        delete nextPrices[dishId];
        return nextPrices;
      });
    }
  };

  const clearCart = () => {
    setCart({});
    setCartPrices({});
  };

  const selectCategory = (categoryId) => {
    setCategoryFilter(categoryId);
    setCategoryOpen(false);

    if (categoryId !== "all") {
      setTimeout(() => {
        document
          .getElementById(categoryId)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
      {/* Header */}
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-5 shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Rohit Food Junction home"
        >
          <span className="text-[#8d1900]">
            <RestaurantIcon />
          </span>

          <span
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
            className="text-[18px] font-semibold text-[#8d1900]"
          >
            Rohit Food Junction
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
  type="button"
  onClick={() => {
    setIsProfileDrawerOpen(false);
    setIsNavigationDrawerOpen(true);
  }}
  className="flex h-9 w-9 items-center justify-center rounded-full text-[#1e1b18]"
  aria-label="Open menu"
>
  <MenuIcon />
</button>

          <button
  type="button"
  onClick={() => {
    setIsNavigationDrawerOpen(false);
    setIsProfileDrawerOpen(true);
  }}
  className="h-9 w-9 overflow-hidden rounded-full border border-[#e2bfb7]/30 bg-[#f5ece7]"
  aria-label="Profile"
>
  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#8d1900]">
    R
  </div>
</button>
        </div>
      </header>

      {/* Main */}
      <main className="pb-32 pt-16">
        {/* Sticky search + filters */}
        <div className="sticky top-16 z-40 space-y-3 border-b border-[#e2bfb7]/10 bg-white px-5 py-3 shadow-sm">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a413b]">
              <SearchIcon />
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for dishes..."
              className="h-11 w-full rounded-full border-0 bg-[#fbf2ed] pl-11 pr-4 text-sm text-[#1e1b18] outline-none ring-0 placeholder:text-[#8e706a] focus:border-0 focus:ring-2 focus:ring-[#b32d0f]/20"
            />
          </div>

          {/* Category dropdown + diet toggle */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Category Dropdown */}
            <div className="relative w-full md:flex-1 md:max-w-190">
              <button
                type="button"
                onClick={() =>
                  setCategoryOpen((open) => !open)
                }
                className="flex h-10 w-full items-center justify-between rounded-full border border-[#e2bfb7]/30 bg-white px-4 text-sm text-[#5a413b]"
              >
                <span>
                  {categoryFilter === "all"
                    ? "Categories"
                    : categories.find(
                        (category) =>
                          category.id === categoryFilter
                      )?.label}
                </span>

                <span className="text-xs">
                  {categoryOpen ? "▲" : "▼"}
                </span>
              </button>

              {categoryOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl border border-[#e2bfb7]/20 bg-white py-2 shadow-xl">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        selectCategory(category.id)
                      }
                      className="block w-full px-4 py-2.5 text-left text-sm text-[#5a413b] transition-colors hover:bg-[#fbf2ed]"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Diet Toggle */}
            <div className="flex w-full shrink-0 justify-center md:w-auto md:justify-end">
              <div className="flex w-fit items-center overflow-hidden rounded-full border border-[#2d2926] bg-white p-0.5">
                {[
                  { id: "all", label: "All" },
                  { id: "veg", label: "🟢 Veg" },
                  { id: "non-veg", label: "🔴 Non Veg" },
                ].map((diet) => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() =>
                      setDietFilter(diet.id)
                    }
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-all sm:px-4 ${
                      dietFilter === diet.id
                        ? "bg-[#b32d0f] text-white"
                        : "bg-white text-[#2d2926]"
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  selectCategory(category.id)
                }
                className={`shrink-0 rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-all sm:px-5 sm:py-2 sm:text-[13px] ${
                  categoryFilter === category.id
                    ? "border-[#b32d0f] bg-[#b32d0f] text-white"
                    : "border-[#e2bfb7]/30 bg-white text-[#5a413b]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-8 px-5">
          {groupedDishes.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-[#efe6e2] text-5xl">
                🍽️
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
                className="text-2xl font-bold"
              >
                No dishes found
              </h3>

              <p className="mt-2 max-w-xs text-sm text-[#5a413b]">
                Try adjusting your filters or search terms.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDietFilter("all");
                  setCategoryFilter("all");
                }}
                className="mt-5 rounded-full bg-[#b32d0f] px-8 py-3 font-bold text-white shadow-md"
              >
                View Full Menu
              </button>
            </div>
          ) : (
            groupedDishes.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-48"
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                  }}
                  className="mb-3 border-b border-[#e2bfb7]/20 pb-2 text-[20px] font-bold text-[#1e1b18]"
                >
                  {category.label}
                </h2>

                <div className="space-y-3">
                  {category.dishes.map((dish) => {
                    const quantity = cart[dish.id] || 0;

                    const displayedTandooriPrice =
                      dish.name === "Tandoori Chicken"
                        ? tandooriPortion
                        : dish.price;

                    return (
                      <article
                        key={dish.id}
                        className="flex gap-3 rounded-2xl border border-[#e2bfb7]/20 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Text */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="mb-1 flex items-center gap-1">
                            <span
                              className={`flex h-3 w-3 items-center justify-center border ${
                                dish.diet === "veg"
                                  ? "border-green-600"
                                  : "border-red-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  dish.diet === "veg"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                              />
                            </span>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#5a413b]">
                              {dish.diet === "veg"
                                ? "Veg"
                                : "Non-Veg"}
                            </span>
                          </div>

                          <h3
                            style={{
                              fontFamily:
                                "'Playfair Display', serif",
                            }}
                            className="text-[17px] font-semibold leading-tight text-[#1e1b18]"
                          >
                            {dish.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#5a413b]">
                            {dish.description}
                          </p>

                          {/* Tandoori Chicken Portion Selection */}
                          {dish.name === "Tandoori Chicken" ? (
                            <div className="mt-2 space-y-1 text-[11px] text-[#5a413b]">
                              <label className="flex cursor-pointer items-center gap-1">
                                <input
                                  type="radio"
                                  name="tandoori-portion"
                                  value="200"
                                  checked={
                                    tandooriPortion === 200
                                  }
                                  onChange={() =>
                                    setTandooriPortion(200)
                                  }
                                  className="h-3 w-3 accent-[#b32d0f]"
                                />
                                Half Plate - ₹200
                              </label>

                              <label className="flex cursor-pointer items-center gap-1">
                                <input
                                  type="radio"
                                  name="tandoori-portion"
                                  value="400"
                                  checked={
                                    tandooriPortion === 400
                                  }
                                  onChange={() =>
                                    setTandooriPortion(400)
                                  }
                                  className="h-3 w-3 accent-[#b32d0f]"
                                />
                                Full Plate - ₹400
                              </label>
                            </div>
                          ) : (
                            <p className="mt-2 text-[11px] font-medium text-[#5a413b]">
                              {dish.portion}
                            </p>
                          )}

                          {/* Price */}
                          <div className="mt-auto pt-2">
                            <span className="text-lg font-bold text-[#b32d0f]">
                              {displayedTandooriPrice === null
                                ? "₹--"
                                : `₹${displayedTandooriPrice}`}
                            </span>
                          </div>
                        </div>

                        {/* Image + Add */}
                        <div className="w-24 shrink-0">
                          <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#f5ece7]">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="mt-2 h-9">
                            {quantity === 0 ? (
                              <button
                                type="button"
                                disabled={
                                  dish.name ===
                                    "Tandoori Chicken"
                                    ? !tandooriPortion
                                    : dish.price === null
                                }
                                onClick={() =>
                                  addToCart(dish.id)
                                }
                                className={`h-full w-full rounded-lg border text-xs font-bold shadow-sm transition-all active:scale-95 ${
                                  dish.name ===
                                    "Tandoori Chicken" ||
                                  dish.price !== null
                                    ? "border-[#b32d0f]/30 bg-white text-[#b32d0f] hover:bg-[#b32d0f]/5"
                                    : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                                }`}
                              >
                                + ADD
                              </button>
                            ) : (
                              <div className="flex h-full items-center justify-between overflow-hidden rounded-lg bg-[#b32d0f] text-white shadow-sm">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      dish.id,
                                      -1
                                    )
                                  }
                                  className="flex h-full w-7 items-center justify-center text-lg"
                                >
                                  −
                                </button>

                                <span className="text-sm font-bold">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addToCart(dish.id)
                                  }
                                  className="flex h-full w-7 items-center justify-center text-lg"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {/* Floating Cart */}
      {cartItems > 0 && (
        <div className="fixed bottom-0 left-0 z-50 w-full px-4 pb-5 pt-3">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#e2bfb7]/30 bg-white p-3 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="text-[#5a413b]">
                <CartIcon />
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-medium leading-none text-[#5a413b]">
                  {cartItems}{" "}
                  {cartItems === 1 ? "Item" : "Items"}
                </span>

                <span className="text-lg font-bold leading-tight text-[#1e1b18]">
                  ₹{cartTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-[#ba1a1a]/20 px-2 py-1.5 text-[10px] font-bold text-[#ba1a1a]"
              >
                Clear
              </button>
            </div>

            <Link
              to="/customercart"
              className="flex items-center gap-2 rounded-xl bg-[#b32d0f] px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
            >
              <span>View Cart</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    
          {/* Floating Cart */}
      {cartItems > 0 && (
        <div className="fixed bottom-0 left-0 z-50 w-full px-4 pb-5 pt-3">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#e2bfb7]/30 bg-white p-3 shadow-2xl">

            <div className="flex items-center gap-2">

              <div className="text-[#5a413b]">
                <CartIcon />
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-medium leading-none text-[#5a413b]">
                  {cartItems}{" "}
                  {cartItems === 1 ? "Item" : "Items"}
                </span>

                <span className="text-lg font-bold leading-tight text-[#1e1b18]">
                  ₹{cartTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-[#ba1a1a]/20 px-2 py-1.5 text-[10px] font-bold text-[#ba1a1a]"
              >
                Clear
              </button>

            </div>

            <Link
              to="/customercart"
              className="flex items-center gap-2 rounded-xl bg-[#b32d0f] px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
            >
              <span>View Cart</span>
              <span>→</span>
            </Link>

          </div>
        </div>
      )}

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavigationDrawerOpen}
        onClose={() => setIsNavigationDrawerOpen(false)}
      />

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />

    </div>
  );
}

export default CustomerMenu;