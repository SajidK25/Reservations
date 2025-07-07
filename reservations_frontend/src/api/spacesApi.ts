import api from "./api";

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSpaces = async () => {
  const response = await api.get(`/spaces`);
  return response.data;
};
  