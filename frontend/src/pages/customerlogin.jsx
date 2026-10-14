import LoginForm from "../components/loginform";
import Header from "../components/header";
import Footer from "../components/footer";

function CustomerLogin() {
  return (
    <div className="min-h-screen bg-[#fff8f5]">
      <Header showMenu={false} />
      <main className="pt-16">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}

export default CustomerLogin;