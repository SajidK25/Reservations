import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../api/usersApi";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

interface RowUser {
  id: number;
  name: string;
  email: string;
  role_id?: number;
}

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<RowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") refresh();
  }, [user]);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await refresh();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  if (user?.role !== "admin") {
    return <div className="p-8">Not authorized.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 ">
      <Header />
      <div className="p-8 flex flex-col gap-2">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <table className="min-w-full p-3 bg-gray-800 rounded shadow text-white">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => onDelete(u.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
