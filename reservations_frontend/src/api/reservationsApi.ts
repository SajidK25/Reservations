import { Reservation, NewReservation } from "../types/reservation";
import api from "./api";

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchReservations = async () => {
  const response = await api.get("/reservations");
  return response.data;
};

export const getReservation = async (id: number) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const createReservation = async (
  data: NewReservation
): Promise<Reservation> => {
  console.log(data);
  const response = await api.post("/reservations", data);
  return response.data;
};

export const updateReservation = async (
  id: number,
  data: Partial<NewReservation> & { id?: number }
) => {
  const response = await api.patch(`/reservations/${id}`, data);
  return response.data;
};

export const deleteReservation = async (id: number) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};
