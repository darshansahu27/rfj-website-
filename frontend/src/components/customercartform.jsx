import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ArrowBackIcon() {
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
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ArrowForwardIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CustomerCartForm() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Butter Chicken",
      description: "Classic creamy tomato gravy",
      price: 320,
      quantity: 2,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5sF2a-zXnYE6-91oIJLng9d_FdfSG93dyyQQ2reK8O5aWPm5T9gU-PMZ_fMqZHI9cMZ2UcqA0CnzRCC72bmw-sJjiH-e2rxkgdd8yR8jEYl8DsdU5qLs1ykZXmwJPFJZIJUoY5vjVN0JCh1LD27MuCJtBTCbkW-abbEJ6VHDBnBoWhy3-iIz1mFhyoQMEYFrPryZo6giBZPk93G0H9nb7yGVunvTLObKVqcX8F0KQMpn-kgq1Be9C",
    },
    {
      id: 2,
      name: "Tandoori Chicken",
      description: "Half Plate",
      price: 200,
      quantity: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBovnhK515sqZRhAPRgH4d5cgyRRrMy7aIo1IskDuFPbLAIZDosxK4AOPC-Ftx9VvYu1oXjsRuMMaPLEwzd-LnWRhX14Md_-mweuYJdODNtaudF35F7DDm77Wr4kigliJ8rxNv2Fir1uoH-cWFqnMqPwjhry8u9RzwY0N9-vROt99m5bb4WbAIdRtymk6aJSUc2dCpZwr3mNAM8u5qrlUBEkJRUaUg_r1JQVJXBQAQr-rp1_BIOczht",
    },
    {
      id: 3,
      name: "Paneer Tikka Masala",
      description: "Grilled paneer in spiced gravy",
      price: 280,
      quantity: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB5tLy-PmGuMuh2qffnEAK1UO9vnkdGgXwzjrsfZjMCiY_Umpgrxu1F7SLjeXvljPSDh2Rac4Xsrn77HHlkhqCpv-a-Rw9pbtB6Qso_KfaDyhOv8nIbkZn4esRCcpXJLTN4fY_ArMohvM70AwS2bXmOp4hBKnSlBPtfuvq7nGWPOIJebd9ypkLtSHEqeguAkO9IIBsXmGaIVegFI7du9U0oxRYFrKl5LuMsIe-JFsKyAMxYFjhRu4A9",
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + change,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const itemsTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
      {/* Header */}
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white/95 px-5 shadow-sm backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate("/menu")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#1e1b18] transition-colors hover:bg-[#f5ece7]"
          aria-label="Go back to menu"
        >
          <ArrowBackIcon />
        </button>

        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-[20px] font-semibold text-[#1e1b18]"
        >
          My Cart
        </h1>

        <div className="h-10 w-10" />
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-lg px-5 pb-44 pt-24">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-2xl border border-[#e2bfb7]/10 bg-white p-4 shadow-sm"
            >
              {/* Image + Price */}
              <div className="flex w-20 shrink-0 flex-col items-center gap-2">
                <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#e9e1dc]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <span className="text-[13px] font-bold text-[#8d1900]">
                  ₹{item.price}
                </span>
              </div>

              {/* Item Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="text-[14px] font-bold leading-5 text-[#1e1b18]"
                  >
                    {item.name}
                  </h3>

                  {item.name === "Tandoori Chicken" ? (
                    <div className="mt-1 inline-flex items-center rounded-lg bg-[#ffdcc0]/30 px-2 py-1">
                      <p className="text-[10px] font-bold text-[#6b3b00]">
                        Half Plate
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] leading-4 text-[#5a413b]">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="mt-3 flex justify-end">
                  <div className="flex items-center rounded-full border border-[#e2bfb7]/20 bg-[#f5ece7] p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-8 w-8 items-center justify-center text-[#8d1900] transition-transform active:scale-90"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <MinusIcon />
                    </button>

                    <span className="mx-3 min-w-4 text-center text-[13px] font-bold text-[#1e1b18]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-8 w-8 items-center justify-center text-[#8d1900] transition-transform active:scale-90"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 && (
          <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5ece7] text-3xl">
              🛒
            </div>

            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl font-bold text-[#1e1b18]"
            >
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-[#5a413b]">
              Add some delicious dishes from our menu.
            </p>

            <button
              type="button"
              onClick={() => navigate("/customermenu")}
              className="mt-5 rounded-full bg-[#b32d0f] px-7 py-3 text-sm font-bold text-white shadow-md"
            >
              View Menu
            </button>
          </div>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <section className="mt-7">
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="mb-3 text-[18px] font-semibold text-[#1e1b18]"
            >
              Order Summary
            </h2>

            <div className="rounded-2xl border border-[#e2bfb7]/10 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5a413b]">
                  Items Total
                </span>

                <span className="text-[15px] font-bold text-[#1e1b18]">
                  ₹{itemsTotal}
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Checkout Area */}
      {cartItems.length > 0 && (
        <footer className="sticky bottom-0 left-0 z-50 w-full bg-white/95 px-5 pb-5 pt-3 shadow-2xl backdrop-blur-lg">
          <div className="mx-auto w-full max-w-lg">
            {/* Total */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-[#5a413b]">
                  Total Payable
                </span>

                <span
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-[20px] font-bold text-[#8d1900]"
                >
                  ₹{itemsTotal}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#6b3b00]">
                <ShoppingBagIcon />

                <span className="text-[11px] font-bold">
                  {totalItems}{" "}
                  {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate("/checkoutpage")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b32d0f] py-3.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowForwardIcon />
            </button>

            {/* Continue Ordering */}
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-3 w-full text-center text-[11px] font-medium text-[#5a413b] transition-colors hover:text-[#8d1900]"
            >
              Continue Ordering
            </button>

            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#e2bfb7]/30" />
          </div>
        </footer>
      )}
    </div>
  );
}

export default CustomerCartForm;