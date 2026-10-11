function RestaurantMenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Fork */}
      <path d="M6 2v7c0 1.3.8 2.4 2 2.8V22h2V11.8c1.2-.4 2-1.5 2-2.8V2h-2v5H9V2H7v5H6V2Z" />

      {/* Knife */}
      <path d="M15 2v8c0 1.7 1.1 3 2.5 3H18v9h2V2h-2v8h-.5c-.3 0-.5-.3-.5-.8V2h-2Z" />
    </svg>
  );
}

function ManagerLoginHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#fff8f5]/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="text-[#8d1900]">
            <RestaurantMenuIcon />
          </div>

          <h1 className="font-playfair text-2xl font-semibold tracking-tight text-[#8d1900]">
            Rohit Food Junction
          </h1>
        </div>
      </div>
    </header>
  );
}

export default ManagerLoginHeader;