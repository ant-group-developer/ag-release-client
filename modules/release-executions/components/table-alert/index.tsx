import ExportExcelButton from '@/components/ui/button/export-button';
import { useBulkDownloadReleaseExecution } from '@/modules/release-executions/hooks/use-bulk-download';
import { useBulkMarkCompletedReleaseExecution } from '@/modules/release-executions/hooks/use-bulk-mark-completed';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

interface Props {
    selectedRowKeys: Key[];
    onSelectedRowKeysChange: (keys: Key[]) => void;
}

export default function ReleaseExecutionTableAlert({
    selectedRowKeys,
    onSelectedRowKeysChange,
}: Props) {
    const messages = useTranslations();
    const { bulkDownload, isPending: isDownloading } =
        useBulkDownloadReleaseExecution();
    const { bulkMarkCompleted, isPending: isMarkingCompleted } =
        useBulkMarkCompletedReleaseExecution();

    const handleExport = async () => {
        if (selectedRowKeys.length === 0) return;
        await bulkDownload(selectedRowKeys.map((key) => String(key)));
        onSelectedRowKeysChange([]);
    };

    const handleMarkCompleted = async () => {
        if (selectedRowKeys.length === 0) return;
        await bulkMarkCompleted(selectedRowKeys.map((key) => String(key)));
        onSelectedRowKeysChange([]);
    };

    return (
        <Space size={16}>
            <span>
                {selectedRowKeys.length} {messages('common.selected')}
            </span>
            <ExportExcelButton
                onClick={handleExport}
                disabled={selectedRowKeys.length === 0}
                loading={isDownloading}
            />
            <Popconfirm
                title={messages('releaseExecution.confirm.markCompletedTitle')}
                description={messages(
                    'releaseExecution.confirm.markCompletedDescription'
                )}
                onConfirm={handleMarkCompleted}
                disabled={selectedRowKeys.length === 0}
            >
                <Button
                    type="primary"
                    disabled={selectedRowKeys.length === 0}
                    loading={isMarkingCompleted}
                    icon={<CheckOutlined />}
                >
                    {messages('releaseExecution.action.markCompleted')}
                </Button>
            </Popconfirm>
        </Space>
    );
}
