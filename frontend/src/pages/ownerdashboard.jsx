import OwnerDashboardHeader from "../components/ownerdashboardheader";
import OwnerDashboardGreeting from "../components/ownerdashboardgreeting";
import OwnerDashboardNotification from "../components/ownerdashboardnotification";
import OwnerDashboardOrdersSummary from "../components/ownerDashboardOrdersSummary";
import OwnerDashboardMenuOverview from "../components/ownerdashboardmenuoverview";
import OwnerDashboardQuickActions from "../components/ownerdashboardquickactions";

function OwnerDashboard() {
  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <OwnerDashboardHeader
        onMenuClick={() => {}}
        onProfileClick={() => {}}
      />

      <OwnerDashboardGreeting />

      <OwnerDashboardNotification />

      <OwnerDashboardOrdersSummary />


      <OwnerDashboardQuickActions />

      <OwnerDashboardMenuOverview />
    </main>
  );
}

export default OwnerDashboard;