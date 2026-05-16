import axios from 'axios';
import { ADMIN_METADATA_API, getHeaders } from '../constants';
import { MetaFormState } from '../types';

export const metadataService = {
    // GET /api/admin/metadata/categories | locations | skills
    getAll: (apiPath: string) =>
        axios.get(`${ADMIN_METADATA_API}/${apiPath}`, { headers: getHeaders() }),

    // POST /api/admin/metadata/categories | locations | skills
    create: (apiPath: string, data: MetaFormState) =>
        axios.post(`${ADMIN_METADATA_API}/${apiPath}`, data, { headers: getHeaders() }),

    // PUT /api/admin/metadata/categories/:id | locations/:id | skills/:id
    update: (apiPath: string, id: number, data: MetaFormState) =>
        axios.put(`${ADMIN_METADATA_API}/${apiPath}/${id}`, data, { headers: getHeaders() }),

    // DELETE /api/admin/metadata/categories/:id | locations/:id | skills/:id
    delete: (apiPath: string, id: number) =>
        axios.delete(`${ADMIN_METADATA_API}/${apiPath}/${id}`, { headers: getHeaders() }),
};