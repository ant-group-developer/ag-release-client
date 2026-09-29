'use client';

import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { formattedNumber } from '@/helpers/common';
import { Alert, Button, Drawer, Modal, Select, Space, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
    ReleaseMergeItemClassification,
    ReleaseMergeItemStatus,
    ReleaseMergeRunStatus,
} from '../enums';
import { useApplyReleaseMerge } from '../hooks/use-apply-merge';
import { useGetReleaseMergeScan } from '../hooks/use-get-scan';
import { useGetReleaseMergeItems } from '../hooks/use-list-items';
import { ReleaseMergeItem, ReleaseMergeItemFilter } from '../types';
import ReleaseMergeItemModal from './item-modal';
import ReasonTags, { CodeList } from './reason-tags';
import { ClassificationTag, ItemStatusTag, RunStatusTag } from './status-tag';

type Props = {
    scanId?: string | null;
    open: boolean;
    onClose: () => void;
};

const DEFAULT_FILTER: ReleaseMergeItemFilter = {
    page: 1,
    pageSize: PAGE_SIZE,
};

export default function ReleaseMergeScanDrawer({
    scanId,
    open,
    onClose,
}: Props) {
    const messages = useTranslations();
    const [filter, setFilter] = useState<ReleaseMergeItemFilter>(DEFAULT_FILTER);
    const [detailItemId, setDetailItemId] = useState<string | null>(null);
    const { scan } = useGetReleaseMergeScan(scanId, open);
    const { itemList, isFetching } = useGetReleaseMergeItems(
        scanId,
        filter,
        scan?.status
    );
    const { applyMerge, isPending } = useApplyReleaseMerge();

    useEffect(() => {
        if (open) {
            setFilter(DEFAULT_FILTER);
            setDetailItemId(null);
        }
    }, [open, scanId]);

    const canApply =
        scan?.status === ReleaseMergeRunStatus.READY ||
        scan?.status === ReleaseMergeRunStatus.PARTIALLY_APPLIED;
    const isRunning =
        scan?.status === ReleaseMergeRunStatus.SCANNING ||
        scan?.status === ReleaseMergeRunStatus.APPLYING;

    const applyItems = (payload: {
        selectAll: boolean;
        itemIds?: string[];
    }) => {
        if (!scanId) return;
        applyMerge({ scanId, payload });
    };

    const confirmApply = (payload: {
        selectAll: boolean;
        itemIds?: string[];
    }) => {
        Modal.confirm({
            title: payload.selectAll
                ? messages('releaseMerge.confirmApplyAllTitle')
                : messages('releaseMerge.confirmApplyTitle'),
            content: payload.selectAll
                ? messages('releaseMerge.confirmApplyAllDescription')
                : messages('releaseMerge.confirmApplyDescription'),
            okText: messages('releaseMerge.apply'),
            cancelText: messages('common.cancel'),
            onOk: () => applyItems(payload),
        });
    };

    const columns: ColumnType<ReleaseMergeItem>[] = [
        {
            title: messages('releaseMerge.sourceRelease'),
            dataIndex: 'sourceReleaseId',
            key: 'sourceReleaseId',
            width: 220,
            ellipsis: true,
            render: (value: string) => (
                <Typography.Text copyable ellipsis={{ tooltip: value }}>
                    {value}
                </Typography.Text>
            ),
        },
        {
            title: messages('releaseMerge.targetRelease'),
            dataIndex: 'targetReleaseId',
            key: 'targetReleaseId',
            width: 220,
            ellipsis: true,
            render: (value?: string | null) =>
                value ? (
                    <Typography.Text copyable ellipsis={{ tooltip: value }}>
                        {value}
                    </Typography.Text>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('releaseMerge.classification.label'),
            dataIndex: 'classification',
            key: 'classification',
            width: 140,
            render: (value) => <ClassificationTag classification={value} />,
        },
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (value) => <ItemStatusTag status={value} />,
        },
        {
            title: messages('releaseMerge.sharedIsrc'),
            dataIndex: 'sharedIsrcs',
            key: 'sharedIsrcs',
            width: 220,
            render: (value: string[]) => <CodeList codes={value} />,
        },
        {
            title: messages('assetImport.merge.reason'),
            dataIndex: 'reasonCodes',
            key: 'reasonCodes',
            width: 260,
            render: (value: string[]) => <ReasonTags codes={value} />,
        },
        {
            title: messages('common.action'),
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => {
                const canApplyItem =
                    canApply &&
                    record.classification ===
                        ReleaseMergeItemClassification.AUTO_SAFE &&
                    record.status === ReleaseMergeItemStatus.PENDING;
                return (
                    <Space>
                        <Button
                            size="small"
                            onClick={() => setDetailItemId(record.id)}
                        >
                            {messages('releaseMerge.viewDetail')}
                        </Button>
                        {canApplyItem && (
                            <Button
                                size="small"
                                type="primary"
                                loading={isPending}
                                onClick={() =>
                                    confirmApply({
                                        selectAll: false,
                                        itemIds: [record.id],
                                    })
                                }
                            >
                                {messages('releaseMerge.apply')}
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width="100vw"
            destroyOnHidden
            title={
                <div className="flex items-center gap-2">
                    <span>{messages('releaseMerge.scanDetail')}</span>
                    <RunStatusTag status={scan?.status} />
                </div>
            }
        >
            <div className="mb-3 flex flex-wrap gap-4 text-sm">
                <span>
                    {messages('releaseMerge.totalCandidates')}:{' '}
                    {formattedNumber(scan?.totalCandidates ?? 0)}
                </span>
                <span>
                    {messages('releaseMerge.autoSafe')}:{' '}
                    {formattedNumber(scan?.autoSafeCandidates ?? 0)}
                </span>
                <span>
                    {messages('releaseMerge.manual')}:{' '}
                    {formattedNumber(scan?.manualCandidates ?? 0)}
                </span>
                <span>
                    {messages('releaseMerge.applied')}:{' '}
                    {formattedNumber(scan?.appliedCandidates ?? 0)}
                </span>
                <span>
                    {messages('releaseMerge.failed')}:{' '}
                    {formattedNumber(scan?.failedCandidates ?? 0)}
                </span>
            </div>
            {isRunning && (
                <Alert
                    className="!mb-3"
                    type="info"
                    showIcon
                    message={messages('releaseMerge.pollingHint')}
                />
            )}
            {scan?.errorMessage && (
                <Alert
                    className="!mb-3"
                    type="error"
                    showIcon
                    message={scan.errorMessage}
                />
            )}
            <AppTable
                dataSource={itemList.items}
                loading={isFetching}
                columns={columns}
                rowKey="id"
                pagination={false}
                title={() => (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Space wrap>
                            <Select
                                allowClear
                                className="!w-44"
                                placeholder={messages(
                                    'releaseMerge.classification.label'
                                )}
                                value={filter.classification}
                                options={Object.values(
                                    ReleaseMergeItemClassification
                                ).map((value) => ({
                                    value,
                                    label: messages(
                                        `releaseMerge.classification.${value}` as never
                                    ),
                                }))}
                                onChange={(value) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        classification: value,
                                        page: 1,
                                    }))
                                }
                            />
                            <Select
                                allowClear
                                className="!w-44"
                                placeholder={messages('common.status')}
                                value={filter.status}
                                options={Object.values(
                                    ReleaseMergeItemStatus
                                ).map((value) => ({
                                    value,
                                    label: messages(
                                        `releaseMerge.itemStatus.${value}` as never
                                    ),
                                }))}
                                onChange={(value) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        status: value,
                                        page: 1,
                                    }))
                                }
                            />
                        </Space>
                        <Button
                            type="primary"
                            disabled={!canApply}
                            loading={isPending}
                            onClick={() => confirmApply({ selectAll: true })}
                        >
                            {messages('releaseMerge.applyAllSafe')}
                        </Button>
                    </div>
                )}
            />
            <AppPagination
                align="end"
                current={itemList.metadata.page}
                pageSize={filter.pageSize}
                total={itemList.metadata.totalItems}
                showTotalText
                showSizeChanger
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onChange={(page, pageSize) =>
                    setFilter((prev) => ({ ...prev, page, pageSize }))
                }
            />
            <ReleaseMergeItemModal
                open={!!detailItemId}
                scanId={scanId}
                itemId={detailItemId}
                onClose={() => setDetailItemId(null)}
            />
        </Drawer>
    );
}
