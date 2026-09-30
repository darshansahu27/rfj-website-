import butterChickenImage from "../assets/butter-chicken.jfif";
const dishes = [
  {
    name: "Butter Chicken",
    image: butterChickenImage,
  },
  {
    name: "Paneer Butter Masala",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmodRSKAmpHR8HAEnPv-yLL-ezo4urfTRrC8myJEA7mP63mN0cw12zw7SE8dqyPZWa1OLy3IqiBwE2E_s9ElLZR6ZRg_BU8xcc-btF8FieSYfVgzTJmIzlUNdo_GzWneUycoxysAwSi7uARYBx52QNZW28bKpjeE-ByjGQjbha1XNpOPmCZw02gFQpawaGs9al1dJ3jUAvzdYJpMJCGfLQPxSoP40xZj2YzqCj9rv8ooCvwS8ksZt6",
  },
  {
    name: "Chicken Biryani",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlunOW11jNFTzS_7G8HPNVPnrE0Raz5ai8Uw8vRniNmRIRsCHjHAaqNHaIL-tPvv6119_TAj9K23dJ6xd1FnfG00wlzJsqlE5D9Rx0ggFBiivP_X76dnnIKyOJAlks0oth-9JQocTGwZ8rXgeP1wZkg5_-XEdzv2W4hP_uehfudLNnOTnK919Y1OX0JvkL3F6XfZ8f6ZT8D1Mo9_I5N2Urne47smWt6z7wxhqC5wIO1oIL2r7mrqmq",
  },
  {
    name: "Tandoori Chicken",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgfwBLGJhCUHuJ2feupOc3yrf3FvIPCCvriJiNyxV0NFMXjdjisvouz47speoDV319QMp_xH8RIx80b_HMWCM5_4IvYhqqll-zcCBzOq6akVteHKwX1-TlvGv-HwKtWaeKQbfPOEbLY1bWZa-oeE8klXqt8Ax1Vuw2O67-ypBGutrlOxzQi4nDxqqtVRH9aLZWtNtKO3GxQwrQXi0QkfBBc4dMqrlz2_M5uC0H9EkmejBXwZLS67qb",
  },
];

function PopularDishes() {
  return (
    <section
      id="menu"
      className="max-w-7xl mx-auto px-6 py-12 bg-white/50 backdrop-blur-sm rounded-3xl mb-12"
    >
      {/* Section heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-playfair text-3xl md:text-4xl text-on-surface">
            Popular Dishes
          </h2>
        </div>
      </div>

      {/* Dishes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <div
            key={dish.name}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={dish.image}
                alt={dish.name}
              />
            </div>

            {/* Card content */}
            <div className="p-4 space-y-4">
              <h3 className="font-playfair text-xl text-on-surface">
                {dish.name}
              </h3>

              {/* Order Now */}
              <a
                href="/menu"
                className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
              >
                Order Now
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularDishes;