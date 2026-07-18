import { ReleaseCaptionData } from '@/modules/releases/types';
import { Modal, Tabs, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RELEASE_VIDEO_CAPTION_TYPE } from '../../enums';
import CaptionsTabContent from './captions-tab-content';
import SubtitlesTabContent from './subtitles-tab-content';
import UploadCaptionModal from './upload-caption-modal';

const { Text, Paragraph } = Typography;

interface ManageCaptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    disabled?: boolean;
}

export default function ManageCaptionsModal({
    isOpen,
    onClose,
    disabled = false,
}: ManageCaptionsModalProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<RELEASE_VIDEO_CAPTION_TYPE>(
        RELEASE_VIDEO_CAPTION_TYPE.CAPTION
    );
    const [editingData, setEditingData] = useState<
        ReleaseCaptionData | undefined
    >();
    const messages = useTranslations();

    const tabItems = [
        {
            key: 'captions',
            label: messages('releaseVideo.captions.tabs.captions'),
            children: (
                <CaptionsTabContent
                    onUploadClick={() => {
                        if (disabled) return;
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.CAPTION);
                        setEditingData(undefined);
                        setIsUploadModalOpen(true);
                    }}
                    onEditClick={(record: ReleaseCaptionData) => {
                        if (disabled) return;
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.CAPTION);
                        setEditingData(record);
                        setIsUploadModalOpen(true);
                    }}
                    disabled={disabled}
                />
            ),
        },
        {
            key: 'subtitles',
            label: messages('releaseVideo.captions.tabs.subtitles'),
            children: (
                <SubtitlesTabContent
                    onUploadClick={() => {
                        if (disabled) return;
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.SUBTITLE);
                        setEditingData(undefined);
                        setIsUploadModalOpen(true);
                    }}
                    onEditClick={(record: ReleaseCaptionData) => {
                        if (disabled) return;
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.SUBTITLE);
                        setEditingData(record);
                        setIsUploadModalOpen(true);
                    }}
                    disabled={disabled}
                />
            ),
        },
    ];

    return (
        <Modal
            title={
                <Text strong style={{ fontSize: 18 }}>
                    {messages('releaseVideo.captions.title')}
                </Text>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={650}
            styles={{ body: { paddingTop: 12 } }}
        >
            <Paragraph style={{ marginBottom: 12, fontSize: 14 }}>
                <span
                    dangerouslySetInnerHTML={{
                        __html: messages('releaseVideo.captions.description'),
                    }}
                />
                <br />
                <span
                    dangerouslySetInnerHTML={{
                        __html: messages(
                            'releaseVideo.captions.descriptionSubtitle'
                        ),
                    }}
                />
                <br />
            </Paragraph>

            <Tabs defaultActiveKey="captions" items={tabItems} />

            <UploadCaptionModal
                isOpen={isUploadModalOpen}
                type={uploadType}
                initialData={editingData}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setEditingData(undefined);
                }}
            />
        </Modal>
    );
}
