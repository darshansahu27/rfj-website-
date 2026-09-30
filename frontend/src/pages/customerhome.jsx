import Header from "../components/header";
import Hero from "../components/hero";
import PopularDishes from "../components/populardishes";
import WhyChooseUs from "../components/whychooseus";
import Footer from "../components/footer";

function CustomerHome() {
  return (
    <div className="min-h-screen bg-[#fff8f5]">
      <Header />
      <main>
        <Hero />
        <PopularDishes />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}

export default CustomerHome;