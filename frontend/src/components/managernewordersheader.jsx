function ManagerNewOrdersHeader() {
  return (
    <section className="mx-auto flex w-full max-w-[600px] items-center justify-between px-4 pt-1 pb-3">
      <h2 className="font-playfair text-[16px] font-bold leading-6 text-[#2b211e]">
        New Orders
      </h2>

      <span className="rounded-full bg-[#f9e4dc] px-3 py-1 font-jakarta text-[9px] font-bold text-[#c92f0f]">
        Recent First
      </span>
    </section>
  );
}

export default ManagerNewOrdersHeader;