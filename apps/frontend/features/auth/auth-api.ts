import api from "../../lib/api-client";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    return data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const { data } = await api.post("/auth/refresh", { refreshToken });
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    return data;
  },
};
