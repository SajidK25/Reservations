interface ReservationPillProps {
  reservation: Reservation;
  onClick?: () => void; // Add this line
}

export default function ReservationPill({
  reservation,
  onClick,
}: ReservationPillProps) {
  const time = new Date(reservation.startDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-red-900 bg-opacity-60 rounded px-1 text-[8px] truncate flex items-center gap-1 min-h-[1rem] cursor-pointer hover:bg-red-800 transition"
      title={reservation.created_at}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <span className="font-bold">{time}</span>
      <span className="opacity-70">{reservation.id}</span>
    </div>
  );
}
