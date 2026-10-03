import { createContext, useContext, useState } from "react";

const ManagerOrderContext = createContext(null);

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

function getStoredOrders(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
  }

  return fallback;
}

function saveOrders(key, orders) {
  try {
    localStorage.setItem(key, JSON.stringify(orders));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
  }
}

function ManagerOrderProvider({ children }) {
  const [activeOrders, setActiveOrders] = useState(() =>
    getStoredOrders(ACTIVE_ORDERS_KEY, initialActiveOrders)
  );

  const [completedOrders, setCompletedOrders] = useState(() =>
    getStoredOrders(COMPLETED_ORDERS_KEY, initialCompletedOrders)
  );

  const [rejectedOrders, setRejectedOrders] = useState(() =>
    getStoredOrders(REJECTED_ORDERS_KEY, [])
  );

  const rejectOrder = (orderId) => {
    setActiveOrders((currentOrders) => {
      const orderToReject = currentOrders.find(
        (order) => order.orderId === orderId
      );

      if (!orderToReject) {
        return currentOrders;
      }

      const updatedActiveOrders = currentOrders.filter(
        (order) => order.orderId !== orderId
      );

      const rejectedOrder = {
        ...orderToReject,
        status: "Rejected",
      };

      setRejectedOrders((currentRejectedOrders) => {
        const updatedRejectedOrders = [
          rejectedOrder,
          ...currentRejectedOrders.filter(
            (order) => order.orderId !== orderId
          ),
        ];

        saveOrders(REJECTED_ORDERS_KEY, updatedRejectedOrders);

        return updatedRejectedOrders;
      });

      saveOrders(ACTIVE_ORDERS_KEY, updatedActiveOrders);

      return updatedActiveOrders;
    });
  };

  const deliverOrder = (orderId) => {
    setActiveOrders((currentOrders) => {
      const orderToDeliver = currentOrders.find(
        (order) => order.orderId === orderId
      );

      if (!orderToDeliver) {
        return currentOrders;
      }

      const updatedActiveOrders = currentOrders.filter(
        (order) => order.orderId !== orderId
      );

      const deliveredOrder = {
        ...orderToDeliver,
        status: "Delivered",
      };

      setCompletedOrders((currentCompletedOrders) => {
        const updatedCompletedOrders = [
          deliveredOrder,
          ...currentCompletedOrders.filter(
            (order) => order.orderId !== orderId
          ),
        ];

        saveOrders(COMPLETED_ORDERS_KEY, updatedCompletedOrders);

        return updatedCompletedOrders;
      });

      saveOrders(ACTIVE_ORDERS_KEY, updatedActiveOrders);

      return updatedActiveOrders;
    });
  };

  return (
    <ManagerOrderContext.Provider
      value={{
        activeOrders,
        completedOrders,
        rejectedOrders,
        rejectOrder,
        deliverOrder,
      }}
    >
      {children}
    </ManagerOrderContext.Provider>
  );
}

export function useManagerOrders() {
  const context = useContext(ManagerOrderContext);

  if (!context) {
    throw new Error(
      "useManagerOrders must be used inside ManagerOrderProvider"
    );
  }

  return context;
}

export default ManagerOrderProvider;