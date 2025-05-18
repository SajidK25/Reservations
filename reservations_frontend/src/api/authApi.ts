import api from "./api";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", credentials);
  const { access_token } = response.data;
  sessionStorage.setItem("access_token", access_token);

  const userResponse = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return userResponse.data; 
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};