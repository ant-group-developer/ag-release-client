import { getLinkDriveImage } from '@/helpers/link';
import { useGetImage } from '@/hooks/use-get-image';
import { FileData } from '@/modules/order/types';
import { TopicData } from '../types';

export const useGetImageTopic = (
    fileId: TopicData['imageIllustrativeId'],
    enabled: boolean = true,
    googleDriveFileId?: FileData['googleDriveFileId'],
    width?: number
) => {
    const { fileData } = useGetImage(fileId, enabled && !googleDriveFileId);

    const imgUrl = googleDriveFileId
        ? getLinkDriveImage(googleDriveFileId, width)
        : fileData?.readUrl;

    return imgUrl;
};
