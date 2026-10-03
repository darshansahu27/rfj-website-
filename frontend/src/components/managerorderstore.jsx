const ACTIVE_ORDERS_KEY = "rfj_active_orders";
const COMPLETED_ORDERS_KEY = "rfj_completed_orders";
const REJECTED_ORDERS_KEY = "rfj_rejected_orders";

const initialActiveOrders = [
  {
    orderId: "RFJ1028",
    customer: "Darshan Sahu",
    status: "Accepted",
    items: "Butter Chicken x2, Paneer Tikka x1",
    payment: "UPI @ 7:18 PM",
    total: "₹760",
  },
  {
    orderId: "RFJ1027",
    customer: "Amit Sharma",
    status: "Accepted",
    items: "Veg Biryani x1",
    payment: "Cash @ 7:05 PM",
    total: "₹310",
  },
  {
    orderId: "RFJ1026",
    customer: "Priya Singh",
    status: "Accepted",
    items: "Paneer Butter Masala x1, Garlic Naan x2",
    payment: "UPI @ 6:52 PM",
    total: "₹480",
  },
];

const initialCompletedOrders = [
  {
    orderId: "RFJ1019",
    customer: "Rahul Mehra",
    status: "Completed",
    items: "Chicken Biryani x2, Butter Naan x2",
    payment: "UPI @ 6:20 PM",
    total: "₹620",
  },
  {
    orderId: "RFJ1017",
    customer: "Neha Sharma",
    status: "Completed",
    items: "Paneer Tikka x1, Garlic Naan x2",
    payment: "Cash @ 5:45 PM",
    total: "₹480",
  },
  {
    orderId: "RFJ1014",
    customer: "Amit Verma",
    status: "Completed",
    items: "Dal Makhani x1, Naan x4",
    payment: "UPI @ 5:10 PM",
    total: "₹440",
  },
];

const initialRejectedOrders = [];

export function getActiveOrders() {
  const savedOrders = sessionStorage.getItem(ACTIVE_ORDERS_KEY);

  if (savedOrders) {
    return JSON.parse(savedOrders);
  }

  sessionStorage.setItem(
    ACTIVE_ORDERS_KEY,
    JSON.stringify(initialActiveOrders)
  );

  return initialActiveOrders;
}

export function getCompletedOrders() {
  const savedOrders = sessionStorage.getItem(COMPLETED_ORDERS_KEY);

  if (savedOrders) {
    return JSON.parse(savedOrders);
  }

  sessionStorage.setItem(
    COMPLETED_ORDERS_KEY,
    JSON.stringify(initialCompletedOrders)
  );

  return initialCompletedOrders;
}

export function getRejectedOrders() {
  const savedOrders = sessionStorage.getItem(REJECTED_ORDERS_KEY);

  if (savedOrders) {
    return JSON.parse(savedOrders);
  }

  sessionStorage.setItem(
    REJECTED_ORDERS_KEY,
    JSON.stringify(initialRejectedOrders)
  );

  return initialRejectedOrders;
}

export function saveActiveOrders(orders) {
  sessionStorage.setItem(
    ACTIVE_ORDERS_KEY,
    JSON.stringify(orders)
  );
}

export function saveCompletedOrders(orders) {
  sessionStorage.setItem(
    COMPLETED_ORDERS_KEY,
    JSON.stringify(orders)
  );
}

export function saveRejectedOrders(orders) {
  sessionStorage.setItem(
    REJECTED_ORDERS_KEY,
    JSON.stringify(orders)
  );
}