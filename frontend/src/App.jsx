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
import ManagerLogin from "./pages/managerlogin";
import ManagerDashboard from "./pages/managerdashboard";
import ProtectedRoute from "./components/protectedroutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />

        <Route path="/signup" element={<CustomerSignup />} />

        
        <Route path="/login" element={<CustomerLogin />} />

        
        <Route
          path="/menu"
          element={<CustomerMenuPage />}
        />

        <Route
          path="/customercart"
          element={<CustomerCartPage />}
        />

        <Route
          path="/checkoutpage"
          element={<CustomerCheckout />}
        />

        <Route
          path="/paymentconfirmed"
          element={<PaymentConfirmed />}
        />

        <Route
          path="/paymentfailed"
          element={<PaymentFailed />}
        />

        <Route
          path="/ordercancelled"
          element={<OrderCancelled />}
        />
        <Route path="/ownerlogin" element={<OwnerLogin />} />
        <Route path="/managerlogin" element={<ManagerLogin />} />
<Route
  path="/ownerdashboard"
  element={
    <ProtectedRoute allowedRole="owner" loginPath="/ownerlogin">
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/managerdashboard"
  element={
    <ProtectedRoute allowedRole="manager" loginPath="/managerlogin">
      <ManagerDashboard />
    </ProtectedRoute>
  }
/>
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;