import { Modal, Tabs, Typography } from 'antd';
import { useState } from 'react';
import { RELEASE_VIDEO_CAPTION_TYPE } from '../../enums';
import CaptionsTabContent from './captions-tab-content';
import SubtitlesTabContent from './subtitles-tab-content';
import UploadCaptionModal from './upload-caption-modal';

const { Text, Paragraph } = Typography;

interface ManageCaptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManageCaptionsModal({
    isOpen,
    onClose,
}: ManageCaptionsModalProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<RELEASE_VIDEO_CAPTION_TYPE>(
        RELEASE_VIDEO_CAPTION_TYPE.CAPTION
    );

    const tabItems = [
        {
            key: 'captions',
            label: 'Captions',
            children: (
                <CaptionsTabContent
                    onUploadClick={() => {
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.CAPTION);
                        setIsUploadModalOpen(true);
                    }}
                />
            ),
        },
        {
            key: 'subtitles',
            label: 'Subtitles',
            children: (
                <SubtitlesTabContent
                    onUploadClick={() => {
                        setUploadType(RELEASE_VIDEO_CAPTION_TYPE.SUBTITLE);
                        setIsUploadModalOpen(true);
                    }}
                />
            ),
        },
    ];

    return (
        <Modal
            title={
                <Text strong style={{ fontSize: 18 }}>
                    Captions and subtitles
                </Text>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={650}
            styles={{ body: { paddingTop: 12 } }}
        >
            <Paragraph style={{ marginBottom: 12, fontSize: 14 }}>
                Captions are in the video&apos;s language of performance.
                <br />
                Subtitles are in languages other than the audio language of the
                video.
                <br />
            </Paragraph>

            <Tabs defaultActiveKey="captions" items={tabItems} />

            <UploadCaptionModal
                isOpen={isUploadModalOpen}
                type={uploadType}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </Modal>
    );
}
