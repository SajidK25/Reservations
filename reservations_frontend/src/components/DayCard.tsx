import { Reservation } from "../types/reservation";
import AddReservationBtn from "./AddReservationBtn";

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
      className={`rounded-xl h-full  flex flex-col items-center justify-between transition duration-200 text-base py-1 sm:text-base font-base  text-white
        ${isSelected ? "bg-blue-700" : "bg-gray-700 hover:bg-blue-600"}
         ${isOtherMonth ? otherMonthClasses : ""}
      `}
    >
      <div className="text-sm font-semibold">{day}</div>
      <div className="flex flex-col flex-1 justify-start w-full mt-1 px-1 gap-1">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-blue-900 bg-opacity-60 rounded px-1 text-[10px] truncate"
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
