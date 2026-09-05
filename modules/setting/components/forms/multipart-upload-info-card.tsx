import { Card, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { MultipartUploadConfig } from '../../types';

const { Text, Paragraph, Title } = Typography;

interface Props {
    config?: MultipartUploadConfig;
}

export default function MultipartUploadInfoCard({ config }: Props) {
    const messages = useTranslations();

    const formatSeconds = (seconds?: number) => {
        if (seconds == null) return messages('common.none');
        if (seconds >= 86400 && seconds % 86400 === 0) {
            return `${seconds.toLocaleString()} ${messages('common.seconds')} (${seconds / 86400}d)`;
        }
        if (seconds >= 3600 && seconds % 3600 === 0) {
            return `${seconds.toLocaleString()} ${messages('common.seconds')} (${seconds / 3600}h)`;
        }
        return `${seconds.toLocaleString()} ${messages('common.seconds')}`;
    };

    const formatMb = (mb?: number) => {
        if (mb == null) return messages('common.none');
        if (mb >= 1024) {
            const gb = (mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1);
            return `${mb.toLocaleString()} MB (${gb} GB)`;
        }
        return `${mb.toLocaleString()} MB`;
    };

    return (
        <Card className="mb-6 rounded-lg shadow-sm">
            <div className="flex flex-col gap-2">
                <Title level={5} className="!mb-1">
                    {messages('setting.multipartUpload.infoTitle')}
                </Title>
                <Paragraph type="secondary" className="!mb-4 text-sm">
                    {messages('setting.multipartUpload.infoDesc')}
                </Paragraph>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div className="flex flex-col gap-1 p-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <Text type="secondary" className="text-xs">
                            {messages('setting.multipartUpload.partSizeMb')}
                        </Text>
                        <Text strong className="text-base">
                            {config?.partSizeMb != null
                                ? `${config.partSizeMb} MB`
                                : messages('common.none')}
                        </Text>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <Text type="secondary" className="text-xs">
                            {messages('setting.multipartUpload.maxFileSizeMb')}
                        </Text>
                        <Text strong className="text-base">
                            {formatMb(config?.maxFileSizeMb)}
                        </Text>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <Text type="secondary" className="text-xs">
                            {messages('setting.multipartUpload.presignExpiresSeconds')}
                        </Text>
                        <Text strong className="text-base">
                            {formatSeconds(config?.presignExpiresSeconds)}
                        </Text>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <Text type="secondary" className="text-xs">
                            {messages('setting.multipartUpload.sessionExpiresSeconds')}
                        </Text>
                        <Text strong className="text-base">
                            {formatSeconds(config?.sessionExpiresSeconds)}
                        </Text>
                    </div>
                </div>
            </div>
        </Card>
    );
}
