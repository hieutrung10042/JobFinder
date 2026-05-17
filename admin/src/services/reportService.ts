import { ADMIN_REPORTS_API, getHeaders } from '../constants';

export const reportService = {
    // GET /api/admin/reports?status=...&search=...
    getReports: async (params: URLSearchParams) => {
        const res = await fetch(`${ADMIN_REPORTS_API}?${params}`, { headers: getHeaders() });
        return res.json();
    },

    // PUT /api/admin/reports/:id/status
    updateStatus: async (reportId: number, status: 'resolved' | 'ignored') => {
        const res = await fetch(`${ADMIN_REPORTS_API}/${reportId}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return res.json();
    },

    // DELETE /api/admin/reports/:id/job
    deleteJob: async (reportId: number) => {
        const res = await fetch(`${ADMIN_REPORTS_API}/${reportId}/job`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return res.json();
    },
};