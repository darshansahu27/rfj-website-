import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerSignup from "./pages/customersignup";
import OtpVerification from "./pages/otpverification";
import OrderTracking from "./pages/ordertracking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/ordertracking" element={<OrderTracking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;