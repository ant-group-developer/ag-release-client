import { getLinkDriveImage } from '@/helpers/link';
import { FileData } from '../types';

export const getLinkIllustrative = (
    googleDriveFileId: FileData['googleDriveFileId'],
    readUrl: FileData['readUrl'],
    width?: number
) => {
    if (googleDriveFileId) {
        return getLinkDriveImage(googleDriveFileId, width);
    }
    return readUrl;
};
