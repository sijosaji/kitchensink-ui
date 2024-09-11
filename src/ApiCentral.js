import axios from 'axios';

// Create an axios instance for Auth API (doesn't require a token)
export const authApi = axios.create({
    baseURL: 'http://localhost:9000/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create an axios instance for Member API (requires a token)
export const memberApi = axios.create({
    baseURL: 'http://localhost:8080/kitchensink/rest',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token in memberApi requests
memberApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Handle 401 errors by refreshing the token
memberApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await authApi.put(`/${refreshToken}/refresh`);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return memberApi(originalRequest); // Retry the original request with the new token
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        if (error.response.status === 400 || error.response.status === 409) {
            return Promise.reject({
                ...error,
                customError: error.response.data.error || error.response.data.error || 'An error occurred'
            });
        }

        return Promise.reject(error);
    }
);

// Auth API functions
export const login = (credentials) => authApi.post('/token', credentials);
export const register = (userData) => authApi.post('/register', userData);

// Member API functions
export const createMember = (memberData) => memberApi.post('/members', memberData);
export const listMembers = () => memberApi.get('/members');
export const getMember = (id) => memberApi.get(`/members/${id}`);
export const updateMember = (id, memberData) => memberApi.patch(`/members/${id}`, memberData);
export const deleteMember = (id) => memberApi.delete(`/members/${id}`);
