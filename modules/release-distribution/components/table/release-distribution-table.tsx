import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import {
    RELEASE_CI_DATA_COLUMNS_DISPLAY,
    RELEASE_CI_DATA_STATUS,
    RELEASE_CI_IMPORT_STATUS,
} from '@/modules/release-distribution/enums';
import {
    ReleaseCiData,
    ReleaseCiDataFilter,
} from '@/modules/release-distribution/types';
import { RELEASES_TABLE_KEY } from '@/modules/releases/enums';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, theme, Tooltip, Typography } from 'antd';
import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAutoSyncCi } from '../../hooks/use-auto-sync-ci';
import DspStatusModal from './dsp-status-modal';

type Props = Omit<AppProTableProps<ReleaseCiData>, 'columns'> & {
    dataFilter: ReleaseCiDataFilter;
    onChangeFilter: OnChangeFilter<ReleaseCiDataFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseDistributionTable({
    onChangeFilter,
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isDspModalOpen, setIsDspModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ReleaseCiData | null>(
        null
    );
    const { autoSyncCi, isPending } = useAutoSyncCi();
    const [syncingId, setSyncingId] = useState<string | null>(null);

    const handleRetry = (id: string) => {
        setSyncingId(id);
        autoSyncCi({
            payload: { ids: [id] },
            onSuccess: () => setSyncingId(null),
            onError: () => setSyncingId(null),
        });
    };

    const column: ProColumns<ReleaseCiData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => {
                return (
                    <div data-stop-row-click="true">
                        {getIndex(
                            props?.pagination?.pageSize,
                            props?.pagination?.current,
                            index
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: RELEASES_TABLE_KEY.TITLE,
            ellipsis: true,
            align: 'left',
            width: 320,
            fixed: 'left',
            render: (value, record) => {
                const release = record.release;
                if (!release) return null;
                const title =
                    release.title +
                    (release.version ? ` [${release.version}]` : '');
                return (
                    <Link
                        href={`${APP_ROUTES.RELEASE_DISTRIBUTION}/${record.id}`}
                        className="cursor-pointer text-blue-500 hover:underline"
                    >
                        {title}
                    </Link>
                );
            },
        },
        {
            title: 'UPC',
            key: 'upc',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Typography.Text copyable={!!record?.release?.upc}>
                    {record?.release?.upc || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('release.dspLive'),
            key: 'dsp',
            dataIndex: RELEASES_TABLE_KEY.DSP,
            align: 'center',
            width: 150,
            render: (_, record) => {
                const items = record?.exportParsedData ?? [];
                const total = items.length;

                if (!items) return '-';
                return (
                    <div
                        data-stop-row-click="true"
                        className="flex justify-center"
                    >
                        <span
                            className="cursor-pointer hover:text-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(record);
                                setIsDspModalOpen(true);
                            }}
                        >
                            {total}
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('common.status'),
            dataIndex: RELEASE_CI_DATA_COLUMNS_DISPLAY.STATUS,
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASE_CI_DATA_COLUMNS_DISPLAY.STATUS
            ),
            render: (value, record) => {
                const status = record.status;
                const config = {
                    [RELEASE_CI_DATA_STATUS.EXISTS_ON_CI]: {
                        color: 'success',
                        label: messages('releaseCiData.status.existsOnCi'),
                    },
                    [RELEASE_CI_DATA_STATUS.NOT_FOUND_ON_CI]: {
                        color: 'error',
                        label: messages('releaseCiData.status.notFoundOnCi'),
                    },
                }[status] || {
                    color: 'default',
                    label: status || 'Unknown',
                };

                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },

        {
            title: messages(RELEASE_CI_DATA_COLUMNS_DISPLAY.IMPORT_STATUS),
            key: 'importStatus',
            align: 'left',
            width: 150,
            render: (_, record) => {
                const status = record.importParsedData?.status;
                const modify_time = record.importParsedData?.modify_time;

                if (!status) return '-';

                const config = {
                    [RELEASE_CI_IMPORT_STATUS.COMPLETE]: {
                        dotColor: 'bg-green-500',
                        textColor: 'text-green-600',
                    },
                    [RELEASE_CI_IMPORT_STATUS.PROBLEM]: {
                        dotColor: 'bg-red-500',
                        textColor: 'text-red-600',
                    },
                }[status as RELEASE_CI_IMPORT_STATUS] || {
                    dotColor: 'bg-slate-400',
                    textColor: 'text-slate-600',
                };

                return (
                    <div className="flex flex-col items-start gap-1 py-1">
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`h-2 w-2 rounded-full ${config.dotColor}`}
                            />
                            <span
                                className={`text-sm font-semibold capitalize ${config.textColor}`}
                            >
                                {status}
                            </span>
                        </div>
                        {modify_time && (
                            <span className="text-xs font-normal text-slate-500">
                                {formattedDate(
                                    modify_time,
                                    DATE_FORMAT.DATE_MINUTE
                                )}
                            </span>
                        )}
                    </div>
                );
            },
        },
        // {
        //     title: messages('common.createdAt'),
        //     dataIndex: RELEASE_CI_DATA_COLUMNS_DISPLAY.CREATED_AT,
        //     align: 'left',
        //     width: 160,
        //     sorter: true,
        //     defaultSortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         RELEASE_CI_DATA_COLUMNS_DISPLAY.CREATED_AT
        //     ),
        //     render: (value, record) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(
        //                 record.release?.createdAt || record.createdAt,
        //                 DATE_FORMAT.DATE_MINUTE
        //             )}{' '}
        //         </span>
        //     ),
        // },
        {
            title: messages('releaseCiData.latestSyncedAt'),
            dataIndex: RELEASE_CI_DATA_COLUMNS_DISPLAY.LATEST_SYNCED_AT,
            align: 'left',
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASE_CI_DATA_COLUMNS_DISPLAY.LATEST_SYNCED_AT
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record.latestSyncedAt,
                        DATE_FORMAT.DATE_MINUTE
                    )}{' '}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: RELEASE_CI_DATA_COLUMNS_DISPLAY.UPDATED_AT,
            align: 'left',
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                RELEASE_CI_DATA_COLUMNS_DISPLAY.UPDATED_AT
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(
                        record.release?.updatedAt || record.updatedAt,
                        DATE_FORMAT.DATE_MINUTE
                    )}{' '}
                </span>
            ),
        },
        {
            key: 'action',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (_, record) => {
                const isRowSyncing = isPending && syncingId === record.id;
                return (
                    <div
                        data-stop-row-click="true"
                        className="flex justify-center"
                    >
                        <Tooltip title={messages('common.resync')}>
                            <Button
                                type="text"
                                shape="circle"
                                icon={<RotateCw size={SIZE_ICON} />}
                                loading={isRowSyncing}
                                disabled={isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRetry(record.id);
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <AppProTable
                headerTitle={messages('release.list')}
                {...props}
                pagination={false}
                columns={column}
                rowClassName={'group'}
                className={`rounded-t-lg ${props?.className}`}
                style={{
                    backgroundColor: token.colorBgContainer,
                    ...props?.style,
                }}
                columnsState={{
                    persistenceKey: 'releases-distribution-table-columns',
                    persistenceType: 'sessionStorage',
                    defaultValue: {
                        status: { show: true },
                        latestSyncedAt: { show: true },
                        importStatus: { show: true },
                        createdAt: { show: true },
                        updatedAt: { show: true },
                        dsp: { show: true },
                    },
                }}
            />
            <DspStatusModal
                open={isDspModalOpen}
                onCancel={() => {
                    setIsDspModalOpen(false);
                    setSelectedRecord(null);
                }}
                record={selectedRecord}
            />
        </>
    );
}
