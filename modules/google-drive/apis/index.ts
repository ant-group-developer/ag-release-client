import axiosUpload from '@/api/axios-upload';
import { DetailResponse } from '@/types/api';

export const googleDriveApis = {
    getThumbnail: (googleDriveFileId: string) => {
        return axiosUpload.get<DetailResponse<string>>(
            `v2/drive/${googleDriveFileId}/thumbnail`
        );
    },
};
