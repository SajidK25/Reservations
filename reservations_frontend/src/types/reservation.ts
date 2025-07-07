export interface Reservation {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  userId: number;
  request?: string;
  spaceId: number;
}
export type NewReservation = Omit<Reservation, "id">;


