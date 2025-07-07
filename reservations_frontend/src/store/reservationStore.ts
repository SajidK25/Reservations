import {
  fetchReservations,
  createReservation,
  updateReservation,
} from "../api/reservationsApi";
import { create, StateCreator } from "zustand";
import { Reservation, NewReservation } from "../types/reservation";
import { getSpaces } from "../api/spacesApi"; 

interface ReservationStore {
  reservations: Record<string, Reservation[]>;
  spaceOptions: Record<number, string>;
  loading: boolean;
  getAllReservations: () => Promise<void>;
  addReservation: (data: NewReservation) => Promise<void>;
  updateReservation: (data: Reservation) => Promise<void>;
  getSpaceOptions: () => Promise<void>;
}
export const useReservationStore = create<ReservationStore>(((set, get) => ({
  reservations: {},
  spaceOptions: {},
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
  updateReservation: async (reservationData) => {
    try {
      const updatedReservation = await updateReservation(
        reservationData.id,
        reservationData
      );

      const current = get().reservations;
      const dateKey = updatedReservation.startDate.split("T")[0];

      const updatedDayReservations = (current[dateKey] || []).filter(
        (r) => r.id !== updatedReservation.id
      );

      const updated = {
        ...current,
        [dateKey]: [...updatedDayReservations, updatedReservation],
      };

      set({ reservations: updated });
    } catch (err) {
      console.error("Failed to update", err);
    }
  },
  getSpaceOptions: async () => {
    try {
      const spaces = await getSpaces();

      const options: Record<number, string> = {};
      spaces.forEach((space: { id: number; name: string }) => {
        options[space.id] = space.name;
      });
      set({ spaceOptions: options });
    } catch (err) {
      console.error("Failed to fetch space options", err);
    }
  },
})) as StateCreator<ReservationStore>);
