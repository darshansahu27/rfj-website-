import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import ManagerDashboardHeader from "../components/managerdashboardheader";
import ManagerDashboardGreeting from "../components/managerdashboardgreeting";
import ManagerOrderSummary from "../components/managerordersummary";
import ManagerQuickActions from "../components/managerquickactions";
import ManagerRecentOrders from "../components/managerrecentorders";
import ManagerDashboardDrawer from "../components/managerdashboarddrawer";

function ManagerDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/managerlogin", { replace: true });
    } catch (error) {
      console.error("Manager sign-out failed:", error);
      window.alert("Unable to sign out. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerDashboardHeader
        onProfileClick={() => setDrawerOpen(true)}
      />

      <ManagerDashboardGreeting />

      <ManagerOrderSummary />

      <ManagerQuickActions />

      <ManagerRecentOrders />

      <ManagerDashboardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onDashboardClick={() => setDrawerOpen(false)}
        onMenuClick={() => {
          setDrawerOpen(false);
          navigate("/managermenu");
        }}
        onOrdersClick={() => {
          setDrawerOpen(false);
          navigate("/managerorders");
        }}
        onLogoutClick={handleLogout}
        managerName={auth.currentUser?.displayName || "Manager"}
        role="Manager"
        profileImage={auth.currentUser?.photoURL || ""}
      />
    </main>
  );
}

export default ManagerDashboard;