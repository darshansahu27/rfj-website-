import OrderProgress from "../components/orderprogress";
import CurrentStatus from "../components/currentstatus";
import OrderDetails from "../components/orderdetails";
import DeliveryAddress from "../components/deliveryaddress";
import OrderItems from "../components/orderitems";
import PaymentSummary from "../components/paymentsummary";
import HelpSupport from "../components/helpsupport";
import TrackingHeader from "../components/trackingheader";

function OrderTracking() {
  return (
    <main className="min-h-screen bg-[#fff8f5] px-4 py-6">
      <div className="mx-auto w-full max-w-md">
        
        <TrackingHeader />
        
        <OrderProgress />

        <CurrentStatus />

        <DeliveryAddress />

        <OrderDetails />

        <OrderItems />

        <PaymentSummary />

        <HelpSupport />

      </div>
    </main>
  );
}

export default OrderTracking;