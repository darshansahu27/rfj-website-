import ManagerLoginHeader from "../components/managerloginheader";
import ManagerLoginForm from "../components/managerloginform";
import ManagerLoginFooter from "../components/managerloginfooter";

function ManagerLogin() {
  return (
    <main className="min-h-screen bg-[#fff8f5] font-jakarta text-[#1e1b18]">
      <ManagerLoginHeader />

      <section className="flex min-h-[calc(100vh-137px)] items-center justify-center px-5 py-8">
        <ManagerLoginForm />
      </section>

      <ManagerLoginFooter />
    </main>
  );
}

export default ManagerLogin;