import { useState } from "react";
import ReservationForm from "../components/ReservationForm";
import CalendarGrid from "../components/CalendarGrid";
import Header from "../components/Header";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

    const logout = () => {
      alert("Logging out (placeholder)");
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
      <Header onLogout={logout} />

      <main className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <CalendarGrid
            currentMonth={currentMonth}
            onSelectDate={handleDayClick}
            selectedDate={selectedDate}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
        </div>

        {showForm && selectedDate && (
          <ReservationForm onClose={closeForm} selectedDate={selectedDate} />
        )}
      </main>
    </div>
  );
}