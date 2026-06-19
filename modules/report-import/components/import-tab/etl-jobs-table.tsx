import IconButton from '@/components/ui/button/icon-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { formattedDate, formattedNumber, getIndex } from '@/helpers/common';
import { LoadingOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Eye } from 'lucide-react';
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
};

const SOURCE_TYPE_TAG_COLORS: Record<ETL_JOB_SOURCE_TYPE, string> = {
    [ETL_JOB_SOURCE_TYPE.REPORT_UPLOAD]: 'purple',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_PERIOD]: 'blue',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_ALL]: 'cyan',
    [ETL_JOB_SOURCE_TYPE.FTP_RETRY]: 'orange',
    [ETL_JOB_SOURCE_TYPE.FTP_AUTO_CRON]: 'green',
    [ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT]: 'geekblue',
    [ETL_JOB_SOURCE_TYPE.REPORT_RELEASE_DELETE]: 'red',
};

type Props = Omit<AppTableProps<EtlJobData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    onViewDetail: (record: EtlJobData) => void;
};

export default function EtlJobsTable({ onViewDetail, ...props }: Props) {
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
            width: 150,
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
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 160,
            align: 'center',
            render: (value) => formattedDate(value),
        },
        {
            key: 'actions',
            width: 90,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <IconButton onClick={() => onViewDetail(record)}>
                    <Eye size={SIZE_ICON} />
                </IconButton>
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
