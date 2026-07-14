import api from "../../lib/api-client";

export const applicationsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    officerId?: string;
    search?: string;
  }) => {
    const { data } = await api.get("/applications", { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await api.get(`/applications/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post("/applications", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.patch(`/applications/${id}`, payload);
    return data;
  },

  updateStatus: async (id: string, status: string, reason?: string) => {
    const { data } = await api.patch(`/applications/${id}/status`, { status, reason });
    return data;
  },

  assign: async (id: string, userId: string) => {
    const { data } = await api.post(`/applications/${id}/assign`, { userId });
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/applications/${id}`);
  },

  getActivity: async (id: string) => {
    const { data } = await api.get(`/applications/${id}/activity`);
    return data;
  },

  getNotes: async (id: string) => {
    const { data } = await api.get(`/applications/${id}/notes`);
    return data;
  },

  addNote: async (id: string, content: string) => {
    const { data } = await api.post(`/applications/${id}/notes`, { content });
    return data;
  },

  getDocuments: async (id: string) => {
    const { data } = await api.get(`/applications/${id}/documents`);
    return data;
  },

  uploadDocument: async (id: string, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    const { data } = await api.post(`/applications/${id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateDocument: async (docId: string, status: string, rejectionReason?: string) => {
    const { data } = await api.patch(`/documents/${docId}`, { status, rejectionReason });
    return data;
  },

  createGoogleDoc: async (id: string) => {
    const { data } = await api.post(`/applications/${id}/google-doc/create`);
    return data;
  },

  linkGoogleDoc: async (id: string, googleDocId: string) => {
    const { data } = await api.post(`/applications/${id}/google-doc/link`, { googleDocId });
    return data;
  },

  getGoogleDoc: async (id: string) => {
    const { data } = await api.get(`/applications/${id}/google-doc`);
    return data;
  },

  startWatch: async (id: string) => {
    const { data } = await api.post(`/applications/${id}/google-doc/watch`);
    return data;
  },

  syncGoogleDoc: async (id: string) => {
    const { data } = await api.post(`/google/sync/${id}`);
    return data;
  },
};
