import api from "../api/axiosInstance";

export const userService = {
  getUsers: (params?: Record<string, any>) =>
    api.get("/users/", { params }),

  getUser: (id: number | string) =>
    api.get(`/users/${id}/`),

  createUser: (data: Record<string, any>) =>
    api.post("/users/", data),

  updateUser: (id: number | string, data: Record<string, any>) =>
    api.patch(`/users/${id}/`, data),

  deleteUser: (id: number | string) =>
    api.delete(`/users/${id}/`),
};