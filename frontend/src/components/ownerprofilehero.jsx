function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function OwnerProfileHero({
  name,
  image,
  onEditImage,
  onEditName,
}) {
  return (
    <section className="flex flex-col items-center">
      <div className="relative">
        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#efe6e2] bg-[#f5ece7] shadow-lg">
          <img
            src={image}
            alt="Owner profile"
            className="h-full w-full object-cover"
          />
        </div>

        <button
          type="button"
          onClick={onEditImage}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fff8f5] bg-[#b32d0f] text-white shadow-md transition hover:scale-110"
          aria-label="Edit profile photo"
        >
          <EditIcon />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1">
        <h2 className="font-playfair text-[19px] font-bold text-[#2b211e]">
          {name}
        </h2>

        <button
          type="button"
          onClick={onEditName}
          className="text-[#5a413b] transition hover:text-[#b32d0f]"
          aria-label="Edit owner name"
        >
          <EditIcon />
        </button>
      </div>

      <p className="mt-0.5 font-jakarta text-[9px] font-medium uppercase tracking-[2px] text-[#8e706a]">
        Owner Portal
      </p>
    </section>
  );
}

export default OwnerProfileHero;