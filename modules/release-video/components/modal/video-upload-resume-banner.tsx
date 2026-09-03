import { formatFileSize2 } from '@/helpers/common';
import { VideoUploadResumeDescriptor } from '@/modules/upload/types/data';
import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';

const { Text } = Typography;

interface VideoUploadResumeBannerProps {
    descriptor: VideoUploadResumeDescriptor;
    onResumeFileSelected: (file: File) => void;
    onCancel: () => void;
    disabled?: boolean;
}

export default function VideoUploadResumeBanner({
    descriptor,
    onResumeFileSelected,
    onCancel,
    disabled = false,
}: VideoUploadResumeBannerProps) {
    const messages = useTranslations();

    return (
        <Alert
            type="warning"
            showIcon
            className="mb-3"
            message={
                <Text strong>
                    {messages('releaseVideo.fields.reselectToResume')}
                </Text>
            }
            description={
                <div className="mt-1 flex flex-col gap-2">
                    <Text type="secondary" className="text-xs">
                        {descriptor.fileName} (
                        {formatFileSize2(descriptor.fileSize)})
                    </Text>
                    <Space size={8}>
                        <Upload
                            accept="video/*"
                            showUploadList={false}
                            disabled={disabled}
                            beforeUpload={(file) => {
                                onResumeFileSelected(file);
                                return false;
                            }}
                        >
                            <Button
                                size="small"
                                type="primary"
                                icon={<UploadOutlined />}
                                disabled={disabled}
                            >
                                {messages('common.resume')}
                            </Button>
                        </Upload>
                        <Button
                            size="small"
                            onClick={onCancel}
                            disabled={disabled}
                        >
                            {messages('common.cancel')}
                        </Button>
                    </Space>
                </div>
            }
        />
    );
}
