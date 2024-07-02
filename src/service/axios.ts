import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add correlation ID header
    config.headers['X-Correlation-ID'] = uuidv4();  // Generates a new ID for each request

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;