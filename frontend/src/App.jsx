import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customerhome";
import CustomerSignup from "./pages/customersignup";
import OtpVerification from "./pages/otpverification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/otpverification" element={<OtpVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;