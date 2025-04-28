import { useState } from "react";
import TimePicker from "./TimePicker";
import { createReservation } from "../api/reservationsApi";

interface ReservationFormProps {
  onClose: () => void;
  selectedDate: string;
}

const availableTimes = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export default function ReservationForm({
  onClose,
  selectedDate,
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: selectedDate,
    startTime: "",
    endTime: "",
    guests: 1,
    place: "",
    requests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending reservation...", formData);
      await createReservation(formData);
      alert("Reservation submitted!");
      onClose();
    } catch (error: any) {
      console.error("Reservation failed:", error);
      alert("Failed to submit reservation. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-6">
      <div className="relative bg-[#111827] text-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[250px_1fr]">
        <div className="flex flex-col-reverse gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {/* Time Picker */}
          <div className="p-4 border-r border-gray-800 h-full flex flex-col">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              Select start time
            </p>
            <div className="flex flex-col-reverse gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 h-full pr-1">
              <TimePicker
                times={availableTimes}
                startTime={formData.startTime}
                endTime={formData.endTime}
                onChange={(start, end) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: start,
                    endTime: end,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="relative p-6 sm:p-10 flex flex-col h-full">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 flex-grow overflow-y-auto pr-1 pt-10"
          >
            {/* Grid Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Place Selector */}
              <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Select Table / Place
                </label>
                <select
                  name="place"
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a place...</option>
                  <option value="window">Window Table</option>
                  <option value="center">Center Table</option>
                  <option value="patio">Patio</option>
                  <option value="vip">VIP Room</option>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="p-1">
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Special Requests
              </label>
              <textarea
                name="requests"
                value={formData.requests}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition duration-150 font-semibold"
              >
                Submit Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
