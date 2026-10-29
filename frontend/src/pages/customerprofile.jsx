import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

import CustomerProfileHeader from "../components/customerprofileheader";
import ProfileAvatar from "../components/profileavatar";
import PersonalInformation from "../components/personalinformation";
import ProfileActions from "../components/profileactions";
import ProfilePhotoSheet from "../components/profilephotosheet";
import LogoutDialog from "../components/logoutdialog";
import ProfileToast from "../components/profiletoast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CustomerProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileToastOpen, setProfileToastOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const token = await user.getIdToken();

        const response = await fetch(`${API_URL}/api/profile/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load your profile."
          );
        }

        if (!active) return;

        const profile = result.profile || {};
        const address = profile.address || {};

        setFormData({
          fullName: profile.fullName || user.displayName || "",
          phone: profile.phone || "",
          email: user.email || profile.email || "",
          address: address.addressLine || "",
        });
      } catch (err) {
        console.error("Unable to load customer profile:", err);

        if (active) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigate]);

  const handleBack = () => {
    window.history.back();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleNameChange = (value) => {
    setFormData((previousData) => ({
      ...previousData,
      fullName: value,
    }));
  };

  const handleSave = async () => {
  setError("");

  const fullName = formData.fullName.trim();
  const phone = formData.phone.trim();
  const address = formData.address.trim();

  if (fullName.length < 2 || fullName.length > 100) {
    setError("Please enter a name between 2 and 100 characters.");
    return;
  }

  if (phone && phone.length > 20) {
    setError("Please enter a valid phone number.");
    return;
  }

  if (address && (address.length < 10 || address.length > 500)) {
    setError("Delivery address must contain 10–500 characters.");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    navigate("/login", { replace: true });
    return;
  }

  setSaving(true);

  try {
    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/api/profile/customer`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        phone,
        address,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to save your profile.");
    }


    setFormData((previousData) => ({
      ...previousData,
      fullName,
      phone,
      address,
    }));

    setEditing(false);
    setProfileToastOpen(true);
    setTimeout(() => setProfileToastOpen(false), 3000);
  } catch (err) {
    console.error("Profile save failed:", err);
    setError(err.message || "Unable to save your profile changes.");
  } finally {
    setSaving(false);
  }
};

  const handleEdit = () => {
    setEditing(true);
    setError("");
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setLogoutDialogOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Customer logout failed:", err);
      setLogoutDialogOpen(false);
      setError("Unable to log out. Please try again.");
    }
  };

  const handleCameraClick = () => {
    setPhotoSheetOpen(true);
  };

  const handleClosePhotoSheet = () => {
    setPhotoSheetOpen(false);
  };

  const handleTakePhoto = () => {
    setPhotoSheetOpen(false);
    alert("Camera integration can be connected later.");
  };

  const handleChooseFromGallery = () => {
    setPhotoSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setProfileImage((previousImage) => {
      if (previousImage) URL.revokeObjectURL(previousImage);
      return URL.createObjectURL(file);
    });
  };

  const handleRemovePhoto = () => {
    setProfileImage((previousImage) => {
      if (previousImage) URL.revokeObjectURL(previousImage);
      return "";
    });
    setPhotoSheetOpen(false);
  };

  useEffect(() => {
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, [profileImage]);

  return (
    <main className="min-h-screen bg-[#fff8f5] pb-8">
      <CustomerProfileHeader onBack={handleBack} />

      {loading ? (
        <p className="px-5 py-10 text-center text-sm text-[#5a413b]">
          Loading your profile...
        </p>
      ) : (
        <>
          <ProfileAvatar
            name={formData.fullName}
            profileImage={profileImage}
            onNameChange={handleNameChange}
            onCameraClick={handleCameraClick}
          />

          <PersonalInformation
            formData={formData}
            editing={editing}
            onChange={handleFormChange}
          />

          {error && (
            <p role="alert" className="mx-5 mt-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <ProfileActions
            editing={editing}
            onSave={handleSave}
            onEdit={handleEdit}
            onLogout={handleLogout}
          />
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="hidden"
      />

      <ProfilePhotoSheet
        open={photoSheetOpen}
        onClose={handleClosePhotoSheet}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
        onRemovePhoto={handleRemovePhoto}
      />

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        onConfirm={handleConfirmLogout}
      />

      <ProfileToast
        open={profileToastOpen}
        message="Profile updated successfully"
      />
    </main>
  );
}

export default CustomerProfile;