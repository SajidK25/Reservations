import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ProfilePicture size="small" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform origin-top scale-95 animate-slide-down"
          style={{ animation: "slideDown 0.3s ease-out forwards" }}
        >
          <div className="flex">
            <div className="flex items-center justify-center flex-shrink-0 h-full p-4">
              <ProfilePicture size="large" />
            </div>

            <div className="flex flex-col justify-between p-4 text-white w-full">
              <div>
                <div className="text-lg font-semibold">Mark Smith</div>
                <div className="text-sm text-gray-400">Administrator</div>
                <div className="text-sm text-gray-400">mark@example.com</div>
              </div>

              <button
                onClick={logout}
                className="mt-2 text-sm text-red-400 hover:text-red-500 transition-colors text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
