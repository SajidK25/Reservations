import { Reservation } from "../types/reservation";

interface ReservationPillProps {
  reservation: Reservation;
}

export default function ReservationPill({ reservation }: ReservationPillProps) {
  const time = new Date(reservation.startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-red-900 bg-opacity-60 rounded px-1 text-[8px] truncate flex items-center gap-1 min-h-[1rem]"
      title={reservation.created_at}
    >
      <span className="font-bold">{time}</span>
      <span className="opacity-70">{reservation.id}</span>
    </div>
  );
}
