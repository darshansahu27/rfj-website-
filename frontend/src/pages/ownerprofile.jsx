import { useState } from "react";

import OwnerProfileHeader from "../components/ownerprofileheader";
import OwnerProfileHero from "../components/ownerprofilehero";
import OwnerInformationCard from "../components/ownerinformationcard";
import ManagerAccountCard from "../components/manageraccountcard";
import OwnerProfileModals from "../components/ownerprofilemodals";
import OwnerProfileFooter from "../components/ownerprofilefooter";

const initialProfile = {
  name: "Rohit Kumar",
  phone: "+91 98765 43210",
  email: "rohit.kumar@foodjunction.com",
};

const initialManager = {
  name: "Amit Khanna",
  email: "amit.manager@foodjunction.com",
};

const initialImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCAVHDUUjlKBUY5xATFOc_3rphKWQehZAIOFsgpCfrrmUk6tXUvw8IQzF7AP9F5JFXoFecjW0vF9J59dDFGc--y3oeEuynP9MmL8o0--KHAqUnCvDZMjmPx9Cx75Kg-s9wA_aEsSxK7j4vPBwrATkHYGX2dUuYZQbh9wfGoNioD4ebG-DbMcwW2XVWxlrlM8sjCwM_BkuQGwkJxmK1bfNBWiL2yA7wHO-quKg8Pmf8kTpY8jtiR870T";

function LogoutIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  );
}

function OwnerProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [manager, setManager] = useState(initialManager);
  const [profileImage, setProfileImage] = useState(initialImage);

  const [imageOpen, setImageOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const closeModal = (modal) => {
    if (modal === "image") setImageOpen(false);
    if (modal === "manager") setManagerOpen(false);
    if (modal === "logout") setLogoutOpen(false);
  };

  const handleLogout = () => {
    setLogoutOpen(false);

    // Connect this to your authentication logout function
    // when authentication is implemented.
    window.location.href = "/ownerlogin";
  };

  const handleEditName = () => {
    document.getElementById("owner-info-card")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    document.getElementById("edit-profile-btn")?.click();
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#2b211e]">
      <OwnerProfileHeader />

      <main className="mx-auto max-w-3xl space-y-4 px-5 pb-12 pt-20">
        {/* Owner Profile Header */}
        <OwnerProfileHero
          name={profile.name}
          image={profileImage}
          onEditImage={() => setImageOpen(true)}
          onEditName={handleEditName}
        />

        {/* Owner Information */}
        <div id="owner-info-card">
          <OwnerInformationCard
            profile={profile}
            onSave={setProfile}
          />
        </div>

        {/* Manager Account */}
        <ManagerAccountCard
          manager={manager}
          onEdit={() => setManagerOpen(true)}
        />

        {/* Logout */}
        <section className="pt-3">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2bfb7] py-3.5 font-jakarta text-[12px] font-bold text-[#8d1900] transition hover:bg-[#ffdad6]/30 active:scale-[0.98]"
          >
            <LogoutIcon />
            Logout
          </button>
        </section>
      </main>

      <OwnerProfileFooter />

      {/* All Popup Windows */}
      <OwnerProfileModals
        imageOpen={imageOpen}
        managerOpen={managerOpen}
        logoutOpen={logoutOpen}
        onClose={closeModal}
        manager={manager}
        onSaveManager={setManager}
        onSaveImage={setProfileImage}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default OwnerProfile;