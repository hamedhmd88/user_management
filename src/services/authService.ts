import api from "../api/axiosInstance";

export const authService = {
  login: (username: string, password: string) =>
    api.post("/auth/token/", { username, password }),

  changePasswordWithToken: (
    current_password: string,
    new_password: string,
    confirm_password: string
  ) =>
    api.post("/auth/password/change-with-token/", {
      current_password,
      new_password,
      confirm_password,
    }),

  refreshToken: (refresh: string) =>
    api.post("/auth/token/refresh/", { refresh }),
};
