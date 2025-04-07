import { useState } from "react";
import ReservationForm from "../components/ReservationForm";
import DayButton from "../components/DayButton";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day).toISOString().split("T")[0];
    setSelectedDate(date);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-10">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-xl p-2 sm:p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
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

        <div className="grid grid-cols-7 gap-2 text-center text-gray-400 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-medium text-sm sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-3 mb-2">
            {week.map((day, j) => {
              if (day) {
                const fullDate = new Date(year, month, day)
                  .toISOString()
                  .split("T")[0];
                const isSelected = selectedDate === fullDate;

                return (
                  <DayButton
                    key={j}
                    day={day}
                    onClick={() => handleDayClick(day)}
                    isSelected={isSelected}
                    year={year}
                    month={month}
                  />
                );
              } else {
                return <div key={j}></div>;
              }
            })}
          </div>
        ))}
      </div>

      {showForm && selectedDate && (
        <ReservationForm onClose={closeForm} selectedDate={selectedDate} />
      )}
    </div>
  );
}
