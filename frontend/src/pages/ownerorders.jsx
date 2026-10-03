import OwnerOrdersHeader from "../components/ownerordersheader";
import OwnerOrderCard from "../components/ownerordercard";

function OwnerOrders() {
  const orders = [
    {
      id: "#RFJ-8821",
      customer: "Rohit Sharma",
      items: [
        "1x Tandoori Chicken - Full Plate",
        "2x Butter Chicken",
      ],
      payment: "UPI Payment",
      time: "Today, 10:45 AM",
      amount: "₹1,420",
      status: "Preparing",
    },

    {
      id: "#RFJ-8820",
      customer: "Ananya Pandey",
      items: [
        "1x Paneer Tikka Masala",
        "4x Garlic Naan",
      ],
      payment: "Cash on Delivery",
      time: "Today, 10:12 AM",
      amount: "₹860",
      status: "Out for Delivery",
    },

    {
      id: "#RFJ-8819",
      customer: "Vikram Seth",
      items: [
        "2x Dal Makhani",
        "1x Jeera Rice",
      ],
      payment: "UPI Payment",
      time: "Today, 09:30 AM",
      amount: "₹540",
      status: "Delivered",
    },

    {
      id: "#RFJ-8818",
      customer: "Karan Johar",
      items: [
        "3x Mutton Biryani",
      ],
      payment: "Refund Initiated",
      time: "Today, 08:45 AM",
      amount: "₹1,850",
      status: "Cancelled",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fff8f5]">

      {/* Header */}
      <OwnerOrdersHeader />

      {/* Orders List */}
      <section className="space-y-4 px-4 py-5">

        {orders.map((order) => (
          <OwnerOrderCard
            key={order.id}
            order={order}
          />
        ))}

      </section>

    </main>
  );
}

export default OwnerOrders;