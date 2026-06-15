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
import { EtlJobData, ImportJobStatus } from '../../types/payload';

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
        switch (sourceType?.toUpperCase()) {
            case ETL_JOB_SOURCE_TYPE.FTP_SYNC_PERIOD:
                return 'blue';
            case ETL_JOB_SOURCE_TYPE.REPORT_UPLOAD:
                return 'purple';
            default:
                return 'default';
        }
    };

    const getStatusTagColor = (status: ImportJobStatus) => {
        switch (status) {
            case ImportJobStatus.PENDING:
                return 'warning';
            case ImportJobStatus.PROCESSING:
                return 'processing';
            case ImportJobStatus.COMPLETED:
                return 'success';
            case ImportJobStatus.FAILED:
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: ImportJobStatus) => {
        switch (status) {
            case ImportJobStatus.PENDING:
                return messages('reportConfigs.importResult.statusPending');
            case ImportJobStatus.PROCESSING:
                return messages('reportConfigs.importResult.statusProcessing');
            case ImportJobStatus.COMPLETED:
                return messages('reportConfigs.importResult.statusCompleted');
            case ImportJobStatus.FAILED:
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
                        {record?.sourceType}
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
            render: (status: ImportJobStatus) => (
                <Tag
                    color={getStatusTagColor(status)}
                    icon={
                        status === ImportJobStatus.PENDING ? (
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
