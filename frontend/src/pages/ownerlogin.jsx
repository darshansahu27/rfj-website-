import ManagerLoginHeader from "../components/managerloginheader";
import OwnerLoginForm from "../components/ownerloginform";
import OwnerLoginFooter from "../components/ownerloginfooter";

function OwnerLogin() {
  return (
    <main className="min-h-screen bg-[#fff8f5]">
      <ManagerLoginHeader />

      <section className="flex flex-col items-center px-5 pb-10 pt-12 text-center">
        <h2 className="font-playfair text-[32px] font-bold leading-9 text-[#2b211e]">
          Welcome Back,
          <br />
          Owner
        </h2>

        <p className="mt-3 w-full max-w-[380px] text-center font-jakarta text-[14px] leading-5 text-[#8e706a]">
          Securely sign in to manage your restaurant operations, staff,
          menu, and business insights.
        </p>

        <div className="mt-7 w-full max-w-[430px] text-left">
          <OwnerLoginForm />
        </div>
      </section>

      <OwnerLoginFooter />
    </main>
  );
}

export default OwnerLogin;