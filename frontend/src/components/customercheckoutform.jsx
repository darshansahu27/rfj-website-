import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerCheckoutForm() {
  const navigate = useNavigate();

  /* Temporary customer details
     Later we will connect these with login/signup + database */
  const [customerDetails, setCustomerDetails] = useState({
    name: "Rohit Sharma",
    phone: "+91 98765 43210",
    address: "123 Foodie Lane, Sector 45, Chandigarh",
  });

  /* Edit details */
  const [isEditing, setIsEditing] = useState(false);

  const [editDetails, setEditDetails] = useState({
    name: "Rohit Sharma",
    phone: "+91 98765 43210",
    address: "123 Foodie Lane, Sector 45, Chandigarh",
  });

  /* Validation error messages */
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  /* Payment method */
  const [paymentMethod, setPaymentMethod] = useState("upi");

  /* Temporary order data
     Later this will come from the cart */
  const checkoutItems = [
    {
      id: 1,
      name: "Butter Chicken",
      quantity: 2,
      price: 640,
    },
    {
      id: 2,
      name: "Paneer Butter Masala",
      quantity: 1,
      price: 280,
    },
    {
      id: 3,
      name: "Tandoori Chicken (Half)",
      quantity: 1,
      price: 200,
    },
  ];

  /* Calculate totals */
  const itemsTotal = checkoutItems.reduce(
    (total, item) => total + item.price,
    0
  );

  const gst = Math.round(itemsTotal * 0.05);

  const grandTotal = itemsTotal + gst;

  /* Save edited details */
  const handleSaveDetails = () => {
    const errors = {
      name: "",
      phone: "",
      address: "",
    };

    /* Name validation */
    if (!editDetails.name.trim()) {
      errors.name = "Please enter your full name.";
    } else if (!/^[A-Za-z ]+$/.test(editDetails.name.trim())) {
      errors.name = "Name can contain only letters and spaces.";
    }

    /* Phone validation */
    if (!editDetails.phone.trim()) {
      errors.phone = "Please enter your mobile number.";
    } else if (!/^\+91\s?[6-9]\d{4}\s?\d{5}$/.test(editDetails.phone.trim())) {
      errors.phone = "Enter a valid Indian mobile number.";
    }

    /* Address validation */
    if (!editDetails.address.trim()) {
      errors.address = "Please enter your delivery address.";
    } else if (editDetails.address.trim().length < 10) {
      errors.address = "Please enter a complete delivery address.";
    }

    setFormErrors(errors);

    /* Stop saving if there are errors */
    if (errors.name || errors.phone || errors.address) {
      return;
    }

    setCustomerDetails({
      name: editDetails.name.trim(),
      phone: editDetails.phone.trim(),
      address: editDetails.address.trim(),
    });

    setIsEditing(false);
  };

  /* Open edit details */
  const handleEditDetails = () => {
    setEditDetails({
      name: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
    });

    setFormErrors({
      name: "",
      phone: "",
      address: "",
    });

    setIsEditing(true);
  };

  /* Back to cart */
  const handleBack = () => {
    navigate("/customercart");
  };

  /* Go to payment page */
 const handlePayNow = (paymentSuccess) => {
  if (paymentSuccess) {
    navigate("/paymentconfirmed");
  } else {
    navigate("/paymentfailed");
  }
};

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">

      {/* Header */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-[#e2bfb7]/30 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-97.5 items-center px-4">

          <button
            type="button"
            onClick={handleBack}
            className="mr-3 flex items-center justify-center text-[#b32d0f]"
          >
            <span className="text-xl">←</span>
          </button>

          <h1 className="font-['Playfair_Display'] text-[20px] font-bold text-[#8d1900]">
            Checkout
          </h1>

        </div>
      </header>


      {/* Main Content */}
      <main className="mx-auto w-full max-w-97.5 px-4 pb-28 pt-20">

        {/* Order Summary */}
        <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">

          <h2 className="mb-3 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
            ORDER SUMMARY
          </h2>

          <div className="space-y-2">

            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >

                <div>
                  <p className="text-[11px] font-medium text-[#1e1b18]">
                    {item.name}
                  </p>

                  <p className="text-[10px] text-[#5a413b]">
                    ×{item.quantity}
                  </p>
                </div>

                <p className="text-[11px] font-medium text-[#1e1b18]">
                  ₹{item.price}
                </p>

              </div>
            ))}

          </div>

          <div className="mt-3 border-t border-[#e2bfb7]/40 pt-2">

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#5a413b]">
                Items Total
              </span>

              <span className="text-[11px] font-medium">
                ₹{itemsTotal}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-[#5a413b]">
                GST (5%)
              </span>

              <span className="text-[11px] font-medium">
                ₹{gst}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-['Playfair_Display'] text-[13px] font-bold">
                Grand Total
              </span>

              <span className="font-['Playfair_Display'] text-[14px] font-bold text-[#b32d0f]">
                ₹{grandTotal}
              </span>
            </div>

          </div>
        </section>


        {/* Delivery Details */}
        <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
              DELIVERY DETAILS
            </h2>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEditDetails}
                className="text-[10px] font-semibold text-[#b32d0f]"
              >
                Edit Details
              </button>
            )}

          </div>


          {!isEditing ? (

            <div className="space-y-2">

              <div className="flex items-start gap-2">
                <span className="text-[12px] text-[#b32d0f]">
                  ●
                </span>

                <p className="text-[11px] text-[#1e1b18]">
                  {customerDetails.name}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[12px] text-[#b32d0f]">
                  ●
                </span>

                <p className="text-[11px] text-[#1e1b18]">
                  {customerDetails.phone}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[12px] text-[#b32d0f]">
                  ●
                </span>

                <p className="text-[11px] leading-4 text-[#1e1b18]">
                  {customerDetails.address}
                </p>
              </div>

            </div>

          ) : (

            /* Edit Details Form */
            <div className="space-y-3">

              {/* Full Name */}
              <div>

                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editDetails.name}
                  maxLength={50}
                  onChange={(e) => {
  const value = e.target.value;

  // Allow only letters and spaces
  if (/^[A-Za-z ]*$/.test(value)) {
    setEditDetails({
      ...editDetails,
      name: value,
    });

    setFormErrors({
      ...formErrors,
      name: "",
    });
  }
}}
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f] ${
                    formErrors.name
                      ? "border-red-500"
                      : "border-[#e2bfb7]"
                  }`}
                />

                {formErrors.name && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.name}
                  </p>
                )}

              </div>


              {/* Mobile Number */}
              <div>

                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  inputMode="tel"
                  value={editDetails.phone}
                  maxLength={14}
                  onChange={(e) => {
                    const value = e.target.value;

                    /*
                      Allow only:
                      +91
                      digits
                      spaces
                    */
                    const cleanedValue = value.replace(
                      /[^0-9+ ]/g,
                      ""
                    );

                    setEditDetails({
                      ...editDetails,
                      phone: cleanedValue,
                    });

                    setFormErrors({
                      ...formErrors,
                      phone: "",
                    });
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f] ${
                    formErrors.phone
                      ? "border-red-500"
                      : "border-[#e2bfb7]"
                  }`}
                />

                {formErrors.phone && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.phone}
                  </p>
                )}

              </div>


              {/* Delivery Address */}
              <div>

                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  Delivery Address
                </label>

                <textarea
                  rows="3"
                  value={editDetails.address}
                  maxLength={200}
                  onChange={(e) => {
                    const value = e.target.value;

                    /*
                      Allow normal address characters:
                      letters, numbers, spaces and common
                      address punctuation.
                    */
                    const cleanedValue = value.replace(
                      /[^A-Za-z0-9\s,.'/#-]/g,
                      ""
                    );

                    setEditDetails({
                      ...editDetails,
                      address: cleanedValue,
                    });

                    setFormErrors({
                      ...formErrors,
                      address: "",
                    });
                  }}
                  placeholder="Enter your complete delivery address"
                  className={`w-full resize-none rounded-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f] ${
                    formErrors.address
                      ? "border-red-500"
                      : "border-[#e2bfb7]"
                  }`}
                />

                {formErrors.address && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.address}
                  </p>
                )}

              </div>


              {/* Buttons */}
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);

                    setFormErrors({
                      name: "",
                      phone: "",
                      address: "",
                    });
                  }}
                  className="flex-1 rounded-lg border border-[#e2bfb7] py-2 text-[11px] font-semibold text-[#5a413b]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="flex-1 rounded-lg bg-[#b32d0f] py-2 text-[11px] font-semibold text-white"
                >
                  Save Details
                </button>

              </div>

            </div>

          )}

        </section>


        {/* Select Payment Method */}
        <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">

          <h2 className="mb-3 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
            SELECT PAYMENT METHOD
          </h2>


          {/* UPI */}
          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`mb-2 flex w-full items-center justify-between rounded-lg border p-3 text-left ${
              paymentMethod === "upi"
                ? "border-[#b32d0f] bg-[#fff5f1]"
                : "border-[#e2bfb7]"
            }`}
          >

            <div>
              <p className="text-[11px] font-bold text-[#1e1b18]">
                UPI
              </p>

              <p className="mt-0.5 text-[9px] text-[#5a413b]">
                Google Pay, PhonePe, Paytm
              </p>
            </div>

            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                paymentMethod === "upi"
                  ? "border-[#b32d0f]"
                  : "border-[#e2bfb7]"
              }`}
            >
              {paymentMethod === "upi" && (
                <div className="h-2 w-2 rounded-full bg-[#b32d0f]" />
              )}
            </div>

          </button>


          {/* Debit/Credit Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`mb-2 flex w-full items-center justify-between rounded-lg border p-3 text-left ${
              paymentMethod === "card"
                ? "border-[#b32d0f] bg-[#fff5f1]"
                : "border-[#e2bfb7]"
            }`}
          >

            <div>
              <p className="text-[11px] font-bold text-[#1e1b18]">
                Debit/Credit Card
              </p>

              <p className="mt-0.5 text-[9px] text-[#5a413b]">
                Visa, Mastercard, RuPay
              </p>
            </div>

            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                paymentMethod === "card"
                  ? "border-[#b32d0f]"
                  : "border-[#e2bfb7]"
              }`}
            >
              {paymentMethod === "card" && (
                <div className="h-2 w-2 rounded-full bg-[#b32d0f]" />
              )}
            </div>

          </button>


          {/* Net Banking */}
          <button
            type="button"
            onClick={() => setPaymentMethod("netbanking")}
            className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${
              paymentMethod === "netbanking"
                ? "border-[#b32d0f] bg-[#fff5f1]"
                : "border-[#e2bfb7]"
            }`}
          >

            <div>
              <p className="text-[11px] font-bold text-[#1e1b18]">
                Net Banking
              </p>

              <p className="mt-0.5 text-[9px] text-[#5a413b]">
                All major Indian banks
              </p>
            </div>

            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                paymentMethod === "netbanking"
                  ? "border-[#b32d0f]"
                  : "border-[#e2bfb7]"
              }`}
            >
              {paymentMethod === "netbanking" && (
                <div className="h-2 w-2 rounded-full bg-[#b32d0f]" />
              )}
            </div>

          </button>

        </section>


        {/* Security Message */}
        <div className="mb-4 rounded-lg bg-[#f7eee9] px-3 py-2">

          <p className="text-[9px] leading-4 text-[#5a413b]">
            🔒 Your transaction is secured with 256-bit SSL encryption.
            We do not store your payment credentials.
          </p>

        </div>

      </main>


      {/* Bottom Pay Now */}
      <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#e2bfb7]/30 bg-white px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">

        <div className="mx-auto w-full max-w-97.5">

          <button
            type="button"
            onClick={handlePayNow}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b32d0f] py-3 text-[12px] font-bold text-white shadow-md transition active:scale-[0.98]"
          >
            Pay Now

            <span className="text-base">
              →
            </span>
          </button>

        </div>

      </footer>

    </div>
  );
}

export default CustomerCheckoutForm;