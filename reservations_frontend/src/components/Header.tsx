import { ProfileMenu } from "./ProfileMenu";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  return (
    <header className="bg-gray-900 text-white px-6 shadow-md flex items-center justify-between h-14">
      <h1 className="text-xl font-bold tracking-wide">
        🗓️ Reservation Manager
      </h1>
      <div className="flex gap-3">
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
            >
              Users
            </Link>
          </>
        )}
        <ProfileMenu />
      </div>
    </header>
  );
}
