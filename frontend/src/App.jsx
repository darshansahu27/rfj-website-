import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerLogin from "./pages/customerlogin";
import CustomerSignup from "./pages/customersignup";
import CustomerCartPage from "./pages/customercart";
import CustomerCheckout from "./pages/customercheckout";
import CustomerMenu from "./components/customermenu";
import PaymentConfirmed from "./pages/paymentconfirmed";
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
import OwnerDashboard from "./pages/ownerdashboard";
import OwnerOrders from "./pages/ownerorders";
import OwnerProfile from "./pages/ownerprofile";

import ManagerOrderProvider from "./components/managerordercontext";

function App() {
  return (
    <BrowserRouter>
      <ManagerOrderProvider>
        <Routes>
          {/* Customer pages */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/customerlogin" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="/customermenu" element={<CustomerMenu />} />
          <Route path="/customercart" element={<CustomerCartPage />} />
          <Route path="/checkoutpage" element={<CustomerCheckout />} />
          <Route path="/paymentconfirmed" element={<PaymentConfirmed />} />
          <Route path="/ordertracking" element={<OrderTracking />} />
          <Route path="/ordertracking/:id" element={<OrderTracking />} />
          <Route path="/profile" element={<CustomerProfile />} />

          {/* Manager pages */}
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

          {/* Owner pages */}
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