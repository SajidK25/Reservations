import { useEffect, useState } from "react";
import TimePicker from "./TimePicker";
import { useAuthStore } from "../store/authStore";
import { useReservationStore} from "../store/reservationStore";
import { Reservation } from "../types/reservation";

interface ReservationFormProps {
  onClose: () => void;
  selectedDate: string;
  reservation?: Reservation;
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
  reservation,
 
}: ReservationFormProps) {
  const {
    addReservation,
    updateReservation,
    getAllReservations,
    getSpaceOptions,
    spaceOptions
  } = useReservationStore();

  const [formData, setFormData] = useState({
    title: reservation?.title || "",
    startTime: reservation
      ? new Date(reservation.startDate).toISOString().substring(11, 16)
      : "",
    endTime: reservation
      ? new Date(reservation.endDate).toISOString().substring(11, 16)
      : "",
    request: reservation?.request || "",
    date: reservation
      ? new Date(reservation.startDate).toISOString().substring(0, 10)
      : selectedDate,
    spaceId: reservation?.spaceId ? String(reservation.spaceId) : "",
  });

  const { user } = useAuthStore();
  useEffect(() => {
    const fetchSpaces = async () => {
      await getSpaceOptions();
    };
    fetchSpaces();
  }, [getSpaceOptions]);
  

  const [errors, setErrors] = useState<{ time?: string }>({});

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

    if (!formData.startTime || !formData.endTime) {
      setErrors({ time: "Vrijeme početka i završetka je obavezno." });
      return;
    }

    setErrors({});
    const userId = user ? user.id : 1;

    const baseData = {
      ...formData,
      startDate: new Date(
        `${selectedDate}T${formData.startTime}`
      ).toISOString(),
      endDate: new Date(`${selectedDate}T${formData.endTime}`).toISOString(),
      userId,
      spaceId:2,
    };

    try {
      if (reservation) {
        await updateReservation({ ...baseData, id: reservation.id });
        alert("Reservation updated!");
      } else {
        await addReservation(baseData);
        alert("Reservation created!");
      }
      await getAllReservations();
      onClose();
    } catch (error: any) {
      alert("Neuspješno slanje rezervacije. Pokušajte ponovno.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-6">
      <div className="relative bg-[#111827] text-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[250px_1fr]">
        <div className="flex flex-col-reverse gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
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
                  setFormData({ ...formData, startTime: start, endTime: end })
                }
                error={errors.time}
              />

              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
              )}
            </div>
          </div>
        </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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

              <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Select place
                </label>
                <select
                  name="spaceId"
                  value={formData.spaceId}
                  onChange={handleChange}
                  required
                  className=" bg-gray-800 border border-gray-700 rounded-lg px-4 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(spaceOptions).map(([id, name]) => (
                    <option key={id} value={id} className="bg-gray-800 text-white">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-1">
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Special Requests
              </label>
              <textarea
                name="request"
                value={formData.request}
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
                {reservation ? "Update Reservation" : "Submit Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
