import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Badge, Empty } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ROLES } from '../../enums';
import { RolePermission, RolesData, RolesDataDataFilter } from '../../types';

type Props = Omit<AppTableProps<RolesData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: RolesDataDataFilter;
};

export const RolesTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const column: ColumnType<RolesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('roles.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value, record) => (
                <CopyText text={value} className="flex items-center gap-2">
                    <Badge color={record.color} />
                    <span className="flex-1 truncate">{value}</span>
                </CopyText>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value) => <CopyText text={value} />,
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 300,
            ellipsis: true,
            render: (value) => (
                <CopyText text={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {value}
                    </span>
                </CopyText>
            ),
        },

        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 80,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_ROLES.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_ROLES.UPDATE, record)
                    }
                />
            ),
        },
    ];

    const expandable: AppTableProps<RolesData>['expandable'] = {
        columnWidth: 20,
        expandedRowRender: (record: RolesData, parentIndex?: number) => {
            const rows: RolePermission[] = Array.isArray(record.rolePermissions)
                ? record.rolePermissions.map((rp) => rp)
                : [];

            if (!rows.length) {
                return (
                    <Empty
                        className="my-2"
                        description={messages('common.noDataAvailable')}
                    />
                );
            }

            // Cột của bảng con
            const childColumns: ColumnType<RolePermission>[] = [
                {
                    title: messages('common.iNo'),
                    key: 'iNo',
                    align: 'center',
                    width: 45,
                    render: (_: any, __: RolePermission, idx: number) =>
                        idx + 1,
                },
                {
                    title: messages('permission.name'),
                    dataIndex: 'name',
                    key: 'name',
                    width: 240,
                    ellipsis: true,
                    render: (_, record) => {
                        return <span> {record?.permission?.name} </span>;
                    },
                },
                {
                    title: messages('common.code'),
                    dataIndex: 'code',
                    key: 'code',
                    width: 280,
                    ellipsis: true,
                    render: (_, record) => {
                        return <span> {record?.permission?.code} </span>;
                    },
                },
                {
                    title: messages('common.note'),
                    dataIndex: 'note',
                    key: 'note',
                    width: 280,
                    ellipsis: true,
                    render: (_, record) => {
                        return <span> {record?.permission?.note} </span>;
                    },
                },
            ];

            return (
                <div className="p-2">
                    <AppTable
                        className="ml-24 rounded-lg border"
                        columns={childColumns}
                        dataSource={rows}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: false,
                        }}
                    />
                </div>
            );
        },

        // Chỉ cho expand khi có permission
        rowExpandable: (record) => (record.rolePermissions?.length ?? 0) > 0,
    };

    return (
        <AppTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
            expandable={expandable}
        />
    );
};
