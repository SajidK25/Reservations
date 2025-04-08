// components/Header.tsx
interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">
        🗓️ Reservation Manager
      </h1>
      <div className="flex gap-3">
 
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
