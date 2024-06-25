import axios from 'axios';
import Cookies from "js-cookie";

const getToken = (): string | null => {
    return Cookies.get('accessToken') || null;
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