import { fetchReservations, createReservation } from "../api/reservationsApi";
import { create, StateCreator } from "zustand";
import { Reservation, newReservation } from "../types/reservation";

interface ReservationStore {
  reservations: Record<string, Reservation[]>;
  loading: boolean;
  getAllReservations: () => Promise<void>;
  addReservation: (data: newReservation) => Promise<void>;
}
export const useReservationStore = create<ReservationStore>(((set, get) => ({
  reservations: {},
  loading: false,

  getAllReservations: async () => {
    set({ loading: true });
    const token = sessionStorage.getItem("access_token");
    if (!token) return;

    try {
      const data: Reservation[] = await fetchReservations();

      const grouped: Record<string, Reservation[]> = {};
      data.forEach((r) => {
        if (!r || !r.startDate) {
          console.warn("Preskočena rezervacija bez startDate:", r);
          return;
        }

        const date = r.startDate.split("T")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(r);
      });

      set({ reservations: grouped });
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        err.status === 401
      ) {
        window.location.href = "/login";
        return;
      }
      console.error("Failed to fetch", err);
    } finally {
      set({ loading: false });
    }
  },

  addReservation: async (reservationData) => {
    try {
      const newReservation = await createReservation(reservationData);

      const current = get().reservations;
      const dateKey = newReservation.startDate.split("T")[0];

      const updated = {
        ...current,
        [dateKey]: [...(current[dateKey] || []), newReservation],
      };

      set({ reservations: updated });
    } catch (err) {
      console.error("Failed to add", err);
    }
  },
})) as StateCreator<ReservationStore>);
