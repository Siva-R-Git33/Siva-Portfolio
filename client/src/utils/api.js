import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercept Vercel HTML rewrites
api.interceptors.response.use(
    (response) => {
        if (typeof response.data === 'string' && response.data.match(/<html/i)) {
            return Promise.reject(new Error('API returned HTML'));
        }
        return response;
    },
    (error) => Promise.reject(error)
);

// API functions
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
};

export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
};

export const blogsAPI = {
    getAll: (tag) => api.get('/blogs', { params: tag ? { tag } : {} }),
    getAllAdmin: () => api.get('/blogs/all'),
    getBySlug: (slug) => api.get(`/blogs/${slug}`),
    create: (data) => api.post('/blogs', data),
    update: (id, data) => api.put(`/blogs/${id}`, data),
    delete: (id) => api.delete(`/blogs/${id}`),
};

export const skillsAPI = {
    getAll: () => api.get('/skills'),
    create: (data) => api.post('/skills', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`),
};

export const contactAPI = {
    send: (data) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
    markRead: (id) => api.put(`/contact/${id}/read`),
    delete: (id) => api.delete(`/contact/${id}`),
};

export const githubAPI = {
    getRepos: () => api.get('/github/repos'),
};

export default api;
