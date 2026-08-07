import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import {
    formattedDate,
    formattedNumber,
    getAvatarPlaceholder,
    getIndex,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Avatar, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ASSET_IMPORT } from '../../enums';
import { AssetImportBatchData, AssetImportBatchFilter } from '../../types';
import BatchStatusTag from '../tag/batch-status-tag';

type Props = Omit<AppTableProps<AssetImportBatchData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: AssetImportBatchFilter;
};

export default function AssetImportBatchesTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const columns: ColumnType<AssetImportBatchData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
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
            title: messages('assetImport.batch.fileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            width: 260,
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
            title: messages('assetImport.batch.targetTenant'),
            key: 'targetTenant',
            width: 220,
            ellipsis: true,
            render: (_, record) => {
                const tenant = record.targetTenant;
                if (!tenant) return '-';

                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={tenant.icon} size="small">
                            {getAvatarPlaceholder(tenant.name)}
                        </Avatar>
                        <span className="truncate">{tenant.name}</span>
                    </div>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            width: 150,
            align: 'center',
            render: (value) => <BatchStatusTag status={value} />,
        },
        {
            title: messages('assetImport.batch.totalRows'),
            key: 'totalRows',
            dataIndex: 'totalRows',
            width: 110,
            align: 'right',
            render: (value) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title: messages('assetImport.batch.matchedRows'),
            key: 'matchedRows',
            dataIndex: 'matchedRows',
            width: 120,
            align: 'right',
            render: (value) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title: messages('assetImport.batch.appliedRows'),
            key: 'appliedRows',
            dataIndex: 'appliedRows',
            width: 120,
            align: 'right',
            render: (value) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
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
                <ActionButton
                    showDetail
                    onShowDetail={() =>
                        openModal(TYPE_MODAL_ASSET_IMPORT.DETAIL, record)
                    }
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_ASSET_IMPORT.DELETE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable {...props} columns={columns} pagination={false} rowKey="id" />
    );
}
