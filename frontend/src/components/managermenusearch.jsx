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
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ManagerMenuSearch() {
  return (
    <div className="group relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e706a] transition-colors group-focus-within:text-[#8d1900]">
        <SearchIcon />
      </span>

      <input
        type="text"
        placeholder="Search menu items..."
        className="w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 font-jakarta text-[12px] text-[#1e1b18] shadow-sm outline-none placeholder:text-[#8e706a] focus:ring-2 focus:ring-[#8d1900]/20"
      />
    </div>
  );
}

export default ManagerMenuSearch;