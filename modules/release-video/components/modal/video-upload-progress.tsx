import { formatFileSize2 } from '@/helpers/common';
import {
    UploadError,
    UploadPhase,
} from '@/modules/release-video/hooks/use-multipart-video-upload';
import {
    formatRemainingTime,
    formatUploadSpeed,
} from '@/modules/upload/utils/multipart-file';
import {
    CloseOutlined,
    LoadingOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import { Button, Progress, Space, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

const { Text } = Typography;

interface VideoUploadProgressProps {
    phase: UploadPhase;
    fileName?: string;
    fileSize?: number;
    percent: number;
    speed: number;
    loaded?: number;
    total?: number;
    completedParts: number;
    partCount: number;
    error?: UploadError | null;
    onRetry?: () => void;
    onCancel?: () => void;
    disabled?: boolean;
}

export default function VideoUploadProgress({
    phase,
    fileName,
    fileSize,
    percent,
    speed,
    loaded,
    total,
    completedParts,
    partCount,
    error,
    onRetry,
    onCancel,
    disabled = false,
}: VideoUploadProgressProps) {
    const messages = useTranslations();
    const locale = useLocale();

    if (phase === 'idle') return null;

    const remainingSeconds =
        speed > 0 && total && loaded !== undefined
            ? Math.max(0, Math.round((total - loaded) / speed))
            : 0;

    const remainingFormatted =
        remainingSeconds > 0
            ? formatRemainingTime(remainingSeconds, locale)
            : '';

    const renderStatusDescription = () => {
        switch (phase) {
            case 'initiating':
                return (
                    <Space size={6}>
                        <LoadingOutlined spin />
                        <Text>
                            {messages('releaseVideo.fields.initializing')}
                        </Text>
                    </Space>
                );
            case 'uploading':
                return (
                    <Space
                        direction="horizontal"
                        size={8}
                        className="flex-wrap"
                    >
                        <Text>
                            {messages('releaseVideo.fields.uploading')}
                        </Text>
                        {speed > 0 && (
                            <Text type="secondary">
                                {formatUploadSpeed(speed)}
                            </Text>
                        )}
                        {remainingFormatted && (
                            <Text type="secondary">
                                • {messages('common.remainingTime', {
                                    time: remainingFormatted,
                                })}
                            </Text>
                        )}
                    </Space>
                );
            case 'completing':
                return (
                    <Space size={6}>
                        <LoadingOutlined spin />
                        <Text>
                            {messages('releaseVideo.fields.completing')}
                        </Text>
                    </Space>
                );
            case 'saving':
                return (
                    <Space size={6}>
                        <LoadingOutlined spin />
                        <Text>
                            {messages('releaseVideo.fields.saving')}
                        </Text>
                    </Space>
                );
            case 'failed':
                return renderErrorMessage();
            case 'canceling':
                return (
                    <Space size={6}>
                        <LoadingOutlined spin />
                        <Text type="secondary">
                            {messages('common.processing')}
                        </Text>
                    </Space>
                );
            default:
                return null;
        }
    };

    const renderErrorMessage = () => {
        let errorText = messages('common.error');
        if (error?.code === 'MISSING_ETAG') {
            errorText = messages('releaseVideo.fields.missingEtag');
        } else if (error?.code === 'SESSION_EXPIRED') {
            errorText = messages('releaseVideo.fields.sessionExpired');
        } else if (error?.code === 'SAVE_DRAFT_FAILED') {
            errorText = messages('releaseVideo.fields.uploadedButNotSaved');
        } else if (error?.code === 'WRONG_RESUME_FILE') {
            errorText = messages('releaseVideo.fields.wrongResumeFile');
        } else if (error?.message) {
            errorText = error.message;
        }

        return <Text type="danger">{errorText}</Text>;
    };

    const isActionDisabled =
        disabled ||
        phase === 'completing' ||
        phase === 'saving' ||
        phase === 'canceling';

    return (
        <div className="mt-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="mb-1 flex items-center justify-between">
                <div className="mr-2 flex items-center gap-2 overflow-hidden">
                    <Text strong ellipsis className="max-w-xs">
                        {fileName || messages('releaseVideo.fields.videoFile')}
                    </Text>
                    {fileSize ? (
                        <Text type="secondary" className="shrink-0 text-xs">
                            ({formatFileSize2(fileSize)})
                        </Text>
                    ) : null}
                </div>
                <Text strong>{percent}%</Text>
            </div>

            <Progress
                percent={percent}
                status={
                    phase === 'failed'
                        ? 'exception'
                        : phase === 'completed'
                          ? 'success'
                          : 'active'
                }
                showInfo={false}
                size="small"
            />

            <div className="mt-2 flex items-center justify-between text-xs">
                <div>{renderStatusDescription()}</div>

                <Space size={8}>
                    {phase === 'failed' && (
                        <>
                            <Button
                                size="small"
                                icon={<RedoOutlined />}
                                onClick={onRetry}
                                disabled={disabled}
                            >
                                {messages('common.retry')}
                            </Button>
                            <Button
                                size="small"
                                danger
                                icon={<CloseOutlined />}
                                onClick={onCancel}
                                disabled={disabled}
                            >
                                {messages('common.cancelUpload')}
                            </Button>
                        </>
                    )}

                    {phase === 'uploading' && (
                        <Button
                            size="small"
                            danger
                            onClick={onCancel}
                            disabled={isActionDisabled}
                        >
                            {messages('common.cancel')}
                        </Button>
                    )}
                </Space>
            </div>
        </div>
    );
}
