import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

import OwnerProfileHeader from "../components/ownerprofileheader";
import OwnerProfileHero from "../components/ownerprofilehero";
import OwnerInformationCard from "../components/ownerinformationcard";
import ManagerAccountCard from "../components/manageraccountcard";
import OwnerProfileModals from "../components/ownerprofilemodals";
import OwnerProfileFooter from "../components/ownerprofilefooter";

const initialProfile = {
  name: "",
  phone: "",
  email: "",
};

const initialManager = {
  name: "",
  email: "",
};

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
  const navigate = useNavigate();

  const [profile, setProfile] = useState(initialProfile);
  const [manager, setManager] = useState(initialManager);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingManager, setSavingManager] = useState(false);

  const [imageOpen, setImageOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getProfile = useCallback(
    async (user) => {
      const token = await user.getIdToken();

      const response = await fetch(`${apiUrl}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load your profile."
        );
      }

      if (result.profile?.role !== "owner") {
        throw new Error(
          "This account is not authorized for the owner portal."
        );
      }

      setProfile({
        name: result.profile.fullName || user.displayName || "",
        phone: result.profile.phone || "",
        email: result.profile.email || user.email || "",
      });

      setProfileImage(result.profile.avatarUrl || "");

      // Load the real manager details from the backend.
      const managerResponse = await fetch(
        `${apiUrl}/api/profile/owner/manager`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const managerResult = await managerResponse.json();

      if (!managerResponse.ok || !managerResult.success) {
        throw new Error(
          managerResult.message || "Unable to load manager details."
        );
      }

      setManager({
        name: managerResult.manager?.name || "",
        email: managerResult.manager?.email || "",
      });
    },
    [apiUrl]
  );

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        navigate("/ownerlogin", { replace: true });
        return;
      }

      setLoading(true);
      setProfileError("");

      try {
        await getProfile(user);
      } catch (error) {
        if (active) {
          setProfileError(
            error.message || "Unable to load your profile."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [getProfile, navigate]);

  const closeModal = (modal) => {
    if (modal === "image") setImageOpen(false);
    if (modal === "manager") setManagerOpen(false);
    if (modal === "logout") setLogoutOpen(false);
  };

  const handleSaveProfile = async (updatedProfile) => {
    const user = auth.currentUser;

    if (!user) {
      setProfileError("Please log in again to update your profile.");
      throw new Error("Please log in again to update your profile.");
    }

    setSavingProfile(true);
    setProfileError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch(`${apiUrl}/api/profile/owner`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: updatedProfile.name,
          phone: updatedProfile.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to save profile changes."
        );
      }

      setProfile((current) => ({
        ...current,
        name: result.profile?.fullName ?? updatedProfile.name,
        phone: result.profile?.phone ?? updatedProfile.phone,
      }));
    } catch (error) {
      setProfileError(
        error.message || "Unable to save profile changes."
      );
      throw error;
    } finally {
      setSavingProfile(false);
    }
  };

  // Save changes to the existing manager's Firebase account.
  const handleSaveManager = async (updatedManager) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Please log in again to update manager credentials.");
    }

    setSavingManager(true);
    setProfileError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `${apiUrl}/api/profile/owner/manager`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedManager.name,
            email: updatedManager.email,
            password: updatedManager.password || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update manager credentials."
        );
      }

      setManager({
        name: result.manager?.name || updatedManager.name,
        email: result.manager?.email || updatedManager.email,
      });

      // Do not close the modal here. The modal should close only
      // after its own save handler receives a successful response.
      return result.manager;
    } catch (error) {
      setProfileError(
        error.message || "Unable to update manager credentials."
      );
      throw error;
    } finally {
      setSavingManager(false);
    }
  };

  const handleLogout = async () => {
    setLogoutOpen(false);

    try {
      await signOut(auth);
      navigate("/ownerlogin", { replace: true });
    } catch (error) {
      console.error("Owner logout failed:", error);
      setProfileError("Unable to log out. Please try again.");
    }
  };

  const handleEditName = () => {
    document.getElementById("owner-info-card")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    document.getElementById("edit-profile-btn")?.click();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f5]">
        <p className="font-jakarta text-sm text-[#8d1900]">
          Loading owner profile...
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#2b211e]">
      <OwnerProfileHeader />

      <main className="mx-auto max-w-3xl space-y-4 px-5 pb-12 pt-20">
        {profileError && (
          <p
            role="alert"
            className="rounded-lg bg-[#fff0ec] px-4 py-3 text-sm text-red-700"
          >
            {profileError}
          </p>
        )}

        {savingProfile && (
          <p role="status" className="text-sm text-[#8d1900]">
            Saving profile changes...
          </p>
        )}

        {savingManager && (
          <p role="status" className="text-sm text-[#8d1900]">
            Updating manager credentials...
          </p>
        )}

        <OwnerProfileHero
          name={profile.name || "Owner"}
          image={profileImage}
          onEditImage={() => setImageOpen(true)}
          onEditName={handleEditName}
        />

        <div id="owner-info-card">
          <OwnerInformationCard
            profile={profile}
            onSave={handleSaveProfile}
          />
        </div>

        <ManagerAccountCard
          manager={manager}
          onEdit={() => setManagerOpen(true)}
        />

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

      <OwnerProfileModals
        imageOpen={imageOpen}
        managerOpen={managerOpen}
        logoutOpen={logoutOpen}
        onClose={closeModal}
        manager={manager}
        onSaveManager={handleSaveManager}
        onSaveImage={setProfileImage}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default OwnerProfile;