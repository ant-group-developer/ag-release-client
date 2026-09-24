import IconButton from '@/components/ui/button/icon-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { formattedDate, formattedNumber, getIndex } from '@/helpers/common';
import { LoadingOutlined } from '@ant-design/icons';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Tag, Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Eye, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ENRICH_SCAN_STATUS } from '../../enums';
import { EnrichScanSessionData } from '../../types/payload';

const ENRICH_SCAN_SESSION_STATUS_COLORS: Record<ENRICH_SCAN_STATUS, string> = {
    [ENRICH_SCAN_STATUS.PENDING]: 'warning',
    [ENRICH_SCAN_STATUS.PROCESSING]: 'processing',
    [ENRICH_SCAN_STATUS.COMPLETED]: 'success',
    [ENRICH_SCAN_STATUS.FAILED]: 'error',
    [ENRICH_SCAN_STATUS.CANCELED]: 'magenta',
};

type Props = Omit<AppTableProps<EnrichScanSessionData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    onViewDetail: (record: EnrichScanSessionData) => void;
    onViewHistory: (record: EnrichScanSessionData) => void;
};

export default function EnrichScanSessionsTable({
    onViewDetail,
    onViewHistory,
    ...props
}: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
    const { Text } = Typography;

    const getStatusTagColor = (status: string) => {
        return (
            ENRICH_SCAN_SESSION_STATUS_COLORS[status as ENRICH_SCAN_STATUS] ||
            'default'
        );
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case ENRICH_SCAN_STATUS.PENDING:
                return messages('reportConfigs.importResult.statusPending');
            case ENRICH_SCAN_STATUS.PROCESSING:
                return messages('reportConfigs.importResult.statusProcessing');
            case ENRICH_SCAN_STATUS.COMPLETED:
                return messages('reportConfigs.importResult.statusCompleted');
            case ENRICH_SCAN_STATUS.FAILED:
                return messages('reportConfigs.importResult.statusFailed');
            case ENRICH_SCAN_STATUS.CANCELED:
                return messages('reportConfigs.importResult.statusCanceled');
            default:
                return status;
        }
    };

    const renderNumber = (value: number | null | undefined) => {
        return value !== undefined && value !== null
            ? formattedNumber(value)
            : '-';
    };

    const renderBoolean = (value: boolean) => {
        return messages(value ? 'common.yes' : 'common.no');
    };

    const columns: ColumnType<EnrichScanSessionData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            width: 100,
            align: 'center',
            render: (status: string) => (
                <Tag
                    color={getStatusTagColor(status)}
                    icon={
                        status === ENRICH_SCAN_STATUS.PENDING ? (
                            <LoadingOutlined spin />
                        ) : undefined
                    }
                >
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title: messages('reportConfigs.enrichDataImport.totalReleases'),
            key: 'totalReleases',
            dataIndex: 'totalReleases',
            width: 130,
            align: 'center',
            render: renderNumber,
        },
        {
            title: messages('reportConfigs.enrichDataImport.processedReleases'),
            key: 'processedReleases',
            dataIndex: 'processedReleases',
            width: 150,
            align: 'center',
            render: renderNumber,
        },
        {
            title: messages('reportConfigs.enrichDataImport.successCount'),
            key: 'successCount',
            dataIndex: 'successCount',
            width: 120,
            align: 'center',
            render: renderNumber,
        },
        {
            title: messages('reportConfigs.enrichDataImport.failedCount'),
            key: 'failedCount',
            dataIndex: 'failedCount',
            width: 120,
            align: 'center',
            render: renderNumber,
        },
        {
            title: messages('reportConfigs.enrichDataImport.notFoundCount'),
            key: 'notFoundCount',
            dataIndex: 'notFoundCount',
            width: 130,
            align: 'center',
            render: renderNumber,
        },
        // {
        //     title: messages('reportConfigs.enrichDataImport.dryRun'),
        //     key: 'dryRun',
        //     dataIndex: 'dryRun',
        //     width: 100,
        //     align: 'center',
        //     render: renderBoolean,
        // },
        // {
        //     title: messages('reportConfigs.enrichDataImport.force'),
        //     key: 'force',
        //     dataIndex: 'force',
        //     width: 100,
        //     align: 'center',
        //     render: renderBoolean,
        // },
        // {
        //     title: messages('reportConfigs.enrichDataImport.limitCount'),
        //     key: 'limitCount',
        //     dataIndex: 'limitCount',
        //     width: 110,
        //     align: 'right',
        //     render: renderNumber,
        // },
        // {
        //     title: messages('reportConfigs.enrichDataImport.errorMessage'),
        //     key: 'errorMessage',
        //     dataIndex: 'errorMessage',
        //     width: 220,
        //     align: 'center',
        //     ellipsis: true,
        //     render: (value: string | null) =>
        //         value ? (
        //             <Tooltip title={value}>
        //                 <Text type="danger" ellipsis>
        //                     {value}
        //                 </Text>
        //             </Tooltip>
        //         ) : (
        //             '-'
        //         ),
        // },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 160,
            align: 'center',
            render: (value) => (value ? formattedDate(value) : '-'),
        },
        {
            key: 'actions',
            width: 100,
            align: 'center',
            fixed: isMobile ? undefined : 'right',
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    <Tooltip title={messages('common.viewDetail')}>
                        <IconButton onClick={() => onViewDetail(record)}>
                            <Eye size={SIZE_ICON} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={messages(
                            'reportConfigs.enrichDataImport.historyAction.viewLog'
                        )}
                    >
                        <IconButton onClick={() => onViewHistory(record)}>
                            <FileText size={SIZE_ICON} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            columns={columns}
            pagination={false}
            scroll={{ ...props.scroll, x: undefined }}
        />
    );
}
