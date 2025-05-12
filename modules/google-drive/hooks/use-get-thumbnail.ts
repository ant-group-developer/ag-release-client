import { useQuery } from '@tanstack/react-query';
import { googleDriveApis } from '../apis';
import { googleDriveQueryKeys } from '../constants';

export const useGetThumbnail = (
    googleDriveFileId: string,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...googleDriveQueryKeys.getThumbnail, googleDriveFileId],
        queryFn: () => googleDriveApis.getThumbnail(googleDriveFileId),
        enabled: !!googleDriveFileId && enabled,
    });

    const thumbnailData = data?.data?.data ?? '';

    return {
        thumbnailData,
        ...res,
    };
};
