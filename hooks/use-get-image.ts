import { QUERY_KEY } from '@/constants/query-key';
import { FileData } from '@/modules/order/types';
import { uploadApi } from '@/modules/upload/apis';
import { useQuery } from '@tanstack/react-query';

export const useGetImage = (
    imageId: FileData['id'] | undefined | null,
    enabled?: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [QUERY_KEY.IMAGE.KEY, imageId],
        queryFn: () => uploadApi.getFile(imageId as FileData['id']),
        enabled: !!imageId && enabled,
    });

    const defaultData: FileData = {
        id: '',
        downloadUrl: '',
        fileName: '',
        readUrl: '',
        dateCreated: '',
        fileSizeInByte: 0,
        googleDriveFileId: null,
    };
    const fileData = data?.data?.data ?? defaultData;
    return {
        fileData,
        ...res,
    };
};
