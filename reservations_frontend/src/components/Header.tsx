import { ProfileMenu } from "./ProfileMenu";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-2 shadow-md flex items-center justify-between h-14">
      <h1 className="text-xl font-bold tracking-wide">
        🗓️ Reservation Manager
      </h1>
      <div className="flex gap-3">
        <ProfileMenu />
      </div>
    </header>
  );
}
