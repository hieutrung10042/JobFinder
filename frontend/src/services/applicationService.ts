import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
}

export const applicationService = {
    // CandidateManagement - lấy danh sách
    getEmployerApplications: () =>
        axios.get(`${API_URL}/applications/employer/list`, { headers: getHeaders() }),

    // CandidateDetail - lấy chi tiết 1 ứng viên
    getApplicationById: (id: string | number) =>
        axios.get(`${API_URL}/applications/employer/detail/${id}`, { headers: getHeaders() }),

    // Cập nhật trạng thái
    updateStatus: (application_id: number, status: string) =>
        axios.put(`${API_URL}/applications/update-status`, { application_id, status }, { headers: getHeaders() }),

    // EmployerDashboard - lấy jobs + stats
    getEmployerJobs: () =>
        axios.get(`${API_URL}/applications/employer/jobs`, { headers: getHeaders() }),
    // Thêm vào object applicationService:

    // Notes
    getNotes: (application_id: number) =>
        axios.get(`${API_URL}/applications/notes/${application_id}`, { headers: getHeaders() }),

    addNote: (application_id: number, content: string) =>
        axios.post(`${API_URL}/applications/notes`, { application_id, content }, { headers: getHeaders() }),

    deleteNote: (note_id: number) =>
        axios.delete(`${API_URL}/applications/notes/${note_id}`, { headers: getHeaders() }),

    // Toggle job status
    toggleJobStatus: (job_id: number) =>
        axios.put(`${API_URL}/applications/jobs/toggle-status`, { job_id }, { headers: getHeaders() }),
};