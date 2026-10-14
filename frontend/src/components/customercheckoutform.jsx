
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const CART_STORAGE_KEY = "rfj_cart_items";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_DETAILS = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
};

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter(
      (item) =>
        item &&
        item.id !== undefined &&
        item.id !== null &&
        Number(item.quantity) > 0
    );
  } catch (error) {
    console.error("Unable to read checkout cart:", error);
    return [];
  }
}

function CustomerCheckoutForm() {
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState(getSavedCart);
  const [customerDetails, setCustomerDetails] = useState(EMPTY_DETAILS);
  const [editDetails, setEditDetails] = useState(EMPTY_DETAILS);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    const syncCart = () => {
      setCheckoutItems(getSavedCart());
    };

    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const itemsTotal = checkoutItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const gst = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal + gst;

  const updateEditField = (field, value) => {
    setEditDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setCheckoutError("");
  };

  const validateDetails = (details) => {
    const errors = {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    };

    if (!details.name.trim()) {
      errors.name = "Please enter your full name.";
    } else if (!/^[A-Za-z ]+$/.test(details.name.trim())) {
      errors.name = "Name can contain only letters and spaces.";
    }

    if (!details.phone.trim()) {
      errors.phone = "Please enter your mobile number.";
    } else if (
      !/^\+91\s?[6-9]\d{4}\s?\d{5}$/.test(details.phone.trim())
    ) {
      errors.phone = "Enter a valid Indian mobile number.";
    }

    if (!details.address.trim()) {
      errors.address = "Please enter your delivery address.";
    } else if (details.address.trim().length < 10) {
      errors.address = "Please enter a complete delivery address.";
    }

    if (!details.city.trim()) {
      errors.city = "Please enter your city.";
    }

    if (!details.state.trim()) {
      errors.state = "Please enter your state.";
    }

    if (details.postalCode.trim() &&!/^\d{6}$/.test(details.postalCode.trim())) {
  errors.postalCode = "Enter a valid 6-digit PIN code.";
    }

    return errors;
  };

  const handleSaveDetails = () => {
    const errors = validateDetails(editDetails);
    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      return false;
    }

    setCustomerDetails({
      name: editDetails.name.trim(),
      phone: editDetails.phone.trim(),
      address: editDetails.address.trim(),
      city: editDetails.city.trim(),
      state: editDetails.state.trim(),
      postalCode: editDetails.postalCode.trim(),
      landmark: editDetails.landmark.trim(),
    });

    setIsEditing(false);
    setCheckoutError("");
    return true;
  };

  const handleEditDetails = () => {
    setEditDetails({ ...customerDetails });
    setFormErrors({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    });
    setCheckoutError("");
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate("/customercart");
  };

  const handlePayNow = async () => {
    if (isSubmitting) return;

    setCheckoutError("");

    if (checkoutItems.length === 0) {
      setCheckoutError(
        "Your cart is empty. Return to the menu and add items."
      );
      return;
    }

    // Do not submit unsaved or invalid delivery details.
    if (isEditing) {
      const errors = validateDetails(editDetails);
      setFormErrors(errors);

      if (Object.values(errors).some(Boolean)) {
        setCheckoutError(
          "Please complete and save your delivery details before continuing."
        );
        return;
      }

      setCustomerDetails({
        name: editDetails.name.trim(),
        phone: editDetails.phone.trim(),
        address: editDetails.address.trim(),
        city: editDetails.city.trim(),
        state: editDetails.state.trim(),
        postalCode: editDetails.postalCode.trim(),
        landmark: editDetails.landmark.trim(),
      });

      setIsEditing(false);
    }

    const detailsToSubmit = isEditing ? editDetails : customerDetails;
    const validationErrors = validateDetails(detailsToSubmit);

    if (Object.values(validationErrors).some(Boolean)) {
      setFormErrors(validationErrors);
      setCheckoutError("Please check your delivery details.");
      setIsEditing(true);
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setCheckoutError(
        "Please sign in with your customer account before placing an order."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/orders/customer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: checkoutItems.map((item) => ({
              id: String(item.id),
              quantity: Number(item.quantity),
            })),
            name: detailsToSubmit.name.trim(),
            phone: detailsToSubmit.phone.trim(),
            addressLine: detailsToSubmit.address.trim(),
            city: detailsToSubmit.city.trim(),
            state: detailsToSubmit.state.trim(),
            postalCode: detailsToSubmit.postalCode.trim(),
            landmark: detailsToSubmit.landmark.trim(),
            paymentMethod,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success || !result.order) {
        throw new Error(
          result.message || "We couldn't place your order. Please try again."
        );
      }

      // Clear the cart only after the backend confirms success.
      localStorage.removeItem(CART_STORAGE_KEY);
      setCheckoutItems([]);

      navigate("/paymentconfirmed", {
        replace: true,
        state: {
          order: result.order,
          simulatedPayment: true,
        },
      });
    } catch (error) {
      console.error("Checkout request failed:", error);

      setCheckoutError(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f] ${
      formErrors[field] ? "border-red-500" : "border-[#e2bfb7]"
    }`;

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-[#e2bfb7]/30 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-97.5 items-center px-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="mr-3 flex items-center justify-center text-[#b32d0f]"
          >
            <span className="text-xl">←</span>
          </button>

          <h1 className="font-['Playfair_Display'] text-[20px] font-bold text-[#8d1900]">
            Checkout
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-97.5 px-4 pb-28 pt-20">
        {/* Order Summary */}
        <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">
          <h2 className="mb-3 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
            ORDER SUMMARY
          </h2>

          <div className="space-y-2">
            {checkoutItems.length > 0 ? (
              checkoutItems.map((item) => (
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
                    ₹
                    {(Number(item.price) || 0) *
                      (Number(item.quantity) || 0)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-[#5a413b]">
                Your cart is empty. Go back to the menu to add items.
              </p>
            )}
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
              <span className="text-[11px] font-medium">₹{gst}</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-['Playfair_Display'] text-[13px] font-bold">
                Grand Total
              </span>
              <span className="font-['Playfair_Display'] text-[14px] font-bold text-[#b32d0f]">
                ₹{grandTotal}
              </span>
            </div>

            <p className="mt-2 text-[9px] text-[#8b6a60]">
              Final pricing is calculated and verified by the server.
            </p>
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
                disabled={isSubmitting}
                className="text-[10px] font-semibold text-[#b32d0f]"
              >
                Edit Details
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-2">
              <p className="text-[11px] text-[#1e1b18]">
                {customerDetails.name}
              </p>
              <p className="text-[11px] text-[#1e1b18]">
                {customerDetails.phone}
              </p>
              <p className="text-[11px] leading-4 text-[#1e1b18]">
                {customerDetails.address}
                {", "}
                {customerDetails.city}
                {", "}
                {customerDetails.state}
                {" - "}
                {customerDetails.postalCode}
              </p>
              {customerDetails.landmark && (
                <p className="text-[11px] text-[#5a413b]">
                  Landmark: {customerDetails.landmark}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
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
                    if (/^[A-Za-z ]*$/.test(value)) {
                      updateEditField("name", value);
                    }
                  }}
                  placeholder="Enter your full name"
                  className={inputClass("name")}
                  disabled={isSubmitting}
                />
                {formErrors.name && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.name}
                  </p>
                )}
              </div>

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
                    updateEditField(
                      "phone",
                      e.target.value.replace(/[^0-9+ ]/g, "")
                    );
                  }}
                  placeholder="+91 98765 43210"
                  className={inputClass("phone")}
                  disabled={isSubmitting}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  Delivery Address
                </label>
                <textarea
                  rows={3}
                  value={editDetails.address}
                  maxLength={200}
                  onChange={(e) => updateEditField("address", e.target.value)}
                  placeholder="House number, street, area"
                  className={`${inputClass("address")} resize-none`}
                  disabled={isSubmitting}
                />
                {formErrors.address && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  City
                </label>
                <input
                  type="text"
                  value={editDetails.city}
                  maxLength={80}
                  onChange={(e) => updateEditField("city", e.target.value)}
                  placeholder="Enter your city"
                  className={inputClass("city")}
                  disabled={isSubmitting}
                />
                {formErrors.city && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  State
                </label>
                <input
                  type="text"
                  value={editDetails.state}
                  maxLength={80}
                  onChange={(e) => updateEditField("state", e.target.value)}
                  placeholder="Enter your state"
                  className={inputClass("state")}
                  disabled={isSubmitting}
                />
                {formErrors.state && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.state}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  PIN Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editDetails.postalCode}
                  maxLength={6}
                  onChange={(e) => {
                    updateEditField(
                      "postalCode",
                      e.target.value.replace(/\D/g, "")
                    );
                  }}
                  placeholder="6-digit PIN code"
                  className={inputClass("postalCode")}
                  disabled={isSubmitting}
                />
                {formErrors.postalCode && (
                  <p className="mt-1 text-[9px] text-red-600">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                  Landmark (optional)
                </label>
                <input
                  type="text"
                  value={editDetails.landmark}
                  maxLength={100}
                  onChange={(e) =>
                    updateEditField("landmark", e.target.value)
                  }
                  placeholder="Nearby landmark"
                  className={inputClass("landmark")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (customerDetails.name) {
                      setEditDetails({ ...customerDetails });
                      setIsEditing(false);
                    }
                    setFormErrors({
                      name: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      postalCode: "",
                    });
                  }}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-[#e2bfb7] py-2 text-[11px] font-semibold text-[#5a413b]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#b32d0f] py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                >
                  Save Details
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Simulated Payment Method */}
        <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">
          <h2 className="mb-2 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
            PAYMENT METHOD
          </h2>

          <p className="mb-3 text-[10px] leading-4 text-[#8b6a60]">
            Demo mode: selecting a method does not charge money. Real payment
            gateway integration will be added separately.
          </p>

          {[
            { id: "upi", title: "UPI", description: "Google Pay, PhonePe, Paytm" },
            { id: "card", title: "Debit/Credit Card", description: "Visa, Mastercard, RuPay" },
            { id: "netbanking", title: "Net Banking", description: "All major Indian banks" },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              disabled={isSubmitting}
              className={`mb-2 flex w-full items-center justify-between rounded-lg border p-3 text-left ${
                paymentMethod === method.id
                  ? "border-[#b32d0f] bg-[#fff5f1]"
                  : "border-[#e2bfb7]"
              }`}
            >
              <div>
                <p className="text-[11px] font-bold text-[#1e1b18]">
                  {method.title}
                </p>
                <p className="mt-0.5 text-[9px] text-[#5a413b]">
                  {method.description}
                </p>
              </div>

              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  paymentMethod === method.id
                    ? "border-[#b32d0f]"
                    : "border-[#e2bfb7]"
                }`}
              >
                {paymentMethod === method.id && (
                  <div className="h-2 w-2 rounded-full bg-[#b32d0f]" />
                )}
              </div>
            </button>
          ))}
        </section>

        <div className="mb-4 rounded-lg bg-[#f7eee9] px-3 py-2">
          <p className="text-[9px] leading-4 text-[#5a413b]">
            This is a simulated checkout. No card, UPI or banking credentials
            are collected, and no real payment is processed.
          </p>
        </div>

        {checkoutError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2"
          >
            <p className="text-[11px] leading-4 text-red-700">
              {checkoutError}
            </p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#e2bfb7]/30 bg-white px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <div className="mx-auto w-full max-w-97.5">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isSubmitting || checkoutItems.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b32d0f] py-3 text-[12px] font-bold text-white shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Placing Order..." : "Place Demo Order"}
            {!isSubmitting && <span className="text-base">→</span>}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default CustomerCheckoutForm;
