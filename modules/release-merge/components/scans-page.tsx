'use client';

import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { formattedDate, formattedNumber, getIndex } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCreateReleaseMergeScan } from '../hooks/use-create-scan';
import { useGetReleaseMergeScans } from '../hooks/use-list-scans';
import { ReleaseMergeRun, ReleaseMergeRunFilter } from '../types';
import ReleaseMergeScanDrawer from './scan-drawer';
import { RunStatusTag, TriggerTag } from './status-tag';

export default function ReleaseMergeScansPage() {
    const messages = useTranslations();
    const [openScanId, setOpenScanId] = useState<string | null>(null);
    const { dataFilter, onChangePage } = useFilter<ReleaseMergeRunFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const { scanList, isFetching, refetch } =
        useGetReleaseMergeScans(dataFilter);
    const { createScan, isPending } = useCreateReleaseMergeScan();

    const columns: ColumnType<ReleaseMergeRun>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                getIndex(dataFilter.pageSize, dataFilter.page, index),
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (value) => formattedDate(value) || '-',
        },
        {
            title: messages('releaseMerge.trigger.label'),
            dataIndex: 'trigger',
            key: 'trigger',
            width: 160,
            render: (value) => <TriggerTag trigger={value} />,
        },
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (value) => <RunStatusTag status={value} />,
        },
        {
            title: messages('releaseMerge.totalCandidates'),
            dataIndex: 'totalCandidates',
            key: 'totalCandidates',
            width: 120,
            align: 'right',
            render: (value) => formattedNumber(value ?? 0),
        },
        {
            title: messages('releaseMerge.autoSafe'),
            dataIndex: 'autoSafeCandidates',
            key: 'autoSafeCandidates',
            width: 120,
            align: 'right',
            render: (value) => formattedNumber(value ?? 0),
        },
        {
            title: messages('releaseMerge.manual'),
            dataIndex: 'manualCandidates',
            key: 'manualCandidates',
            width: 120,
            align: 'right',
            render: (value) => formattedNumber(value ?? 0),
        },
        {
            title: messages('releaseMerge.applied'),
            dataIndex: 'appliedCandidates',
            key: 'appliedCandidates',
            width: 110,
            align: 'right',
            render: (value) => formattedNumber(value ?? 0),
        },
        {
            title: messages('releaseMerge.failed'),
            dataIndex: 'failedCandidates',
            key: 'failedCandidates',
            width: 110,
            align: 'right',
            render: (value) => formattedNumber(value ?? 0),
        },
        {
            title: messages('common.action'),
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Button size="small" onClick={() => setOpenScanId(record.id)}>
                    {messages('releaseMerge.viewDetail')}
                </Button>
            ),
        },
    ];

    return (
        <>
            <AppTable
                sticky
                rowKey="id"
                loading={isFetching}
                dataSource={scanList.items}
                columns={columns}
                title={() => (
                    <AppHeader className="app-header p-2">
                        <AppHeaderGroup>
                            <span className="text-sm text-gray-500">
                                {messages('releaseMerge.hint')}
                            </span>
                        </AppHeaderGroup>
                        <AppHeaderGroup position="end" className="flex-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={() => refetch()}
                                    loading={isFetching}
                                >
                                    {messages('common.refresh')}
                                </Button>
                                <CreateButton
                                    loading={isPending}
                                    text={messages('releaseMerge.createScan')}
                                    onClick={() =>
                                        createScan({
                                            onSuccess: (response) => {
                                                const run = response?.data as
                                                    | ReleaseMergeRun
                                                    | undefined;
                                                if (run?.id) setOpenScanId(run.id);
                                            },
                                        })
                                    }
                                />
                            </div>
                        </AppHeaderGroup>
                    </AppHeader>
                )}
            />
            <AppPagination
                align="end"
                current={scanList.metadata.page}
                pageSize={dataFilter.pageSize}
                total={scanList.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
            <ReleaseMergeScanDrawer
                open={!!openScanId}
                scanId={openScanId}
                onClose={() => setOpenScanId(null)}
            />
        </>
    );
}
