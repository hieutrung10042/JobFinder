import axios from "axios";
import api from "./api"; // nhớ api export default

const API_URL = "http://localhost:5000/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const applicationService = {
  // =========================
  // EMPLOYER
  // =========================

  getEmployerApplications: () =>
    axios.get(`${API_URL}/applications/employer/list`, {
      headers: getHeaders(),
    }),

  getApplicationById: (id: string | number) =>
    axios.get(`${API_URL}/applications/employer/detail/${id}`, {
      headers: getHeaders(),
    }),

  updateStatus: (application_id: number, status: string) =>
    axios.put(
      `${API_URL}/applications/update-status`,
      { application_id, status },
      { headers: getHeaders() }
    ),

  getEmployerJobs: () =>
    axios.get(`${API_URL}/applications/employer/jobs`, {
      headers: getHeaders(),
    }),

  // =========================
  // CANDIDATE
  // =========================

  applyJob: (jobId: number) =>
    axios.post(
      `${API_URL}/applications/apply`,
      { jobId },
      { headers: getHeaders() }
    ),

  getMyApplications: () =>
    axios.get(`${API_URL}/applications/my`, {
      headers: getHeaders(),
    }),
};