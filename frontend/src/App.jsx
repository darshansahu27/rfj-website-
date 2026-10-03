import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerSignup from "./pages/customersignup";
import OtpVerification from "./pages/otpverification";
import OrderTracking from "./pages/ordertracking";
import CustomerProfile from "./pages/customerprofile";

import ManagerLogin from "./pages/managerlogin";
import ManagerDashboard from "./pages/managerdashboard";
import ManagerCompletedOrders from "./pages/managercompletedorders";
import ManagerActiveOrders from "./pages/manageractiveorders";
import ManagerRejectedOrders from "./pages/managerrejectedorders";
import ManagerOrders from "./pages/managerorders";
import ManagerMenu from "./pages/managermenu";
import OwnerLogin from "./pages/ownerlogin";
import ManagerOrderProvider from "./components/managerordercontext";
import OwnerDashboard from "./pages/ownerdashboard";
import OwnerOrders from "./pages/ownerorders";
import OwnerProfile from "./pages/ownerprofile";

function App() {
  return (
    <BrowserRouter>
      <ManagerOrderProvider>
        <Routes>
          {/* Customer Pages */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/otpverification" element={<OtpVerification />} />
          <Route path="/ordertracking" element={<OrderTracking />} />
          <Route path="/profile" element={<CustomerProfile />} />

          {/* Manager Pages */}
          <Route path="/managerlogin" element={<ManagerLogin />} />
          <Route path="/managerdashboard" element={<ManagerDashboard />} />
          <Route
            path="/managercompletedorders"
            element={<ManagerCompletedOrders />}
          />
          <Route
            path="/manageractiveorders"
            element={<ManagerActiveOrders />}
          />
          <Route
            path="/managerrejectedorders"
            element={<ManagerRejectedOrders />}
          />
          <Route path="/managerorders" element={<ManagerOrders />} />

          <Route path="/managermenu" element={<ManagerMenu />} />

          <Route path="/ownerlogin" element={<OwnerLogin />} />

          <Route path="/ownerdashboard" element={<OwnerDashboard />} />

          <Route path="/ownerorders" element={<OwnerOrders />} />

          <Route path="/ownerprofile" element={<OwnerProfile />} />

          

        </Routes>
      </ManagerOrderProvider>
    </BrowserRouter>
  );
}

export default App;