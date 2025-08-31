import api from "./api";

export const listUsers = async () => {
  const resp = await api.get("/users");
  return resp.data;
};

export const deleteUser = async (id: number) => {
  const resp = await api.delete(`/users/${id}`);
  return resp.data;
};
