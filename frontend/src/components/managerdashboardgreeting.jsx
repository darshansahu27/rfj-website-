import { useEffect, useState } from "react";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function ManagerDashboardGreeting() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 pt-5">
      <h1 className="font-playfair text-[20px] font-bold leading-7 text-[#2b211e]">
        {greeting}, Manager 👋
      </h1>

      <p className="mt-0.5 font-jakarta text-[12px] leading-5 text-[#6b6b6b]">
        Here's today's restaurant overview.
      </p>
    </section>
  );
}

export default ManagerDashboardGreeting;