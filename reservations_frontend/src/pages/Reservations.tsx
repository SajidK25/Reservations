import { useState } from "react";
import ReservationForm from "../components/ReservationForm";

export default function Reservations() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Book a Reservation</h2>

      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Open Reservation Form
      </button>

      {showForm && (
        <ReservationForm onClose={() => setShowForm(false)} selectedDate="" />
      )}
    </div>
  );
}
