import heroImage from "../assets/hero.png";

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.5 2.93 5.94 6.57.95-4.75 4.63 1.12 6.55L12 17.48l-5.87 3.09 1.12-6.55L2.5 9.39l6.57-.95L12 2.5Z" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden px-4 py-20 sm:px-6">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#fff8f5]" />

        <div className="absolute inset-0 bg-linear-to-b from-[#fff8f5] via-transparent to-[#fff8f5]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

        {/* Left side */}
        <div className="space-y-6 text-center lg:text-left">

          <h1 className="font-playfair text-[28px] font-bold leading-9 text-[#8d1900] md:text-[48px] md:leading-14">
            Welcome to{" "}
            <br className="hidden md:block" />
            Rohit Food Junction
          </h1>

          <p className="mx-auto max-w-2xl font-jakarta text-[18px] font-medium leading-7 text-[#5a413b] lg:mx-0">
            Experience the authentic taste of India with freshly prepared
            vegetarian and non-vegetarian dishes made using premium
            ingredients, traditional recipes, and exceptional hospitality.
          </p>

          {/* Button */}
          <div className="pt-2">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#8d1900] px-8 py-4 font-jakarta text-[16px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#b32d0f] hover:scale-105 active:scale-95"
            >
              Our Menu
              <ArrowIcon />
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="relative hidden lg:block">

          {/* Food image */}
          <div className="h-125 w-125 rotate-3 overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:rotate-0">
            <img
              src={heroImage}
              alt="Rohit Food Junction food"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Top Rated badge */}
          <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fea13e] text-[#6b3b00]">
                <StarIcon />
              </div>

              <div>
                <p className="font-jakarta text-[16px] font-bold text-[#8d1900]">
                  Top Rated
                </p>

                <p className="font-jakarta text-xs text-[#5a413b]">
                  Best in the City
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;