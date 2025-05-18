import { Reservation } from "../types/reservation";
import AddReservationBtn from "./AddReservationBtn";

interface DayCardProps {
  day: number;
  onAddReservation: () => void;
  isSelected?: boolean;
  year: number;
  month: number;
  reservations: Reservation[];
}

export default function DayCard({
  day,
  onAddReservation,
  isSelected,
  reservations = [],
}: DayCardProps) {
  const baseClasses =
    "rounded-xl h-24 sm:h-24 flex flex-col items-center justify-start pt-2 transition duration-200 text-base sm:text-base font-base";
  return (
    <div
      className={`
        ${isSelected ? "bg-blue-700" : "bg-gray-800 hover:bg-blue-600"}
       "border-2 border-blue-400"
        ${baseClasses} text-white
      `}
    >
      <div className="text-lg font-semibold h-fit">{day}</div>
      <div className="flex flex-col w-full mt-1 px-1 gap-1">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-blue-900 bg-opacity-60 rounded px-1 py-0.5 text-xs truncate"
            title={reservation.created_at}
          >
            {reservation.id}
          </div>
        ))}
      </div>
      <AddReservationBtn onAddReservation={onAddReservation} />
    </div>
  );
}
