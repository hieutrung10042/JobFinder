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
};