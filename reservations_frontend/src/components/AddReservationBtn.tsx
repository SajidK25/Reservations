interface AddReservationBtnProps {
  onAddReservation: () => void;
}

export default function AddReservationBtn({
  onAddReservation,
}: AddReservationBtnProps) {
  return (
    <button
      className="
          w-9 h-9
          rounded-full
          bg-black
          text-white
          flex items-center justify-center
          shadow
          z-10
          transition-all duration-200
          hover:scale-110
          hover:bg-gray-800
          transform origin-center
          z-1000
        "
      onClick={(e) => {
        e.stopPropagation();
        onAddReservation();
      }}
      aria-label="Dodaj rezervaciju"
      type="button"
    >
      <span className="text-xl leading-none">+</span>
    </button>
  );
}
