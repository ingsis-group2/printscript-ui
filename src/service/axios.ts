import axios from 'axios';
const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;