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

function getCurrentDate() {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function OwnerDashboardGreeting() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const updateTime = () => {
      setGreeting(getGreeting());
      setCurrentDate(getCurrentDate());
    };

    // Check the device time every minute.
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-5 pt-3">
      <h2 className="font-playfair text-[20px] font-bold leading-7 text-[#2b211e]">
        {greeting}, Owner 👋
      </h2>

      <p className="mt-1 flex items-center gap-1 font-jakarta text-[10px] leading-4 text-[#8e706a]">
        <span aria-hidden="true">▣</span>
        {currentDate}
      </p>
    </section>
  );
}

export default OwnerDashboardGreeting;