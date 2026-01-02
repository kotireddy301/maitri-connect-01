import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
});

export const FILE_BASE_URL = import.meta.env.VITE_API_URL || '';

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const path = window.location.pathname;
        let token;

        if (path.startsWith('/admin')) {
            token = localStorage.getItem('admin_token');
        } else {
            // For user pages and public pages, prioritize user_token
            // but fallback to admin_token if user_token is not present
            // (this allows admin users to browse public site with their admin session)
            token = localStorage.getItem('user_token') || localStorage.getItem('admin_token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
