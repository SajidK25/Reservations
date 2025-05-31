import { Reservation } from "../types/reservation";
import AddReservationBtn from "./AddReservationBtn";
import ReservationPill from "./ReservationPill";

interface DayCardProps {
  day: number;
  onAddReservation: () => void;
  isSelected?: boolean;
  year: number;
  month: number;
  reservations: Reservation[];
  isOtherMonth?: boolean;
}

export default function DayCard({
  day,
  onAddReservation,
  isSelected,
  reservations = [],
  isOtherMonth = false,
}: DayCardProps) {
  const otherMonthClasses = "text-gray-300 opacity-30 cursor-not-allowed";
  return (
    <div
      className={`rounded-xl h-full flex flex-col items-center transition duration-200 py-1 text-base font-base text-white mt-1 min-h-fit max-h-max
        ${isSelected ? "bg-blue-700" : "bg-gray-700 hover:bg-blue-600"}
        ${isOtherMonth ? otherMonthClasses : ""}
      `}
    >
      <div className="text-xs font-semibold">{day}</div>
      <div className="flex flex-col flex-1 min-h-16 max-h-16 w-full gap-0.5 overflow-y-auto scrollbar-thin">
        {reservations.map((reservation) => (
          <ReservationPill key={reservation.id} reservation={reservation} />
        ))}
      </div>
      <AddReservationBtn onAddReservation={onAddReservation} />
    </div>
  );
}



