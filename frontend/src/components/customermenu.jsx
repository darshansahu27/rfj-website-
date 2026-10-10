import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import NavigationDrawer from "./navigationdrawer";

import ProfileDrawer from "./profiledrawer";

// Fallback image for dishes without an image_url in Supabase.

const FALLBACK_IMAGE =

  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80";

// Labels for the category IDs currently returned by your API.

// For a permanent solution, the API should return category names.

const CATEGORY_LABELS = {

  "57eab28c-2174-479d-b4a6-eefccb00657a": "Starters",

  "bcb70ddc-7dab-42ac-8cf3-9daab4dc85c7": "Main Course",

  "f6fc85ca-7232-4dac-ba56-98d2deb9c6d3": "Biryani",

  "c514b6b3-0942-4cf7-ad12-bf1399da59e9": "Breads",

  "0422d690-dbdf-432e-9e78-6e5875b91a6c": "Desserts",

  "09b73b4c-7709-4d92-b445-5582c4b74fb7": "Beverages",

};

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

      aria-hidden="true"

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

      aria-hidden="true"

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

      aria-hidden="true"

    >

      <circle cx="9" cy="20" r="1" />

      <circle cx="18" cy="20" r="1" />

      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />

    </svg>

  );

}

function CustomerMenu() {

  const [dishes, setDishes] = useState([]);

  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState("");

  const [search, setSearch] = useState("");

  const [dietFilter, setDietFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] =

    useState(false);

  const [isProfileDrawerOpen, setIsProfileDrawerOpen] =

    useState(false);

  // Cart keys are Supabase UUIDs.

  const [cart, setCart] = useState(() => {

  try {

    const savedItems = JSON.parse(

      localStorage.getItem("rfj_cart_items") || "[]"

    );

    return Object.fromEntries(

      savedItems.map((item) => [item.id, item.quantity])

    );

  } catch {

    return {};

  }

});

const [cartPrices, setCartPrices] = useState(() => {

  try {

    const savedItems = JSON.parse(

      localStorage.getItem("rfj_cart_items") || "[]"

    );

    return Object.fromEntries(

      savedItems.map((item) => [item.id, item.price])

    );

  } catch {

    return {};

  }

});

  // Fetch menu items from the Express backend.

  useEffect(() => {

    const controller = new AbortController();

    async function fetchMenu() {

      try {

        setMenuLoading(true);

        setMenuError("");

        const response = await fetch(

          "http://localhost:5000/api/menu",

          { signal: controller.signal }

        );

        if (!response.ok) {

          throw new Error(`Menu request failed (${response.status})`);

        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {

          throw new Error("The server returned an invalid menu response.");

        }

        const formattedDishes = result.data

          .filter((item) => item.is_available)

          .map((item) => ({

            id: item.id,

            categoryId: item.category_id,

            category:

              item.category_id || "other",

            categoryName:

              CATEGORY_LABELS[item.category_id] || "Other",

            name: item.name,

            description: item.description || "Freshly prepared dish.",

            diet:

              item.dietary_type === "vegetarian"

                ? "veg"

                : "non-veg",

            price:

              item.price === null || item.price === undefined

                ? null

                : Number(item.price),

            image: item.image_url || FALLBACK_IMAGE,

            isPopular: item.is_popular,

          }));

        setDishes(formattedDishes);

      } catch (error) {

        if (error.name !== "AbortError") {

          console.error("Unable to load menu:", error);

          setMenuError(

            "We couldn't load the menu. Please check your connection and try again."

          );

        }

      } finally {

        if (!controller.signal.aborted) {

          setMenuLoading(false);

        }

      }

    }

    fetchMenu();

    return () => controller.abort();

  }, []);

  // Save the cart so it remains available after navigation and refresh.
  useEffect(() => {
    if (menuLoading) return;

    const savedItems = Object.entries(cart)
      .map(([id, quantity]) => {
        const dish = dishes.find((item) => item.id === id);

        if (!dish) return null;

        return {
          ...dish,
          price: cartPrices[id] ?? dish.price,
          quantity,
        };
      })
      .filter(Boolean);

    try {
      localStorage.setItem("rfj_cart_items", JSON.stringify(savedItems));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart, cartPrices, dishes, menuLoading]);

  // Build category options from the categories actually present in the API.

  const categories = useMemo(() => {

    const uniqueCategories = [

      ...new Map(

        dishes.map((dish) => [

          dish.category,

          {

            id: dish.category,

            label: dish.categoryName,

          },

        ])

      ).values(),

    ];

    return [

      { id: "all", label: "All" },

      ...uniqueCategories,

    ];

  }, [dishes]);

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

  }, [dishes, search, dietFilter, categoryFilter]);

  const groupedDishes = useMemo(() => {

    return categories

      .filter((category) => category.id !== "all")

      .map((category) => ({

        ...category,

        dishes: filteredDishes.filter(

          (dish) => dish.category === category.id

        ),

      }))

      .filter((category) => category.dishes.length > 0);

  }, [categories, filteredDishes]);

  const cartItems = Object.values(cart).reduce(

    (total, quantity) => total + quantity,

    0

  );

  const cartTotal = Object.entries(cart).reduce(

    (total, [id, quantity]) => {

      const dish = dishes.find((item) => item.id === id);

      if (!dish) return total;

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

    if (!dish || dish.price === null || !Number.isFinite(dish.price)) {

      return;

    }

    setCart((currentCart) => ({

      ...currentCart,

      [dishId]: (currentCart[dishId] || 0) + 1,

    }));

    // Keep the price used when this dish was first added.

    setCartPrices((currentPrices) => ({

      ...currentPrices,

      [dishId]:

        currentPrices[dishId] !== undefined

          ? currentPrices[dishId]

          : dish.price,

    }));

  };

  const updateQuantity = (dishId, change) => {

    setCart((currentCart) => {

      const nextQuantity =

        (currentCart[dishId] || 0) + change;

      const nextCart = { ...currentCart };

      if (nextQuantity <= 0) {

        delete nextCart[dishId];

      } else {

        nextCart[dishId] = nextQuantity;

      }

      return nextCart;

    });

    if ((cart[dishId] || 0) + change <= 0) {

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

        document.getElementById(categoryId)?.scrollIntoView({

          behavior: "smooth",

          block: "start",

        });

      }, 50);

    } else {

      window.scrollTo({ top: 0, behavior: "smooth" });

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

            style={{ fontFamily: "'Playfair Display', serif" }}

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

      <main className="pb-32 pt-16">

        {/* Search and filters */}

        <div className="sticky top-16 z-40 space-y-3 border-b border-[#e2bfb7]/10 bg-white px-5 py-3 shadow-sm">

          <div className="relative">

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a413b]">

              <SearchIcon />

            </div>

            <input

              type="text"

              value={search}

              onChange={(event) => setSearch(event.target.value)}

              placeholder="Search for dishes..."

              className="h-11 w-full rounded-full border-0 bg-[#fbf2ed] pl-11 pr-4 text-sm text-[#1e1b18] outline-none placeholder:text-[#8e706a] focus:ring-2 focus:ring-[#b32d0f]/20"

            />

          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">

            <div className="relative w-full md:flex-1 md:max-w-190">

              <button

                type="button"

                onClick={() => setCategoryOpen((open) => !open)}

                className="flex h-10 w-full items-center justify-between rounded-full border border-[#e2bfb7]/30 bg-white px-4 text-sm text-[#5a413b]"

              >

                <span>

                  {categories.find(

                    (category) => category.id === categoryFilter

                  )?.label || "Categories"}

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

                      onClick={() => selectCategory(category.id)}

                      className="block w-full px-4 py-2.5 text-left text-sm text-[#5a413b] hover:bg-[#fbf2ed]"

                    >

                      {category.label}

                    </button>

                  ))}

                </div>

              )}

            </div>

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

                    onClick={() => setDietFilter(diet.id)}

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

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">

            {categories.map((category) => (

              <button

                key={category.id}

                type="button"

                onClick={() => selectCategory(category.id)}

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

        {/* Menu content */}

        <div className="mt-6 space-y-8 px-5">

          {menuLoading ? (

            <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#5a413b]">

              Loading menu...

            </div>

          ) : menuError ? (

            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">

              <div className="mb-4 text-5xl">⚠️</div>

              <h3

                style={{ fontFamily: "'Playfair Display', serif" }}

                className="text-2xl font-bold"

              >

                Menu unavailable

              </h3>

              <p className="mt-2 max-w-xs text-sm text-[#5a413b]">

                {menuError}

              </p>

              <button

                type="button"

                onClick={() => window.location.reload()}

                className="mt-5 rounded-full bg-[#b32d0f] px-8 py-3 font-bold text-white shadow-md"

              >

                Try Again

              </button>

            </div>

          ) : groupedDishes.length === 0 ? (

            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">

              <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-[#efe6e2] text-5xl">

                🍽️

              </div>

              <h3

                style={{ fontFamily: "'Playfair Display', serif" }}

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

                  style={{ fontFamily: "'Playfair Display', serif" }}

                  className="mb-3 border-b border-[#e2bfb7]/20 pb-2 text-[20px] font-bold text-[#1e1b18]"

                >

                  {category.label}

                </h2>

                <div className="space-y-3">

                  {category.dishes.map((dish) => {

                    const quantity = cart[dish.id] || 0;

                    return (

                      <article

                        key={dish.id}

                        className="flex gap-3 rounded-2xl border border-[#e2bfb7]/20 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"

                      >

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

                              {dish.diet === "veg" ? "Veg" : "Non-Veg"}

                            </span>

                            {dish.isPopular && (

                              <span className="ml-1 rounded-full bg-[#fff0d9] px-2 py-0.5 text-[9px] font-bold text-[#8d1900]">

                                Popular

                              </span>

                            )}

                          </div>

                          <h3

                            style={{ fontFamily: "'Playfair Display', serif" }}

                            className="text-[17px] font-semibold leading-tight text-[#1e1b18]"

                          >

                            {dish.name}

                          </h3>

                          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#5a413b]">

                            {dish.description}

                          </p>

                          <div className="mt-auto pt-2">

                            <span className="text-lg font-bold text-[#b32d0f]">

                              {dish.price === null

                                ? "Price unavailable"

                                : `₹${dish.price}`}

                            </span>

                          </div>

                        </div>

                        <div className="w-24 shrink-0">

                          <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#f5ece7]">

                            <img

                              src={dish.image}

                              alt={dish.name}

                              loading="lazy"

                              onError={(event) => {

                                event.currentTarget.onerror = null;

                                event.currentTarget.src = FALLBACK_IMAGE;

                              }}

                              className="h-full w-full object-cover"

                            />

                          </div>

                          <div className="mt-2 h-9">

                            {quantity === 0 ? (

                              <button

                                type="button"

                                disabled={

                                  dish.price === null ||

                                  !Number.isFinite(dish.price)

                                }

                                onClick={() => addToCart(dish.id)}

                                className={`h-full w-full rounded-lg border text-xs font-bold shadow-sm transition-all active:scale-95 ${

                                  dish.price !== null &&

                                  Number.isFinite(dish.price)

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

                                  onClick={() => updateQuantity(dish.id, -1)}

                                  aria-label={`Remove one ${dish.name}`}

                                  className="flex h-full w-7 items-center justify-center text-lg"

                                >

                                  −

                                </button>

                                <span className="text-sm font-bold">

                                  {quantity}

                                </span>

                                <button

                                  type="button"

                                  onClick={() => addToCart(dish.id)}

                                  aria-label={`Add one ${dish.name}`}

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

      {/* Floating Cart — only one instance */}

      {cartItems > 0 && (

        <div className="fixed bottom-0 left-0 z-50 w-full px-4 pb-5 pt-3">

          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#e2bfb7]/30 bg-white p-3 shadow-2xl">

            <div className="flex items-center gap-2">

              <div className="text-[#5a413b]">

                <CartIcon />

              </div>

              <div className="flex flex-col">

                <span className="text-[11px] font-medium leading-none text-[#5a413b]">

                  {cartItems} {cartItems === 1 ? "Item" : "Items"}

                </span>

                <span className="text-lg font-bold leading-tight text-[#1e1b18]">

                  ₹{cartTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}

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

      <NavigationDrawer

        isOpen={isNavigationDrawerOpen}

        onClose={() => setIsNavigationDrawerOpen(false)}

      />

      <ProfileDrawer

        isOpen={isProfileDrawerOpen}

        onClose={() => setIsProfileDrawerOpen(false)}

      />

    </div>

  );

}

export default CustomerMenu;
