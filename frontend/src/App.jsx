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

        {/* Owner routes */}
        <Route path="/ownerlogin" element={<OwnerLogin />} />

        <Route
          path="/ownerdashboard"
          element={
            <ProtectedRoute
              allowedRole="owner"
              loginPath="/ownerlogin"
              authType="owner"
            >
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ownerorders"
          element={
            <ProtectedRoute
              allowedRole="owner"
              loginPath="/ownerlogin"
              authType="owner"
            >
              <OwnerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ownerprofile"
          element={
            <ProtectedRoute
              allowedRole="owner"
              loginPath="/ownerlogin"
              authType="owner"
            >
              <OwnerProfile />
            </ProtectedRoute>
          }
        />

        {/* Manager login */}
        <Route path="/managerlogin" element={<ManagerLogin />} />

        {/* Manager dashboard */}
        <Route
          path="/managerdashboard"
          element={
            <ProtectedRoute
              allowedRole="manager"
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerOrderProvider>
                <ManagerDashboard />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        {/* Manager menu */}
        <Route
          path="/managermenu"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerMenu />
            </ProtectedRoute>
          }
        />

        {/* All manager orders */}
        <Route
          path="/managerorders"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerOrderProvider>
                <ManagerOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        {/* Active manager orders */}
        <Route
          path="/manageractiveorders"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerOrderProvider>
                <ManagerActiveOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        {/* Completed manager orders */}
        <Route
          path="/managercompletedorders"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerOrderProvider>
                <ManagerCompletedOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        {/* Rejected manager orders */}
        <Route
          path="/managerrejectedorders"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
            >
              <ManagerOrderProvider>
                <ManagerRejectedOrders />
              </ManagerOrderProvider>
            </ProtectedRoute>
          }
        />

        {/* Individual order details */}
        <Route
          path="/managerorders/:id"
          element={
            <ProtectedRoute
              allowedRole={["owner", "manager"]}
              loginPath="/managerlogin"
              authType="manager"
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