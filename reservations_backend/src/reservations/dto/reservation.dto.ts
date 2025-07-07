export interface Reservation {
  id?: number;
  reservation_id?: number;
  user_id: number;
  status?: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  request?: string | null;
  title: string;
}
