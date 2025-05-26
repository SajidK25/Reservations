import { useEffect, useRef } from "react";

interface TimePickerProps {
  times: string[];
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
}

export default function TimePicker({
  times,
  startTime,
  endTime,
  onChange,
}: TimePickerProps) {
  const selectingStart = !startTime || endTime;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleSelect = (time: string) => {
    if (selectingStart) {
      onChange(time, "");
    } else {
      if (time > startTime) {
        onChange(startTime, time);
      } else {
        onChange(time, "");
      }
    }
  };

  const isInRange = (time: string) =>
    startTime && endTime && time >= startTime && time <= endTime;

  useEffect(() => {
    if (startTime && buttonRefs.current[startTime]) {
      buttonRefs.current[startTime]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [startTime]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={`h-full overflow-y-auto flex flex-col-reverse gap-1 p-1 scrollbar-thin `}
      >
        {times.map((time) => (
          <button
            key={time}
            ref={(el) => {
              buttonRefs.current[time] = el;
            }}
            type="button"
            onClick={() => handleSelect(time)}
            className={`text-sm px-4 py-2 text-left rounded-lg border w-full transition duration-200 ${
              startTime === time
                ? "bg-green-600 text-white border-green-600"
                : endTime === time
                ? "bg-red-600 text-white border-red-600"
                : isInRange(time)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:ring-1 hover:ring-blue-400"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
