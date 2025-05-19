import { useCallback, useEffect, useState } from "react";
import ReservationForm from "../components/ReservationForm";
import CalendarGrid from "../components/CalendarGrid";
import Header from "../components/Header";

import Footer from "../components/Footer";
import { useReservationStore } from "../store/reservationStore";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { reservations, getAllReservations, loading } = useReservationStore();

  const fetchReservations = useCallback(() => {
    getAllReservations();
  }, [getAllReservations]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
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

  return (
    <div className="min-h-screen flex justify-between flex-col bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 ">
      <Header />

      <main className="px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <CalendarGrid
            currentMonth={currentMonth}
            onAddReservation={handleDayClick}
            selectedDate={selectedDate}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
            reservations={reservations}
            //loading={loading}
          />
        </div>

        {showForm && selectedDate && (
          <ReservationForm onClose={closeForm} selectedDate={selectedDate} />
        )}
      </main>
      <Footer />
    </div>
  );
}
