function OwnerOrderStatus({ status }) {
  const statusStyles = {
    Preparing: "bg-[#fff0d6] text-[#b86b00]",
    "Out for Delivery": "bg-[#e5efff] text-[#3d6fb4]",
    Delivered: "bg-[#dff5e8] text-[#27804d]",
    Cancelled: "bg-[#fde2e2] text-[#c43d3d]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 font-jakarta text-[9px] font-bold uppercase tracking-wide ${
        statusStyles[status] || "bg-[#f1e5e0] text-[#6f5a54]"
      }`}
    >
      {status}
    </span>
  );
}

export default OwnerOrderStatus;