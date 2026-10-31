import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerSignup from "./pages/customersignup";
import CustomerLogin from "./pages/customerlogin";
import CustomerMenuPage from "./pages/customermenu";
import CustomerCartPage from "./pages/customercart";
import CustomerCheckout from "./pages/customercheckout";
import PaymentConfirmed from "./pages/paymentconfirmed";
import PaymentFailed from "./pages/paymentfailed";
import OrderCancelled from "./pages/ordercancelled";
import OrderTracking from "./pages/ordertracking";

import OwnerLogin from "./pages/ownerlogin";
import OwnerDashboard from "./pages/ownerdashboard";
import OwnerOrders from "./pages/ownerorders";
import OwnerProfile from "./pages/ownerprofile";

import ManagerLogin from "./pages/managerlogin";
import ManagerDashboard from "./pages/managerdashboard";
import ManagerMenu from "./pages/managermenu";
import ManagerOrders from "./pages/managerorders";
import ManagerActiveOrders from "./pages/manageractiveorders";
import ManagerCompletedOrders from "./pages/managercompletedorders";
import ManagerRejectedOrders from "./pages/managerrejectedorders";
import ManagerOrderDetails from "./pages/managerorderdetails";

import CustomerProfile from "./pages/customerprofile";
import ProtectedRoute from "./components/protectedroutes";
import ManagerOrderProvider from "./components/managerordercontext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/menu" element={<CustomerMenuPage />} />
        <Route path="/customercart" element={<CustomerCartPage />} />
        <Route path="/checkoutpage" element={<CustomerCheckout />} />
        <Route path="/paymentconfirmed" element={<PaymentConfirmed />} />
        <Route path="/paymentfailed" element={<PaymentFailed />} />
        <Route path="/ordercancelled" element={<OrderCancelled />} />
        <Route path="/ordertracking/:id" element={<OrderTracking />} />

        {/* Owner routes */}
        <Route path="/ownerlogin" element={<OwnerLogin />} />

        <Route
          path="/ownerdashboard"
          element={
            <ProtectedRoute allowedRole="owner" loginPath="/ownerlogin">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ownerorders"
          element={
            <ProtectedRoute allowedRole="owner" loginPath="/ownerlogin">
              <OwnerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ownerprofile"
          element={
            <ProtectedRoute allowedRole="owner" loginPath="/ownerlogin">
              <OwnerProfile />
            </ProtectedRoute>
          }
        />

        {/* Manager routes */}
        <Route path="/managerlogin" element={<ManagerLogin />} />

        <Route
          path="/managerdashboard"
          element={
            <ProtectedRoute
              allowedRole={["manager", "owner"]}
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerDashboard />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managermenu"
          element={
            <ProtectedRoute
              allowedRole={["manager", "owner"]}
              loginPath="/managerlogin"
            >
              <ManagerMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/managerorders"
          element={
            <ProtectedRoute
              allowedRole="manager"
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manageractiveorders"
          element={
            <ProtectedRoute
              allowedRole={["manager", "owner"]}
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerActiveOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managercompletedorders"
          element={
            <ProtectedRoute
              allowedRole="manager"
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerCompletedOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managerrejectedorders"
          element={
            <ProtectedRoute
              allowedRole="manager"
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerRejectedOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managerorders/:id"
          element={
            <ProtectedRoute
              allowedRole="manager"
              loginPath="/managerlogin"
            >
              <ManagerOrderProvider>
                <ManagerOrderDetails />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;