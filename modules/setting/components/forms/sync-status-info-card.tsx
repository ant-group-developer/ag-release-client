import { Button, Card, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { ReleaseCiStatusSyncSchedule } from '../../types';

const { Text } = Typography;

interface Props {
    schedule?: ReleaseCiStatusSyncSchedule;
    isRunNowLoading: boolean;
    onRunNow: () => void;
}

export default function SyncStatusInfoCard({
    schedule,
    isRunNowLoading,
    onRunNow,
}: Props) {
    const messages = useTranslations();

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return messages('common.none');
        return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
    };

    return (
        <Card
            title={messages('setting.syncStatus.executionStatus')}
            extra={
                <Button
                    type="primary"
                    loading={isRunNowLoading}
                    disabled={!schedule?.syncStatusEnabled}
                    onClick={onRunNow}
                >
                    {messages('setting.syncStatus.runNow')}
                </Button>
            }
            className="mb-6 rounded-lg shadow-sm"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                    <Text type="secondary" className="block mb-2 text-sm">
                        {messages('setting.syncStatus.currentStatus')}
                    </Text>
                    <div>
                        {schedule?.isRunning ? (
                            <Tag color="processing" className="rounded-full px-3 py-0.5 font-medium">
                                {messages('setting.syncStatus.running')}
                            </Tag>
                        ) : (
                            <Tag color="default" className="rounded-full px-3 py-0.5 font-medium">
                                {messages('setting.syncStatus.idle')}
                            </Tag>
                        )}
                    </div>
                </div>

                <div>
                    <Text type="secondary" className="block mb-2 text-sm">
                        {messages('setting.syncStatus.lastRunAt')}
                    </Text>
                    <Text strong className="text-sm">
                        {formatDate(schedule?.lastRunAt)}
                    </Text>
                </div>

                <div>
                    <Text type="secondary" className="block mb-2 text-sm">
                        {messages('setting.syncStatus.lastFinishedAt')}
                    </Text>
                    <Text strong className="text-sm">
                        {formatDate(schedule?.lastFinishedAt)}
                    </Text>
                </div>
            </div>
        </Card>
    );
}
