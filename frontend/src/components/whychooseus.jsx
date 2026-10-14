function FeatureIcon({ type }) {
  if (type === "fresh") {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21c4.5-2.2 7-6 7-10.5C19 6 16 3 12 3S5 6 5 10.5C5 15 7.5 18.8 12 21Z" />
        <path d="M12 21V8" />
        <path d="M12 13c-2.5-2-4.5-2.5-6-2" />
        <path d="M12 10c2-1.8 4-2.2 5.5-2" />
      </svg>
    );
  }

  if (type === "colors") {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h2.5a5.5 5.5 0 0 0 0-11H12Z" />
        <circle cx="7.5" cy="10" r="1" />
        <circle cx="9" cy="6.5" r="1" />
        <circle cx="14" cy="6" r="1" />
      </svg>
    );
  }

  if (type === "verified") {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 14.5 5l3.2-.2.8 3.1 2.5 2-1.6 2.8.4 3.2-3 1.1-1.8 2.6-3-1.2-3 1.2-1.8-2.6-3-1.1.4-3.2L3 9.9l2.5-2 .8-3.1L9.5 5 12 3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-4.8" />
      </svg>
    );
  }

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h16" />
      <path d="M6 10v9" />
      <path d="M18 10v9" />
      <path d="M3 19h18" />
      <path d="M5 10V6h14v4" />
      <path d="M8 6V3h8v3" />
      <path d="M9 14h6" />
    </svg>
  );
}

const features = [
  {
    type: "fresh",
    title: "Fresh Ingredients",
    description:
      "We source only the freshest produce and meats daily to ensure peak flavor in every bite.",
    iconClass: "bg-[#f6d8cf] text-[#8d1900]",
  },
  {
    type: "colors",
    title: "Natural Food Colors",
    description:
      "No synthetic dyes. Our vibrant dishes get their color from natural turmeric, saffron, and beet.",
    iconClass: "bg-[#ffe1bd] text-[#6b3b00]",
  },
  {
    type: "verified",
    title: "Low Fat & Halal",
    description:
      "Healthy choices with low-fat paneer and certified halal chicken prepared with hygiene standards.",
    iconClass: "bg-[#e8ddf2] text-[#543b70]",
  },
  {
    type: "kitchen",
    title: "Separate Cooking",
    description:
      "Complete dietary integrity with dedicated kitchens and utensils for veg and non-veg meals.",
    iconClass: "bg-[#f5cfc4] text-[#6f1700]",
  },
];

function WhyChooseUs() {
  return (
    <section className="mb-12 bg-[#f7efeb] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl font-bold text-[#8d1900] md:text-4xl">
            Why Choose Us?
          </h2>

          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#fea13e]" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#e2bfb7]/10 bg-[#fff8f5] p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-2"
            >
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.iconClass}`}
              >
                <FeatureIcon type={feature.type} />
              </div>

              <h3 className="font-playfair text-xl font-semibold text-[#2c2421]">
                {feature.title}
              </h3>

              <p className="mt-4 font-jakarta text-sm leading-relaxed text-[#5a413b]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;