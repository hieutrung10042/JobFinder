import { ADMIN_JOBS_API, getHeaders } from '../constants';

export const jobService = {
    // GET /api/admin/jobs/admin/pending
    getPendingJobs: async () => {
        const res = await fetch(`${ADMIN_JOBS_API}/admin/pending`, { headers: getHeaders() });
        return res.json();
    },

    // PUT /api/admin/jobs/admin/:job_id/approve
    approveJob: async (jobId: number, reason?: string) => {
        const res = await fetch(`${ADMIN_JOBS_API}/admin/${jobId}/approve`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        return res.json();
    },

    // PUT /api/admin/jobs/admin/:job_id/reject
    rejectJob: async (jobId: number, reason: string) => {
        const res = await fetch(`${ADMIN_JOBS_API}/admin/${jobId}/reject`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        return res.json();
    },
};