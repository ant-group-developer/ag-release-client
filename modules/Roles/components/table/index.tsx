import ActionButton from '@/components/ui/button/action-button';
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
            width: 50,
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
                <span className="flex items-center gap-1">
                    <Badge size="default" color={record?.color} />
                    <span className="truncate">{value}</span>
                </span>
            ),
        },
        // {
        //     title: messages('common.color'),
        //     key: 'color',
        //     dataIndex: 'color',
        //     align: 'left',
        //     width: 100,

        //     render: (value) => <AppColorPicker value={value} disabled />,
        // },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 200,

            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },

        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 100,
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
            width: 100,
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
            width: 100,
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
                    width: 70,
                    render: (_: any, __: RolePermission, idx: number) =>
                        idx + 1,
                },
                {
                    title: messages('permission.name'),
                    dataIndex: 'name',
                    key: 'name',
                    width: 280,
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
                <div className="px-4 py-2">
                    <AppTable
                        className="overflow-hidden rounded-lg border"
                        columns={childColumns}
                        dataSource={rows}
                        pagination={false}
                        size="small"
                        rowKey="key"
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
