import { ReleasesData } from '@/modules/releases/types';
import { Flex, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ManageCaptionsModal from './manage-captions-modal';

interface CaptionsAssetItemProps {
    dataEdit?: ReleasesData;
}

export default function CaptionsAssetItem({
    dataEdit,
}: CaptionsAssetItemProps) {
    const messages = useTranslations();
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    // Currently captions are read from video details or kept as placeholder
    const captionCount = dataEdit?.video?.subtitles?.length || 0;

    return (
        <Flex vertical gap={4}>
            <Flex align="center" gap={8}>
                <Typography.Text strong style={{ fontSize: 12 }}>
                    {messages('releaseVideo.fields.captionsAndSubtitles')}
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
                    subtitleCount: captionCount,
                })}
            </Typography.Text>

            <ManageCaptionsModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
            />
        </Flex>
    );
}
