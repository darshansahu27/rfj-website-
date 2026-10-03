import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerSignup from "./pages/customersignup";
import CustomerLogin from "./pages/customerlogin";
import OTPVerification from "./pages/otpverification";
import LoginOTPVerification from "./pages/loginotpverification";
import CustomerMenuPage from "./pages/customermenu";
import CustomerCartPage from "./pages/customercart";
import CustomerCheckout from "./pages/customercheckout";
import PaymentConfirmed from "./pages/paymentconfirmed";
import PaymentFailed from "./pages/paymentfailed";
import OrderCancelled from "./pages/ordercancelled";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />

        <Route path="/signup" element={<CustomerSignup />} />

        <Route
          path="/otpverification"
          element={<OTPVerification />}
        />

        <Route path="/login" element={<CustomerLogin />} />

        <Route
          path="/loginotpverification"
          element={<LoginOTPVerification />}
        />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;