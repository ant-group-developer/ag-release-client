import axios from 'axios';

const axiosAccount = axios.create({
    baseURL: '/api/account',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAccount.interceptors.request.use((config) => {
    return config;
});

axiosAccount.interceptors.response.use(undefined, (error) => {
    // if (error?.response?.status === 401) {
    //     window.location.replace(APP_ROUTES.LOGIN);
    // }

    return Promise.reject(error);
});

export default axiosAccount;
