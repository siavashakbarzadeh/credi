import api from "../../lib/api-client";

export const notificationsApi = {
  list: async (page = 1, limit = 20) => {
    const { data } = await api.get("/notifications", { params: { page, limit } });
    return data;
  },

  markRead: async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllRead: async () => {
    const { data } = await api.patch("/notifications/read-all");
    return data;
  },
};
