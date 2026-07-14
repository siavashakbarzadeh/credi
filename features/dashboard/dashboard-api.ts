import api from "../../lib/api-client";

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },
};
