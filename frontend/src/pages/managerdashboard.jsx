
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
import { useManagerOrders } from "../components/managerordercontext";

function ManagerDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { notification, dismissNotification } = useManagerOrders();

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
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-100 flex max-w-sm items-start gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-lg"
        >
          <span className="text-xl" aria-hidden="true">🔔</span>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              New order received!
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {notification.message}
            </p>
          </div>

          <button
            type="button"
            onClick={dismissNotification}
            aria-label="Dismiss notification"
            className="rounded px-2 text-lg text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>
      )}

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
