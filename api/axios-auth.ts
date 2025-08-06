import axios from 'axios';

const axiosAuth = axios.create({
    baseURL: '/api/v1',
});

axiosAuth.interceptors.request.use((config) => {
    return config;
});

axiosAuth.interceptors.response.use(undefined, (error) => {
    // if (error?.response?.status === 401) {
    //     window.location.replace(APP_ROUTES.LOGIN);
    // }

    return Promise.reject(error);
});

export default axiosAuth;
