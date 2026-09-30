import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { getIndex } from '@/helpers/common';
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Spin, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useGetYoutubeChannelSyncRunLogs } from '../../hooks/use-get-youtube-channel-sync-run-logs';
import { useGetYoutubeChannelSyncRuns } from '../../hooks/use-get-youtube-channel-sync-runs';
import { useRunYoutubeChannelSync } from '../../hooks/use-run-youtube-channel-sync';
import { YoutubeChannelSyncRun, YoutubeChannelSyncRunLog } from '../../types';
import ChannelThumbImage from '../image/channel-thumb-image';

interface YoutubeChannelSyncRunsModalProps {
    open: boolean;
    onCancel: () => void;
}

type PaginationState = {
    page: number;
    pageSize: number;
};

const TruncatedText = ({ value }: { value?: string | null }) => {
    const content = value || '-';

    return (
        <Tooltip title={content}>
            <div className="truncate">{content}</div>
        </Tooltip>
    );
};

const YoutubeChannelSyncRunLogsModal = ({
    run,
    onCancel,
}: {
    run: YoutubeChannelSyncRun;
    onCancel: () => void;
}) => {
    const messages = useTranslations();
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        pageSize: 20,
    });
    const { youtubeChannelSyncRunLogs, isFetching } =
        useGetYoutubeChannelSyncRunLogs({
            ...pagination,
            runId: run.id,
        });

    const onChangePage = useCallback((page: number, pageSize: number) => {
        setPagination((previous) => ({
            page: pageSize === previous.pageSize ? page : 1,
            pageSize,
        }));
    }, []);

    const columns: ColumnType<YoutubeChannelSyncRunLog>[] = [
        {
            title: messages('common.iNo'),
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                getIndex(pagination.pageSize, pagination.page, index),
        },
        {
            title: messages('channel.label'),
            key: 'channel',
            width: 200,
            ellipsis: { showTitle: false },
            render: (_, record) => (
                <Space className="max-w-full">
                    <ChannelThumbImage
                        thumbUrl={record.channel?.thumbUrl}
                        name={record.channel?.name || record.channelId}
                    />
                    <Tooltip title={record.channel?.name || record.channelId}>
                        <div className="truncate font-medium">
                            {record.channel?.name || record.channelId}
                        </div>
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.fieldName'),
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: 100,
            ellipsis: { showTitle: false },
            render: (value) => <TruncatedText value={value} />,
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.previousValue'),
            dataIndex: 'previousValue',
            key: 'previousValue',
            width: 150,
            ellipsis: { showTitle: false },
            render: (value) => <TruncatedText value={value} />,
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.nextValue'),
            dataIndex: 'nextValue',
            key: 'nextValue',
            width: 300,
            ellipsis: { showTitle: false },
            render: (value) => <TruncatedText value={value} />,
        },
    ];

    return (
        <Modal
            title={messages('channel.youtubeSyncRuns.detailTitle')}
            open
            onCancel={onCancel}
            footer={null}
            width="85vw"
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
            }}
            centered
        >
            <Spin spinning={isFetching}>
                <div className="mt-4 overflow-hidden rounded-lg border">
                    <AppTable<YoutubeChannelSyncRunLog>
                        columns={columns}
                        dataSource={youtubeChannelSyncRunLogs.items}
                        rowKey="id"
                        pagination={false}
                        tableLayout="fixed"
                        scroll={{ x: undefined }}
                    />
                    <AppPagination
                        current={youtubeChannelSyncRunLogs.metadata.page}
                        pageSize={pagination.pageSize}
                        total={youtubeChannelSyncRunLogs.metadata.totalItems}
                        onChange={onChangePage}
                        showTotalText
                        hideOnSinglePage={false}
                    />
                </div>
            </Spin>
        </Modal>
    );
};

export default function YoutubeChannelSyncRunsModal({
    open,
    onCancel,
}: YoutubeChannelSyncRunsModalProps) {
    const messages = useTranslations();
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        pageSize: 20,
    });
    const [selectedRun, setSelectedRun] = useState<YoutubeChannelSyncRun>();
    const { youtubeChannelSyncRuns, isFetching } = useGetYoutubeChannelSyncRuns(
        pagination,
        open
    );
    const { runYoutubeChannelSync, isPending } = useRunYoutubeChannelSync();

    const onChangePage = useCallback((page: number, pageSize: number) => {
        setPagination((previous) => ({
            page: pageSize === previous.pageSize ? page : 1,
            pageSize,
        }));
    }, []);

    const columns: ColumnType<YoutubeChannelSyncRun>[] = [
        {
            title: messages('common.iNo'),
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                getIndex(pagination.pageSize, pagination.page, index),
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.totalChannels'),
            dataIndex: 'totalChannels',
            key: 'totalChannels',
            width: 160,
            align: 'center',
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.updatedChannels'),
            dataIndex: 'updatedChannels',
            key: 'updatedChannels',
            width: 170,
            align: 'center',
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.updatedFields'),
            dataIndex: 'updatedFields',
            key: 'updatedFields',
            width: 150,
            align: 'center',
        },
        {
            title: messages('channel.youtubeSyncRuns.columns.failedChannels'),
            dataIndex: 'failedChannels',
            key: 'failedChannels',
            width: 160,
            align: 'center',
        },
        {
            title: messages('common.action'),
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title={messages('common.viewDetail')}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedRun(record)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center justify-between pr-10">
                        <span>{messages('channel.youtubeSyncRuns.title')}</span>
                        <Button
                            type="primary"
                            size="small"
                            icon={<PlayCircleOutlined />}
                            loading={isPending}
                            onClick={() =>
                                runYoutubeChannelSync({ force: true })
                            }
                        >
                            {messages('channel.youtubeSyncRuns.runButton')}
                        </Button>
                    </div>
                }
                open={open}
                onCancel={onCancel}
                footer={null}
                width="85vw"
                styles={{
                    body: {
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    },
                }}
                centered
            >
                <Spin spinning={isFetching}>
                    <div className="mt-4 overflow-hidden rounded-lg border">
                        <AppTable<YoutubeChannelSyncRun>
                            columns={columns}
                            dataSource={youtubeChannelSyncRuns.items}
                            rowKey="id"
                            pagination={false}
                            tableLayout="fixed"
                            scroll={{ x: undefined }}
                        />
                        <AppPagination
                            current={youtubeChannelSyncRuns.metadata.page}
                            pageSize={pagination.pageSize}
                            total={youtubeChannelSyncRuns.metadata.totalItems}
                            onChange={onChangePage}
                            showTotalText
                            hideOnSinglePage={false}
                        />
                    </div>
                </Spin>
            </Modal>

            {selectedRun && (
                <YoutubeChannelSyncRunLogsModal
                    run={selectedRun}
                    onCancel={() => setSelectedRun(undefined)}
                />
            )}
        </>
    );
}
