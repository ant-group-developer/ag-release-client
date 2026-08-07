'use client';

import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { getIndex } from '@/helpers/common';
import { Button, Select, Space, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import {
    AssetImportAction,
    AssetImportBatchStatus,
    AssetImportItemStatus,
    AssetImportMatchType,
    NON_SELECTABLE_ASSET_IMPORT_ACTIONS,
} from '../../enums';
import { useApplyAssetImport } from '../../hooks/use-apply-asset-import';
import { useGetListAssetImportItem } from '../../hooks/use-get-list-items';
import { AssetImportItemFilter } from '../../types';
import { AssetImportItemData } from '../../types/payload';
import ItemActionTag from '../tag/item-action-tag';
import ItemStatusTag from '../tag/item-status-tag';
import ChangeDiff from './change-diff';

type Props = {
    open: boolean;
    batchId?: string | null;
    batchStatus?: string | null;
    onApplyStart?: () => void;
};

const DEFAULT_FILTER: AssetImportItemFilter = {
    page: 1,
    pageSize: PAGE_SIZE,
};

export default function ItemsTable({
    open,
    batchId,
    batchStatus,
    onApplyStart,
}: Props) {
    const messages = useTranslations();

    const [filter, setFilter] = useState<AssetImportItemFilter>(DEFAULT_FILTER);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const { assetImportItemData, isFetching } = useGetListAssetImportItem(
        batchId,
        filter
    );
    const { applyAssetImport, isPending: isApplying } = useApplyAssetImport();

    const items = assetImportItemData.items;
    const metadata = assetImportItemData.metadata;

    // Reset local filter/selection whenever the drawer (re)opens or the batch changes
    useEffect(() => {
        if (open) {
            setSelectedRowKeys([]);
            setFilter(DEFAULT_FILTER);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, batchId]);

    const canApply =
        batchStatus === AssetImportBatchStatus.SCANNED ||
        batchStatus === AssetImportBatchStatus.PARTIALLY_APPLIED;

    const onChangeFilter = (value: Partial<AssetImportItemFilter>) => {
        setFilter((prev) => ({ ...prev, ...value, page: 1 }));
    };

    const onChangePage = (page: number, pageSize: number) => {
        setFilter((prev) => ({ ...prev, page, pageSize }));
    };

    const handleApply = (payload: { selectAll: boolean; itemIds?: string[] }) => {
        if (!batchId) return;

        onApplyStart?.();

        applyAssetImport({
            batchId,
            payload,
            onSuccess: () => {
                setSelectedRowKeys([]);
            },
        });
    };

    const actionOptions = Object.values(AssetImportAction).map((action) => ({
        label: messages(`assetImport.item.action.${action}` as any),
        value: action,
    }));

    const statusOptions = Object.values(AssetImportItemStatus).map((status) => ({
        label: messages(`assetImport.item.status.${status}` as any),
        value: status,
    }));

    const matchTypeOptions = Object.values(AssetImportMatchType).map(
        (matchType) => ({
            label: matchType,
            value: matchType,
        })
    );

    const columns: ColumnType<AssetImportItemData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => getIndex(filter.pageSize, filter.page, index),
        },
        {
            title: messages('assetImport.item.rowNumber'),
            dataIndex: 'rowNumber',
            key: 'rowNumber',
            width: 90,
            align: 'center',
        },
        {
            title: 'ISRC / UPC',
            key: 'isrcUpc',
            width: 150,
            render: (_, record) => record.isrc || record.upc || '-',
        },
        {
            title: messages('assetImport.item.trackName'),
            dataIndex: 'trackName',
            key: 'trackName',
            width: 200,
            ellipsis: true,
            render: (value) => (
                <Typography.Text
                    ellipsis={{ tooltip: value }}
                    className="!mb-0 !block max-w-full"
                >
                    {value || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('assetImport.item.matchType'),
            dataIndex: 'matchType',
            key: 'matchType',
            width: 100,
            align: 'center',
            render: (value) => value || '-',
        },
        {
            title: messages('assetImport.item.action.label'),
            dataIndex: 'action',
            key: 'action',
            width: 110,
            align: 'center',
            render: (value) => <ItemActionTag action={value} />,
        },
        {
            title: messages('common.status'),
            dataIndex: 'status',
            key: 'status',
            width: 110,
            align: 'center',
            render: (value) => <ItemStatusTag status={value} />,
        },
        {
            title: messages('assetImport.item.changes'),
            key: 'changes',
            width: 320,
            render: (_, record) => <ChangeDiff changes={record.changes} />,
        },
        {
            title: messages('common.error'),
            dataIndex: 'errorMessage',
            key: 'errorMessage',
            width: 180,
            ellipsis: true,
            render: (value) =>
                value ? (
                    <Typography.Text
                        type="danger"
                        ellipsis={{ tooltip: value }}
                        className="!mb-0 !block max-w-full"
                    >
                        {value}
                    </Typography.Text>
                ) : (
                    '-'
                ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => setSelectedRowKeys(keys),
        getCheckboxProps: (record: AssetImportItemData) => ({
            disabled:
                !canApply ||
                NON_SELECTABLE_ASSET_IMPORT_ACTIONS.includes(
                    record.action as AssetImportAction
                ),
        }),
    };

    return (
        <div>
            <AppTable
                sticky
                dataSource={items}
                loading={isFetching}
                columns={columns}
                pagination={false}
                rowKey="id"
                rowSelection={canApply ? rowSelection : undefined}
                title={() => (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Space wrap>
                            <Select
                                allowClear
                                className="!w-40"
                                placeholder={messages(
                                    'assetImport.item.action.label'
                                )}
                                options={actionOptions}
                                value={filter.action}
                                onChange={(value) =>
                                    onChangeFilter({ action: value })
                                }
                            />
                            <Select
                                allowClear
                                className="!w-40"
                                placeholder={messages('common.status')}
                                options={statusOptions}
                                value={filter.status}
                                onChange={(value) =>
                                    onChangeFilter({ status: value })
                                }
                            />
                            <Select
                                allowClear
                                className="!w-40"
                                placeholder={messages(
                                    'assetImport.item.matchType'
                                )}
                                options={matchTypeOptions}
                                value={filter.matchType}
                                onChange={(value) =>
                                    onChangeFilter({ matchType: value })
                                }
                            />
                        </Space>
                        {canApply && (
                            <Space>
                                <Button
                                    disabled={selectedRowKeys.length === 0}
                                    loading={isApplying}
                                    onClick={() =>
                                        handleApply({
                                            selectAll: false,
                                            itemIds: selectedRowKeys as string[],
                                        })
                                    }
                                >
                                    {messages('assetImport.item.applySelected', {
                                        count: selectedRowKeys.length,
                                    })}
                                </Button>
                                <Button
                                    type="primary"
                                    loading={isApplying}
                                    onClick={() => handleApply({ selectAll: true })}
                                >
                                    {messages('assetImport.item.applyAll')}
                                </Button>
                            </Space>
                        )}
                    </div>
                )}
            />
            <AppPagination
                align="end"
                current={metadata?.page}
                pageSize={filter.pageSize}
                total={metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
