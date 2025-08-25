import ActionButton, {
    ActionButtonProps,
} from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import {
    formattedDate,
    getAvatarPlaceholder,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, Switch, Tag, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '../enums';
import { useUpdateUser } from '../hooks/use-update-user';
import { DataFilterUser, UserData } from '../types/data';
import { checkIsSystemAdmin, checkIsTenantOwner } from '../utils/role';

type Props = {
    dataFilter: DataFilterUser;
    pagination: {
        pageSize: number;
        current: number;
    };
    actionProps?: ActionButtonProps;
} & Omit<AppTableProps<UserData>, 'columns'>;

function UserTable({ dataFilter, actionProps, ...props }: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const canUpdate = true;

    const { isAdmin, isSystemTenant } = useAuth();

    const { updateUser } = useUpdateUser();

    // const updateEmailVerify = (userId: string, status: boolean) => {
    //     updateUser({
    //         userId,
    //         payload: {
    //             emailVerified: status,
    //         },
    //     });
    // };

    const updateUserStatus = (userId: string, status: boolean) => {
        updateUser({
            userId,
            payload: {
                isActive: status,
            },
        });
    };

    const columns: ColumnsType<UserData> = [
        {
            dataIndex: '',
            title: messages('common.iNo'),
            align: 'center',
            width: 80,
            fixed: 'left',
            render: (text, record, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('user.label'),
            dataIndex: USER_ORDER_BY.NAME,
            width: 320,
            ellipsis: true,
            sorter: true,
            fixed: 'left',
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.NAME
            ),
            render: (cell, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={record.avatar}
                            alt={cell}
                            className="flex-none"
                            size={40}
                        >
                            {getAvatarPlaceholder(record.email)}
                        </Avatar>
                        <div className="grid flex-1 truncate">
                            <CopyText text={cell}>
                                <p>{cell}</p>
                            </CopyText>
                            <CopyText text={record.email}>
                                <p
                                    style={{
                                        color: token.colorTextDescription,
                                    }}
                                >
                                    {record.email}
                                </p>
                            </CopyText>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            width: 200,
            render: (cell, record) => (
                <div className="flex flex-col gap-1">
                    {record.tenantUser.map((item) => (
                        <Tag key={item.id} className="w-fit">
                            {item.tenant.name}:{' '}
                            {messages(
                                `tenant.userType.${item.type}.label` as any
                            )}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: messages('status.label'),
            dataIndex: 'isActive',
            align: 'center',
            width: 120,
            render: (cell, record) => (
                <Switch
                    checked={cell}
                    disabled={!canUpdate}
                    onChange={(status) => updateUserStatus(record.id, status)}
                />
            ),
        },
        {
            title: messages('user.lastLogin'),
            dataIndex: USER_ORDER_BY.LAST_LOGIN,
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.LAST_LOGIN
            ),
            render: (cell) => formattedDate(cell),
        },
        {
            title: messages('user.lastActive'),
            dataIndex: USER_ORDER_BY.LAST_ACTIVE,
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.LAST_ACTIVE
            ),
            render: (cell) => formattedDate(cell),
        },
        // {
        //     title: messages('common.createdAt'),
        //     dataIndex: USER_ORDER_BY.CREATED_AT,
        //     align: 'center',
        //     width: 180,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         USER_ORDER_BY.CREATED_AT
        //     ),
        //     render: (cell) => formattedDate(cell),
        // },
        {
            title: messages('common.updatedAt'),
            dataIndex: USER_ORDER_BY.UPDATED_AT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.UPDATED_AT
            ),
            render: (cell) => formattedDate(cell),
        },
    ];

    if (isAdmin) {
        columns.splice(2, 0, {
            title: messages('user.type'),
            dataIndex: 'type',
            width: 120,
            render: (cell) => messages(`user.${cell}` as any),
        });
    }

    if (canUpdate) {
        columns.push({
            // title: messages('common.action'),
            dataIndex: 'action',
            align: 'center',
            width: 50,
            // fixed: 'right',
            render: (cell, record) => {
                const isSystemAdmin = checkIsSystemAdmin(record.type);
                const isTenantOwner = checkIsTenantOwner(
                    record.tenantUser[0]?.type
                );
                return (
                    <ActionButton
                        showUpdate={canUpdate}
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_USER.UPDATE, record)
                        }
                        showDelete={
                            (!isSystemTenant &&
                                !isSystemAdmin &&
                                !isTenantOwner) ||
                            false
                        }
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_USER.REMOVE, record)
                        }
                        {...actionProps}
                    />
                );
            },
        });
    }

    return <AppTable {...props} pagination={false} columns={columns} />;
}

export default UserTable;
