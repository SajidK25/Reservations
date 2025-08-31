import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Reservation } from "../types/reservation";
import api from "../api/api";

export default function Reservations() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get("/reservations/all");
        setReservations(resp.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") fetchAll();
  }, [user]);

  if (user?.role !== "admin") {
    return <div className="min-h-screen p-8">Not authorized.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">All Reservations (Admin)</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-2">
        {reservations.map((r) => (
          <div key={r.id} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-600">
              {new Date(r.startDate).toLocaleString()} →{" "}
              {new Date(r.endDate).toLocaleString()}
            </div>
            <div className="text-sm">
              User ID: {r.userId} | Space: {r.spaceId}
            </div>
            {r.request && (
              <div className="text-sm italic">Request: {r.request}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
