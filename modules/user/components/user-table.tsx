import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import {
    formattedDate,
    formattedNumber,
    getAvatarPlaceholder,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Avatar, Switch } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_USER, USER_ORDER_BY } from '../enums';
import { useUpdateUser } from '../hooks/use-update-user';
import { DataFilterUser, UserData } from '../types/data';

type Props = {
    dataFilter: DataFilterUser;
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<AppTableProps<UserData>, 'columns'>;

function UserTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const canUpdate = true;

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

    const getAuth0Link = (email: string) => {
        return `https://manage.auth0.com/dashboard/us/ant-group/users?q=${email}`;
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
                            <CopyText text={cell} label="Name">
                                <p>{cell}</p>
                            </CopyText>
                            <CopyText text={record.email} label="Email">
                                <p className="italic text-gray-500/80">
                                    {record.email}
                                </p>
                            </CopyText>
                        </div>
                        <a
                            href={getAuth0Link(record.email)}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                        >
                            <ExternalLink size={SIZE_ICON} />
                        </a>
                    </div>
                );
            },
        },
        {
            title: messages('user.type'),
            dataIndex: 'type',
            width: 120,
            align: 'center',
            render: (cell) => messages(`user.${cell}` as any),
        },
        // {
        //     title: messages('user.emailVerified'),
        //     dataIndex: 'emailVerified',
        //     align: 'center',
        //     width: 180,
        //     render: (cell, record) => (
        //         <Switch
        //             checked={cell}
        //             disabled={!canUpdate}
        //             onChange={(status) => updateEmailVerify(record.id, status)}
        //         />
        //     ),
        // },
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
            title: messages('user.loginsCount'),
            dataIndex: USER_ORDER_BY.LOGIN_COUNT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.LOGIN_COUNT
            ),
            render: (cell) => (
                <CopyText text={cell} label="Logins count" className="mx-auto">
                    <p>{formattedNumber(cell)}</p>
                </CopyText>
            ),
        },
        // {
        //     title: messages('user.lastIp'),
        //     dataIndex: 'lastIp',
        //     width: 120,
        //     align: 'center',
        //     ellipsis: true,
        //     render: (cell) => (
        //         <CopyText text={cell} label="Last IP" className="mx-auto">
        //             <p>{cell}</p>
        //         </CopyText>
        //     ),
        // },
        {
            title: messages('user.lastLogin'),
            dataIndex: USER_ORDER_BY.LAST_LOGIN,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.LAST_LOGIN
            ),
            render: (cell) => formattedDate(cell),
        },
        {
            title: messages('common.dateCreated'),
            dataIndex: USER_ORDER_BY.CREATED_AT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                USER_ORDER_BY.CREATED_AT
            ),
            render: (cell) => formattedDate(cell),
        },
        {
            title: messages('common.dateUpdated'),
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

    if (canUpdate) {
        columns.push({
            title: messages('common.action'),
            dataIndex: 'action',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (cell, record) => (
                <ActionButton
                    showUpdate={canUpdate}
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_USER.UPDATE, record)
                    }
                />
            ),
        });
    }

    return (
        <AppTable
            {...props}
            size="middle"
            pagination={false}
            columns={columns}
        />
    );
}

export default UserTable;
