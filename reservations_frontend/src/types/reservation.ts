export interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  userId: number;
  created_at?: string;
}

export type newReservation = Omit<Reservation, "id">;
