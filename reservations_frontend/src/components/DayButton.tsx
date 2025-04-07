// components/DayButton.tsx

interface DayButtonProps {
  day: number;
  onClick: () => void;
  isSelected?: boolean;
  availability?: "available" | "unavailable" | "limited";
  year: number;
  month: number; // 0-based, like JavaScript Date
}

export default function DayButton({
  day,
  onClick,
  isSelected,
}: DayButtonProps) {

  const baseClasses =
    "rounded-xl h-24 sm:h-24 flex flex-col items-center justify-start pt-2 transition duration-200 text-base sm:text-base font-base";


  return (
    <button
      onClick={onClick}
      className={`
        ${isSelected ? "bg-blue-700" : "bg-gray-800 hover:bg-blue-600"}
       "border-2 border-blue-400"
        ${baseClasses} text-white
      `}
    >
      <div className="text-lg font-semibold">{day}</div>
    </button>
  );
}
