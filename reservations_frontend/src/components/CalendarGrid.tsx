import { Reservation } from "../types/reservation";
import DayCard from "./DayCard";

interface CalendarGridProps {
  currentMonth: Date;
  onAddReservation: (date: string) => void;
  selectedDate: string | null;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  reservations: Record<string, Reservation[]>;
}

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  onAddReservation,
  goToPreviousMonth,
  goToNextMonth,
  reservations,
}: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  const weeks: (number | null)[][] = [];
  let dayCounter = 1 - startDay;

  for (let i = 0; i < 6; i++) {
    const week: (number | null)[] = [];
    for (let j = 0; j < 7; j++) {
      if (dayCounter > 0 && dayCounter <= daysInMonth) {
        week.push(dayCounter);
      } else {
        week.push(null);
      }
      dayCounter++;
    }
    weeks.push(week);
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl sm:p-5 text-white flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-xl font-bold mb-1">
          {monthName} {year}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="text-gray-300 hover:text-blue-400 transition font-medium"
          >
            ← Prev
          </button>
          <button
            onClick={goToNextMonth}
            className="text-gray-300 hover:text-blue-400 transition font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-400 mb-2 h-8">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm sm:text-sm">
            {day}
          </div>
        ))}
      </div>
      <div className="h-[calc(100vh-12rem)]  grid grid-rows-6 gap-1 ">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-2">
            {week.map((day, j) => {
              let cellDay = day;
              let isOtherMonth = false;
              let cellDate: Date | null = null;

              if (!day) {
                if (i === 0) {
                  const prevMonth = month === 0 ? 11 : month - 1;
                  const prevYear = month === 0 ? year - 1 : year;
                  const prevMonthDays = new Date(
                    prevYear,
                    prevMonth + 1,
                    0
                  ).getDate();
                  cellDay = prevMonthDays - startDay + j + 1;
                  cellDate = new Date(prevYear, prevMonth, cellDay);
                } else {
                  cellDay = j - week.filter(Boolean).length + 1;
                  const nextMonth = month === 11 ? 0 : month + 1;
                  const nextYear = month === 11 ? year + 1 : year;
                  cellDate = new Date(nextYear, nextMonth, cellDay);
                }
                isOtherMonth = true;
              } else {
                cellDate = new Date(year, month, day);
              }

              const fullDate = cellDate.toISOString().split("T")[0];
              const isSelected = selectedDate === fullDate;
              const dayReservations = reservations[fullDate] || [];

              return (
                <DayCard
                  key={fullDate}
                  day={cellDay!}
                  onAddReservation={() => onAddReservation(fullDate)}
                  isSelected={isSelected}
                  year={cellDate.getFullYear()}
                  month={cellDate.getMonth()}
                  reservations={dayReservations}
                  isOtherMonth={isOtherMonth}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
