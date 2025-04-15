import api from "./api";

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createReservation = async (data: any) => {
  const response = await api.post("/", data);
  return response.data;
};

export const getReservation = async (id: string) => {
  const response = await api.get(`/GET_RESERVATION?id=${id}`);
  return response.data;
};

export const updateReservation = async (id: string, data: any) => {
  const response = await api.patch(`/?id=${id}`, data);
  return response.data;
};

export const deleteReservation = async (id: string) => {
  const response = await api.delete(`/?id=${id}`);
  return response.data;
};

export const getAllReservations = async () => {
  const response = await api.get("/");
  return response.data;
};




