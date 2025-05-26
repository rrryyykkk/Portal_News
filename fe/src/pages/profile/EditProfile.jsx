import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef } from "react";

const EditProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const bioRef = useRef();

  const handleDropProfile = useCallback((acceptedFiles) => {
    setProfileImg(acceptedFiles[0]);
  }, []);

  const handleDropBanner = useCallback((acceptedFiles) => {
    setBannerImg(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    onDrop: handleDropProfile,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
  } = useDropzone({
    onDrop: handleDropBanner,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = () => {
    const formData = {
      firstName,
      lastName,
      userName,
      email,
      oldPassword,
      newPassword,
      bio,
      profileImg,
      bannerImg,
    };
    console.log("Updated Profile:", formData);
    alert("Profil berhasil diperbarui!");
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="bg-slate-50 shadow-lg rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          Edit Profile
        </h1>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              First Name
            </label>
            <input
              className={inputStyle}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Last Name
            </label>
            <input
              className={inputStyle}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Username
            </label>
            <input
              className={inputStyle}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Email
            </label>
            <input
              className={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Old Password
            </label>
            <input
              type="password"
              className={inputStyle}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              New Password
            </label>
            <input
              type="password"
              className={inputStyle}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <label className="block mb-2 text-slate-700 font-medium">
            Bio / Explanation
          </label>
          <textarea
            ref={bioRef}
            className="w-full h-40 bg-white border border-slate-300 p-4 rounded-xl resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Profile Image
            </label>
            <div
              {...getProfileRootProps()}
              className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-50 transition"
            >
              <input {...getProfileInputProps()} />
              <p className="text-slate-500 text-sm">Click or drag image here</p>
              {profileImg && (
                <p className="mt-2 text-sm font-medium truncate">
                  📷 {profileImg.name}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Banner Image
            </label>
            <div
              {...getBannerRootProps()}
              className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-50 transition"
            >
              <input {...getBannerInputProps()} />
              <p className="text-slate-500 text-sm">
                Click or drag banner here
              </p>
              {bannerImg && (
                <p className="mt-2 text-sm font-medium truncate">
                  🖼️ {bannerImg.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditProfilePage;
