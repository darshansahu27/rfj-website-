import { useRef, useState } from "react";

import CustomerProfileHeader from "../components/customerprofileheader";
import ProfileAvatar from "../components/profileavatar";
import PersonalInformation from "../components/personalinformation";
import ProfileActions from "../components/profileactions";
import ProfilePhotoSheet from "../components/profilephotosheet";
import LogoutDialog from "../components/logoutdialog";
import ProfileToast from "../components/profiletoast";

function CustomerProfile() {
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "Darshan Sahu",
    phone: "+91 9876543210",
    email: "darshan.sahu@example.com",
    address:
      "Flat 402, Heritage Heights, Near Central Park, Indiranagar, Bengaluru, 560038",
  });

  const [profileImage, setProfileImage] = useState("");

  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [profileToastOpen, setProfileToastOpen] = useState(false);

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

  const handleSave = () => {
    setEditing(false);

    setProfileToastOpen(true);

    setTimeout(() => {
      setProfileToastOpen(false);
    }, 3000);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);

    alert("Logout confirmed");
  };

  /*
   * Camera button on ProfileAvatar
   * opens the photo options sheet.
   */
  const handleCameraClick = () => {
    setPhotoSheetOpen(true);
  };

  const handleClosePhotoSheet = () => {
    setPhotoSheetOpen(false);
  };

  /*
   * Take Photo
   * Camera integration can be connected later.
   */
  const handleTakePhoto = () => {
    setPhotoSheetOpen(false);

    alert("Take Photo clicked");
  };

  /*
   * Choose from Gallery
   * The page owns the actual file input.
   */
  const handleChooseFromGallery = () => {
    setPhotoSheetOpen(false);

    fileInputRef.current?.click();
  };

  /*
   * Selected image comes back to the page.
   */
  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  /*
   * Remove current profile image.
   */
  const handleRemovePhoto = () => {
    setProfileImage("");
    setPhotoSheetOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#fff8f5] pb-8">
      {/* Component 1 */}
      <CustomerProfileHeader onBack={handleBack} />

      {/* Component 2 */}
      <ProfileAvatar
        name={formData.fullName}
        profileImage={profileImage}
        onNameChange={handleNameChange}
        onCameraClick={handleCameraClick}
      />

      {/* Component 3 */}
      <PersonalInformation
        formData={formData}
        editing={editing}
        onChange={handleFormChange}
      />

      {/* Component 4 */}
      <ProfileActions
        editing={editing}
        onSave={handleSave}
        onEdit={handleEdit}
        onLogout={handleLogout}
      />

      {/* Hidden file input controlled by the page */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="hidden"
      />

      {/* Component 5 */}
      <ProfilePhotoSheet
        open={photoSheetOpen}
        onClose={handleClosePhotoSheet}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
        onRemovePhoto={handleRemovePhoto}
      />

      {/* Component 6 */}
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        onConfirm={handleConfirmLogout}
      />

      {/* Component 7 */}
      <ProfileToast
        open={profileToastOpen}
        message="Profile updated successfully"
      />
    </main>
  );
}

export default CustomerProfile;