
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CART_STORAGE_KEY = "rfj_cart_items";

const EMPTY_DETAILS = {
  name: "",
  phone: "",
  address: "",
  landmark: "",
};

function getSavedCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        item.id !== undefined &&
        item.id !== null &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
    );
  } catch (error) {
    console.error("Unable to read cart:", error);
    return [];
  }
}

function CustomerCheckoutForm() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(getSavedCart);
  const [customerDetails, setCustomerDetails] = useState(EMPTY_DETAILS);
  const [editDetails, setEditDetails] = useState(EMPTY_DETAILS);
  const [savedAddressMeta, setSavedAddressMeta] = useState({
    city: "",
    state: "",
    postalCode: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const loadCustomerDetails = useCallback(async () => {
    setIsLoadingProfile(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setCheckoutError("Please sign in to place your order.");
        setIsEditing(true);
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`${API_URL}/api/profile/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load your saved profile."
        );
      }

      const profile = result.profile || {};
      const address = profile.address || {};

      const details = {
        name: profile.fullName || "",
        phone: profile.phone || "",
        address: address.addressLine || "",
        landmark: address.landmark || "",
      };

      setCustomerDetails(details);
      setEditDetails(details);
      setSavedAddressMeta({
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
      });

      setCheckoutError("");

      // Open the form when any required detail is missing.
      setIsEditing(
        !details.name.trim() ||
          !details.phone.trim() ||
          !details.address.trim()
      );
    } catch (error) {
      console.error("Unable to load customer profile:", error);
      setCheckoutError(
        error.message || "Unable to load your saved profile."
      );
      setIsEditing(true);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    loadCustomerDetails();
  }, [loadCustomerDetails]);

  useEffect(() => {
    const syncCart = () => setCartItems(getSavedCart());

    window.addEventListener("storage", syncCart);
    window.addEventListener("focus", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("focus", syncCart);
    };
  }, []);

  const itemsTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const gst = Math.round(itemsTotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((itemsTotal + gst) * 100) / 100;

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const updateEditField = (field, value) => {
    setEditDetails((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
    setCheckoutError("");
  };

  const validateDetails = (details = editDetails) => {
  const errors = { name: "", phone: "", address: "" };

  const name = (details.name || "").trim();
  const address = (details.address || "").trim();

  // Normalize the phone number to exactly 10 digits.
  let phoneDigits = (details.phone || "").replace(/\D/g, "");

  if (phoneDigits.startsWith("91") && phoneDigits.length === 12) {
    phoneDigits = phoneDigits.slice(2);
  }

  if (name.length < 2 || name.length > 100) {
    errors.name = "Enter your full name.";
  }

  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (address.length < 10 || address.length > 500) {
    errors.address = "Enter a complete delivery address (10–500 characters).";
  }

  return errors;
};
  const handleSaveDetails = () => {
    const errors = validateDetails();
    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    const details = {
      name: editDetails.name.trim(),
      phone: editDetails.phone.trim(),
      address: editDetails.address.trim(),
      landmark: editDetails.landmark.trim(),
    };

    // These edits are kept in component state only.
    // The saved profile and saved address are never updated here.
    setCustomerDetails(details);
    setEditDetails(details);
    setIsEditing(false);
    setCheckoutError("");
  };

  const handleEditDetails = () => {
    setEditDetails({ ...customerDetails });
    setFormErrors({ name: "", phone: "", address: "" });
    setCheckoutError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditDetails({ ...customerDetails });
    setFormErrors({ name: "", phone: "", address: "" });
    setIsEditing(false);
    setCheckoutError("");
  };

  const handleBack = () => navigate("/customercart");

  const handlePayNow = async () => {
    if (isSubmitting) return;

    if (!auth.currentUser) {
      setCheckoutError("Please sign in to place your order.");
      return;
    }

    if (!cartItems.length) {
      setCheckoutError("Your cart is empty. Add items before checking out.");
      return;
    }

    if (isEditing) {
      const errors = validateDetails();
      setFormErrors(errors);

      if (Object.values(errors).some(Boolean)) {
        setCheckoutError("Please correct the delivery details above.");
        return;
      }

      setCheckoutError("Please save your delivery details before placing the order.");
      return;
    }
const errors = validateDetails(customerDetails);
console.log("Checkout details:", customerDetails);
console.log("Checkout validation errors:", errors);
setFormErrors(errors);

if (Object.values(errors).some(Boolean)) {
  const messages = Object.values(errors).filter(Boolean);
  setCheckoutError(messages.join(" "));
  setEditDetails({ ...customerDetails });
  setIsEditing(true);
  return;
}

    

    setIsSubmitting(true);
    setCheckoutError("");

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${API_URL}/api/orders/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: String(item.id),
            quantity: Number(item.quantity),
          })),
          name: customerDetails.name,
          phone: customerDetails.phone,
          addressLine: customerDetails.address,
          landmark: customerDetails.landmark,
          // Included for compatibility with the checkout selection.
          // The current backend treats this as simulated checkout only.
          paymentMethod,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success || !result.order) {
        throw new Error(
          result.message || "We couldn't place your order. Please try again."
        );
      }

      // Clear the cart only after the backend confirms order creation.
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);

      navigate("/paymentconfirmed", {
        state: {
          order: result.order,
          simulatedPayment: true,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      setCheckoutError(
        error.message || "We couldn't place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18]">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-[#e2bfb7]/30 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center px-4">
          <button
            type="button"
            onClick={handleBack}
            className="mr-3 flex items-center justify-center text-[#b32d0f]"
            aria-label="Back to cart"
          >
            <span className="text-xl">←</span>
          </button>

          <h1 className="font-['Playfair_Display'] text-[20px] font-bold text-[#8d1900]">
            Checkout
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-32 pt-20">
        {cartItems.length === 0 ? (
          <section className="rounded-xl border border-[#e2bfb7]/40 bg-white p-5 text-center shadow-sm">
            <h2 className="font-['Playfair_Display'] text-lg font-bold">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-[#5a413b]">
              Add some dishes before checking out.
            </p>
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="mt-4 rounded-lg bg-[#b32d0f] px-5 py-2 text-sm font-semibold text-white"
            >
              View Menu
            </button>
          </section>
        ) : (
          <>
            <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">
              <h2 className="mb-3 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium">
                        {item.name || "Menu item"}
                      </p>
                      <p className="text-[10px] text-[#5a413b]">
                        ₹{formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-[11px] font-semibold">
                      ₹
                      {formatPrice(
                        (Number(item.price) || 0) *
                          (Number(item.quantity) || 0)
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-[#e2bfb7]/40 pt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#5a413b]">Items Total</span>
                  <span>₹{formatPrice(itemsTotal)}</span>
                </div>
                <div className="mt-1 flex justify-between text-[11px]">
                  <span className="text-[#5a413b]">GST (5%)</span>
                  <span>₹{formatPrice(gst)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-['Playfair_Display'] text-[13px] font-bold">
                    Estimated Total
                  </span>
                  <span className="font-['Playfair_Display'] text-[14px] font-bold text-[#b32d0f]">
                    ₹{formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="mt-2 text-[9px] text-[#5a413b]">
                  Final prices are calculated by the server when you place your order.
                </p>
              </div>
            </section>

            <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
                  DELIVERY DETAILS
                </h2>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditDetails}
                    disabled={isSubmitting || isLoadingProfile}
                    className="text-[10px] font-semibold text-[#b32d0f] disabled:opacity-50"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {isLoadingProfile ? (
                <p className="py-4 text-sm text-[#5a413b]">
                  Loading your saved details…
                </p>
              ) : !isEditing ? (
                <div className="space-y-2">
                  <p className="text-[11px]">{customerDetails.name}</p>
                  <p className="text-[11px]">{customerDetails.phone}</p>
                  <p className="text-[11px] leading-4">
                    {customerDetails.address}
                  </p>
                  {customerDetails.landmark && (
                    <p className="text-[11px] leading-4">
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
                      maxLength={100}
                      onChange={(e) =>
                        updateEditField("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                      className={`w-full rounded-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f] ${
                        formErrors.name ? "border-red-500" : "border-[#e2bfb7]"
                      }`}
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
                    <div className="flex w-full">
  <div className="flex items-center rounded-l-lg border border-r-0 border-[#e2bfb7] bg-[#fff3ee] px-3 text-[11px] font-semibold text-[#5a413b]">
    +91
  </div>

  <input
    type="tel"
    inputMode="numeric"
    value={editDetails.phone.replace(/^\+91\s*/, "")}
    maxLength={10}
    onChange={(e) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      updateEditField("phone", digits ? `+91 ${digits}` : "");
    }}
    placeholder="98765 43210"
    disabled={isSubmitting}
    className={`w-full min-w-0 rounded-r-lg border px-3 py-2 text-[11px] outline-none focus:border-[#b32d0e] ${
      formErrors.phone ? "border-red-500" : "border-[#e2bfb7]"
    }`}
  />
</div>
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
                      maxLength={500}
                      onChange={(e) =>
                        updateEditField("address", e.target.value)
                      }
                      placeholder="Enter your complete delivery address"
                      disabled={isSubmitting}
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

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-[#5a413b]">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={editDetails.landmark}
                      maxLength={200}
                      onChange={(e) =>
                        updateEditField("landmark", e.target.value)
                      }
                      placeholder="Enter a nearby landmark"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-[#e2bfb7] px-3 py-2 text-[11px] outline-none focus:border-[#b32d0f]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-[#b32d0f] py-2 text-[11px] font-semibold text-white disabled:opacity-50"
                  >
                    Save Details
                  </button>

                  {customerDetails.name &&
                    customerDetails.phone &&
                    customerDetails.address && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-[#e2bfb7] py-2 text-[11px] font-semibold text-[#5a413b] disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              )}
            </section>

            <section className="mb-4 rounded-xl border border-[#e2bfb7]/40 bg-white p-3 shadow-sm">
              <h2 className="mb-3 font-['Playfair_Display'] text-[14px] font-bold text-[#5a413b]">
                SELECT PAYMENT METHOD
              </h2>

              {[
                { id: "upi", title: "UPI", description: "Google Pay, PhonePe, Paytm" },
                { id: "card", title: "Debit/Credit Card", description: "Visa, Mastercard, RuPay" },
                { id: "online", title: "Online Payment", description: "Simulated checkout only" },
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
                    <p className="text-[11px] font-bold">{method.title}</p>
                    <p className="mt-0.5 text-[9px] text-[#5a413b]">
                      {method.description}
                    </p>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      paymentMethod === method.id
                        ? "border-[#b32d0f] bg-[#b32d0f]"
                        : "border-[#e2bfb7]"
                    }`}
                  />
                </button>
              ))}
            </section>

            {checkoutError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] leading-5 text-red-700"
              >
                {checkoutError}
                <button
                  type="button"
                  onClick={() => setCheckoutError("")}
                  className="ml-2 font-bold underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="mb-4 rounded-lg bg-[#f7eee9] px-3 py-2">
              <p className="text-[9px] leading-4 text-[#5a413b]">
                This checkout is simulated. No real payment is collected.
              </p>
            </div>
          </>
        )}
      </main>

      {cartItems.length > 0 && (
        <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#e2bfb7]/30 bg-white px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          <div className="mx-auto w-full max-w-lg">
            <button
              type="button"
              onClick={handlePayNow}
              disabled={isSubmitting || isLoadingProfile || cartItems.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b32d0f] py-3 text-[12px] font-bold text-white shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Placing Order…"
                : `Place Order · ₹${formatPrice(grandTotal)}`}
              {!isSubmitting && <span className="text-base">→</span>}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default CustomerCheckoutForm;
