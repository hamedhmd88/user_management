import api from "../api/axiosInstance";

export const menuService = {
  getMenus: () => api.get("/menus/"),
};