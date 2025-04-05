import { useEffect, useState } from "react";

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  guests: number;
}

export default function Home() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // For now, we'll mock some data (you can replace this with API call)
  useEffect(() => {
    const mockData: Reservation[] = [
      { id: 1, name: "John", date: "2025-04-10", time: "18:00", guests: 2 },
      { id: 2, name: "Anna", date: "2025-04-12", time: "20:00", guests: 4 },
      { id: 3, name: "Mike", date: "2025-03-20", time: "19:00", guests: 3 },
    ];
    setReservations(mockData);
  }, []);

  const total = reservations.length;
  const upcoming = reservations.filter(
    (res) => new Date(res.date) > new Date()
  ).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        📊 Reservation Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Total Reservations</h2>
          <p className="text-2xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Upcoming Reservations</h2>
          <p className="text-2xl font-bold text-green-600">{upcoming}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Reservations</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-left px-4 py-2">Guests</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{res.name}</td>
                <td className="px-4 py-2">{res.date}</td>
                <td className="px-4 py-2">{res.time}</td>
                <td className="px-4 py-2">{res.guests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
