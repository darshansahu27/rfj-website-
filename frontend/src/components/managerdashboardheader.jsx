function ManagerDashboardHeader({
  onProfileClick,
  profileImage = "",
}) {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-[#fff8f5]/80 px-4 py-4 backdrop-blur-md transition-all duration-300">
      <h1 className="font-playfair text-[24px] font-bold leading-8 text-[#8d1900]">
        Manager Dashboard
      </h1>

      <button
        type="button"
        onClick={onProfileClick}
        className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#8d1900]/10 transition-transform active:scale-90"
        aria-label="Open manager profile"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Manager Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#b32d0f] font-playfair text-sm font-bold text-white">
            M
          </div>
        )}
      </button>
    </header>
  );
}

export default ManagerDashboardHeader;