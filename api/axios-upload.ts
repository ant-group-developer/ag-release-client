import { defaultConfig } from '@/constants/env';
import axios from 'axios';

const axiosUpload = axios.create({
    baseURL: defaultConfig.API_UPLOAD,
    headers: {
        'x-api-key': defaultConfig.APP_UPLOAD_X_API_KEY,
    },
});

export default axiosUpload;
