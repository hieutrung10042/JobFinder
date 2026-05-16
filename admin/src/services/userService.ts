import { ADMIN_USERS_API, getHeaders } from '../constants';

export const userService = {
    // GET /api/admin/users
    getUsers: async (params: URLSearchParams) => {
        const res = await fetch(`${ADMIN_USERS_API}?${params}`, { headers: getHeaders() });
        return res.json();
    },

    // GET /api/admin/users/:user_id
    getUserDetail: async (userId: number) => {
        const res = await fetch(`${ADMIN_USERS_API}/${userId}`, { headers: getHeaders() });
        return res.json();
    },

    // PUT /api/admin/users/:user_id/toggle-ban
    toggleBan: async (userId: number, reason?: string) => {
        const res = await fetch(`${ADMIN_USERS_API}/${userId}/toggle-ban`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        return res.json();
    },

    // PUT /api/admin/users/:user_id/verify-company
    verifyCompany: async (userId: number) => {
        const res = await fetch(`${ADMIN_USERS_API}/${userId}/verify-company`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        return res.json();
    },
};