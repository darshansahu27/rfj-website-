import { useState } from "react";

import ManagerDashboardHeader from "../components/managerdashboardheader";
import ManagerDashboardDrawer from "../components/managerdashboarddrawer";
import ManagerDashboardGreeting from "../components/managerdashboardgreeting";
import ManagerOrderSummary from "../components/managerordersummary";
import ManagerQuickActions from "../components/managerquickactions";
import ManagerRecentOrders from "../components/managerrecentorders";

function ManagerDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerDashboardHeader
        onMenuClick={() => setDrawerOpen(true)}
      />

      <ManagerDashboardGreeting />

      <ManagerOrderSummary />

      <ManagerQuickActions />

      <ManagerRecentOrders />

      <ManagerDashboardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onDashboardClick={() => setDrawerOpen(false)}
        onMenuClick={() => console.log("Manage Menu")}
        onOrdersClick={() => console.log("Order Management")}
        onLogoutClick={() => console.log("Logout")}
      />

      
    </main>
  );
}

export default ManagerDashboard;