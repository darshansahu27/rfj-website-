import React from "react";
function CameraIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-1.5-3Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1-1 4Z" />
    </svg>
  );
}

function ProfileAvatar({
  name = "Darshan Sahu",
  profileImage = "",
  onNameChange,
  onCameraClick,
}) {
  const [editingName, setEditingName] = React.useState(false);
  const [profileName, setProfileName] = React.useState(name);

  const handleNameChange = (event) => {
    const value = event.target.value;

    const filteredValue = value.replace(/[^A-Za-z\s]/g, "");

    setProfileName(filteredValue);

    if (onNameChange) {
      onNameChange(filteredValue);
    }
  };

  const handleNameEdit = () => {
    setEditingName(true);
  };

  const handleNameBlur = () => {
    setEditingName(false);
  };

  return (
    <section className="flex flex-col items-center px-5 pb-6 pt-20">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[#eadfce] bg-[#f4eee8] shadow-md">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${profileName} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-playfair text-3xl font-bold text-[#8d1900]">
              {profileName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onCameraClick}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#8d1900] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          aria-label="Change profile picture"
        >
          <CameraIcon />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1">
        {editingName ? (
          <input
            type="text"
            value={profileName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            autoFocus
            className="w-40 border-b border-[#8d1900] bg-transparent text-center font-playfair text-base font-semibold text-[#5a413b] outline-none"
            aria-label="Edit profile name"
          />
        ) : (
          <>
            <span className="font-playfair text-base font-semibold text-[#5a413b]">
              {profileName}
            </span>

            <button
              type="button"
              onClick={handleNameEdit}
              className="rounded-full p-1 text-[#8d1900] transition-opacity hover:opacity-70"
              aria-label="Edit profile name"
            >
              <EditIcon />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default ProfileAvatar;