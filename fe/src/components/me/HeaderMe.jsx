import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeaderMe = ({ user, activeTab, onTabChange }) => {
  console.log("user-headersMe:", user);
  const isAdmin = user.role === "admin";

  const tabs = isAdmin
    ? [
        { key: "marked", label: "Marked" },
        { key: "send", label: "Send Post" },
        { key: "post", label: "Post" },
      ]
    : [{ key: "marked", label: "Marked" }];

  return (
    <header className="w-full bg-white shadow-lg rounded-2xl overflow-hidden mb-6">
      {/* Banner */}
      <div className="relative w-full h-36 md:h-48">
        <img
          src="/header/1.png"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-10 left-4 md:left-8 w-20 md:w-24 h-20 md:h-24 rounded-full border-4 border-white shadow-md overflow-hidden">
          <img
            src={user.profileImage || "/avatar/01.jpg"}
            alt={`${user.fullName} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-4 md:px-8 pb-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
        {/* Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{user.fullName}</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">{user.bio}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center md:justify-center flex-wrap gap-4">
          {tabs.map(({ key, label }) => (
            <div
              key={key}
              className={`cursor-pointer flex flex-col items-center transition-colors ${
                activeTab === key
                  ? "text-[var(--primary-color)] font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => onTabChange(key)}
            >
              <span className="text-sm md:text-base">{label}</span>
              {activeTab === key && (
                <div className="w-4 md:w-6 h-1 bg-[var(--primary-color)] mt-1 rounded" />
              )}
            </div>
          ))}
        </div>

        {/* Edit Button */}
        <div className="flex justify-center md:justify-end">
          <Link
            to="/profile/me/edit"
            className="transition-all bg-white hover:bg-gray-200 text-[var(--primary-color)] px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-md flex items-center text-sm md:text-base"
          >
            <FaUserEdit className="w-4 h-4 mr-2" />
            Edit Profil
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderMe;
