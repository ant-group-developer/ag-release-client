import IconButton from '@/components/ui/button/icon-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import {
    convertSecondsToHHMMSS,
    formattedDate,
    formattedNumber,
    getIndex,
} from '@/helpers/common';
import { LoadingOutlined } from '@ant-design/icons';
import { Space, Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Eye, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ETL_JOB_SOURCE_TYPE } from '../../enums';
import { EtlJobData, IMPORT_JOBS_STATUS } from '../../types/payload';

const SOURCE_TYPE_MESSAGE_KEYS: Record<ETL_JOB_SOURCE_TYPE, string> = {
    [ETL_JOB_SOURCE_TYPE.REPORT_UPLOAD]:
        'reportConfigs.importResult.sourceTypeReportUpload',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_PERIOD]:
        'reportConfigs.importResult.sourceTypeFtpSyncPeriod',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_ALL]:
        'reportConfigs.importResult.sourceTypeFtpSyncAll',
    [ETL_JOB_SOURCE_TYPE.FTP_RETRY]:
        'reportConfigs.importResult.sourceTypeFtpRetry',
    [ETL_JOB_SOURCE_TYPE.FTP_AUTO_CRON]:
        'reportConfigs.importResult.sourceTypeFtpAutoCron',
    [ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT]:
        'reportConfigs.importResult.sourceTypeAnalyticsReportExport',
    [ETL_JOB_SOURCE_TYPE.REPORT_RELEASE_DELETE]:
        'reportConfigs.importResult.sourceTypeReportReleaseDelete',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_R2_SYNC]:
        'reportConfigs.importResult.sourceTypeSpotifyR2Sync',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_EXPORT_TRIGGER]:
        'reportConfigs.importResult.sourceTypeSpotifyExportTrigger',
};

const SOURCE_TYPE_TAG_COLORS: Record<ETL_JOB_SOURCE_TYPE, string> = {
    [ETL_JOB_SOURCE_TYPE.REPORT_UPLOAD]: 'purple',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_PERIOD]: 'blue',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_ALL]: 'cyan',
    [ETL_JOB_SOURCE_TYPE.FTP_RETRY]: 'orange',
    [ETL_JOB_SOURCE_TYPE.FTP_AUTO_CRON]: 'green',
    [ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT]: 'geekblue',
    [ETL_JOB_SOURCE_TYPE.REPORT_RELEASE_DELETE]: 'red',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_R2_SYNC]: 'volcano',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_EXPORT_TRIGGER]: 'gold',
};

type Props = Omit<AppTableProps<EtlJobData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    onViewDetail: (record: EtlJobData) => void;
    onViewStatusDetail?: (record: EtlJobData) => void;
};

export default function EtlJobsTable({
    onViewDetail,
    onViewStatusDetail,
    ...props
}: Props) {
    const messages = useTranslations();

    const getSourceTypeTagColor = (sourceType: string) => {
        return (
            SOURCE_TYPE_TAG_COLORS[
                sourceType?.toUpperCase() as ETL_JOB_SOURCE_TYPE
            ] || 'default'
        );
    };

    const getSourceTypeLabel = (sourceType: string) => {
        const sourceTypeKey =
            SOURCE_TYPE_MESSAGE_KEYS[
                sourceType?.toUpperCase() as ETL_JOB_SOURCE_TYPE
            ];

        return sourceTypeKey ? messages(sourceTypeKey as any) : sourceType;
    };

    const getStatusTagColor = (status: IMPORT_JOBS_STATUS) => {
        switch (status) {
            case IMPORT_JOBS_STATUS.PENDING:
            case IMPORT_JOBS_STATUS.QUEUED:
                return 'warning';
            case IMPORT_JOBS_STATUS.PROCESSING:
                return 'processing';
            case IMPORT_JOBS_STATUS.COMPLETED:
                return 'success';
            case IMPORT_JOBS_STATUS.FAILED:
                return 'error';
            case IMPORT_JOBS_STATUS.CANCELLED:
                return 'magenta';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: IMPORT_JOBS_STATUS) => {
        switch (status) {
            case IMPORT_JOBS_STATUS.PENDING:
                return messages('reportConfigs.importResult.statusPending');
            case IMPORT_JOBS_STATUS.QUEUED:
                return messages('reportConfigs.importResult.statusQueued');
            case IMPORT_JOBS_STATUS.PROCESSING:
                return messages('reportConfigs.importResult.statusProcessing');
            case IMPORT_JOBS_STATUS.COMPLETED:
                return messages('reportConfigs.importResult.statusCompleted');
            case IMPORT_JOBS_STATUS.FAILED:
                return messages('reportConfigs.importResult.statusFailed');
            case IMPORT_JOBS_STATUS.CANCELLED:
                return messages('reportConfigs.importResult.statusCanceled');
            default:
                return status;
        }
    };

    const columns: ColumnType<EtlJobData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('reportConfigs.importResult.sourceType'),
            key: 'sourceType',
            dataIndex: 'sourceType',
            width: 220,
            ellipsis: true,
            render: (sourceType: string, record) =>
                record?.sourceType ? (
                    <Tag color={getSourceTypeTagColor(record?.sourceType)}>
                        {getSourceTypeLabel(record?.sourceType)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('common.fileName'),
            key: 'fileName',
            width: 250,
            ellipsis: true,
            render: (_, record) => record.file?.name || '-',
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            width: 130,
            align: 'center',
            render: (status: IMPORT_JOBS_STATUS) => (
                <Tag
                    color={getStatusTagColor(status)}
                    icon={
                        status === IMPORT_JOBS_STATUS.PENDING ||
                        status === IMPORT_JOBS_STATUS.QUEUED ? (
                            <LoadingOutlined spin />
                        ) : undefined
                    }
                >
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: messages('reportConfigs.importResult.totalRows'),
            key: 'totalRows',
            width: 120,
            align: 'left',
            render: (_, record) =>
                record.rows?.total !== undefined && record.rows?.total !== null
                    ? formattedNumber(record.rows.total)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.processedRows'),
            key: 'processedRows',
            width: 120,
            align: 'left',
            render: (_, record) =>
                record.rows?.processed !== undefined &&
                record.rows?.processed !== null
                    ? formattedNumber(record.rows.processed)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.skippedRows'),
            key: 'skippedRows',
            width: 120,
            align: 'left',
            render: (_, record) =>
                record.rows?.skipped !== undefined &&
                record.rows?.skipped !== null
                    ? formattedNumber(record.rows.skipped)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.errorRows'),
            key: 'errorRows',
            width: 120,
            align: 'left',
            render: (_, record) =>
                record.rows?.errors !== undefined &&
                record.rows?.errors !== null
                    ? formattedNumber(record.rows.errors)
                    : '-',
        },
        {
            title: messages('common.executionTime'),
            key: 'duration',
            dataIndex: 'durationMs',
            width: 160,
            align: 'left',
            render: (value: number) =>
                value !== undefined && value !== null
                    ? convertSecondsToHHMMSS(value / 1000)
                    : '-',
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 160,
            align: 'left',
            render: (value) => formattedDate(value),
        },
        {
            title: messages('common.action'),
            key: 'actions',
            width: 110,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip
                        title={
                            messages(
                                'reportConfigs.importResult.viewLog' as any
                            ) || 'View Logs'
                        }
                    >
                        <IconButton onClick={() => onViewDetail(record)}>
                            <Eye size={SIZE_ICON} />
                        </IconButton>
                    </Tooltip>
                    {record.rows?.total !== undefined &&
                        record.rows.total > 0 && (
                            <Tooltip
                                title={
                                    messages(
                                        'reportConfigs.importResult.viewStatusDetail' as any
                                    ) || 'View Status Detail'
                                }
                            >
                                <IconButton
                                    onClick={() => onViewStatusDetail?.(record)}
                                >
                                    <FileText size={SIZE_ICON} />
                                </IconButton>
                            </Tooltip>
                        )}
                </Space>
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}