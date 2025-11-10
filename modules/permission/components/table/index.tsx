import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_PERMISSION } from '../../enums';
import { PermissionData, PermissionDataDataFilter } from '../../types';

type Props = Omit<AppProTableProps<PermissionData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: PermissionDataDataFilter;
};

export const PermissionTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const column: ProColumns<PermissionData>[] = [
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
            title: messages('permission.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 200,
            render: (value, record) => <CopyText text={record?.name} />,
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 200,
            render: (value, record) => <CopyText text={record?.code} />,
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 300,
            render: (value, record) => (
                <CopyText text={record?.note}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.note}
                    </span>
                </CopyText>
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
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.createdAt)}
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
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.updatedAt)}
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
                        openModal(TYPE_MODAL_PERMISSION.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_PERMISSION.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
            className={`rounded-t-lg px-4 ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            tableAlertRender={({ selectedRowKeys }) => (
                <div className="flex items-center gap-2 font-semibold">
                    <div className="space-x-1">
                        <span>{selectedRowKeys.length}</span>
                        <span>{messages('common.selected')}</span>
                    </div>
                    <Button
                        danger
                        type="primary"
                        onClick={() =>
                            openModal(TYPE_MODAL_PERMISSION.BULK_DELETE)
                        }
                    >
                        {messages('permission.action.delete')}
                    </Button>
                </div>
            )}
        />
    );
};
