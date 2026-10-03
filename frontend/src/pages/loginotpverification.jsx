import Header from "../components/header";
import LoginOtpVerificationForm from "../components/loginotpverificationform";

function LoginOtpVerification() {
  return (
    <div className="min-h-screen bg-[#fff8f5]">
     <Header showMenu={false} />

      <main className="pt-16">
        <LoginOtpVerificationForm />
      </main>
    </div>
  );
}

export default LoginOtpVerification;