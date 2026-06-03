import { ReleasesData } from '@/modules/releases/types';
import { Flex, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import ManageCaptionsModal from './manage-captions-modal';
import { useGetReleaseCaptions } from '@/modules/releases/hooks/use-get-release-captions';
import { RELEASE_VIDEO_CAPTION_TYPE } from '../../enums';

interface CaptionsAssetItemProps {
    dataEdit?: ReleasesData;
}

export default function CaptionsAssetItem({
    dataEdit,
}: CaptionsAssetItemProps) {
    const messages = useTranslations();
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const { releaseCaptionsData } = useGetReleaseCaptions(dataEdit?.id ?? '');

    const { captionCount, subtitleCount } = useMemo(() => {
        let captionCount = 0;
        let subtitleCount = 0;

        releaseCaptionsData?.forEach((item) => {
            if (item.type === RELEASE_VIDEO_CAPTION_TYPE.CAPTION) {
                captionCount++;
            } else if (item.type === RELEASE_VIDEO_CAPTION_TYPE.SUBTITLE) {
                subtitleCount++;
            }
        });

        return { captionCount, subtitleCount };
    }, [releaseCaptionsData]);

    return (
        <Flex vertical gap={4}>
            <Flex align="center" gap={8}>
                <Typography.Text strong style={{ fontSize: 12 }}>
                    {messages('releaseVideo.captions.title')}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    |
                </Typography.Text>
                <Typography.Text
                    style={{ fontSize: 12 }}
                    onClick={() => setIsManageModalOpen(true)}
                    className="cursor-pointer font-medium !text-blue-500"
                >
                    {messages('releaseVideo.fields.manage')}
                </Typography.Text>
            </Flex>
            <Typography.Text
                type="secondary"
                style={{ fontSize: 12, fontWeight: 500 }}
            >
                {messages('releaseVideo.fields.captionFilesSummary', {
                    captionCount,
                    subtitleCount,
                })}
            </Typography.Text>

            <ManageCaptionsModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
            />
        </Flex>
    );
}
