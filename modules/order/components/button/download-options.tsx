import DownloadButton from '@/components/ui/button/dowload-button';
import { getLinkDriveDownload } from '@/helpers/link';
import { uploadApi } from '@/modules/upload/apis';
import { Divider, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { FileData } from '../../types';

type Props = {
    className?: string;
    imageDownloadUrl?: string;
    videoDownloadUrl?: string;
    videoFileId: string | undefined;
    imageFileId: string | undefined;
    videoGoogleDriveFileId?: FileData['googleDriveFileId'];
    imageGoogleDriveFileId?: FileData['googleDriveFileId'];
};

export default function DownloadOptions({
    className,
    videoFileId,
    imageFileId,
    videoGoogleDriveFileId,
    imageGoogleDriveFileId,
}: Props) {
    const messages = useTranslations();

    const handleDownload = async (
        fileId?: string,
        driveId?: FileData['googleDriveFileId']
    ) => {
        let downloadLink;

        if (driveId) {
            downloadLink = getLinkDriveDownload(driveId);
        } else if (fileId) {
            const response = await uploadApi.getDownloadLink(fileId);
            downloadLink = response?.data?.data?.downloadUrl;
        }

        if (typeof downloadLink === 'string' && downloadLink) {
            window.open(downloadLink);
        }
    };

    if (!videoFileId && !imageFileId) return null;
    return (
        <div className={className}>
            <p className="py-2 text-lg font-bold">
                {messages('common.download')}
            </p>
            <Space size={'small'}>
                {videoFileId && (
                    <DownloadButton
                        onClick={() =>
                            handleDownload(videoFileId, videoGoogleDriveFileId)
                        }
                        value={messages('common.video')}
                    />
                )}

                {imageFileId && (
                    <DownloadButton
                        onClick={() =>
                            handleDownload(imageFileId, imageGoogleDriveFileId)
                        }
                        value={messages('common.image')}
                    />
                )}
            </Space>
            <Divider />
        </div>
    );
}
