import { api } from "./api";

export const getJobById = async (id: string) => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data.data;
};