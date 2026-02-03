import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import {
    formattedNumber,
    getAvatarPlaceholder,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, Switch, theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TENANT_ORDER_BY, TENANT_TABS } from '../enums';
import { useUpdateTenant } from '../hooks/use-update-tenant';
import { DataFilterTenant, TenantData } from '../types/data';
import { getTenantDetailRoute, getTenantOwnerEmail } from '../utils';
import TenantTag from './tenant-tag';

type Props = {
    dataFilter: DataFilterTenant;
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<AppTableProps<TenantData>, 'columns'>;

function TenantTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const {
        profile: { tenantId },
    } = useAuth();

    const { updateTenant, isPending } = useUpdateTenant();

    const updateTenantStatus = (tenantId: string, status: boolean) => {
        updateTenant({
            tenantId,
            payload: {
                isActive: status,
            },
        });
    };

    const columns: ColumnsType<TenantData> = [
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
            title: messages('tenant.label'),
            dataIndex: TENANT_ORDER_BY.NAME,
            width: 250,
            ellipsis: true,
            sorter: true,
            fixed: 'left',
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TENANT_ORDER_BY.NAME
            ),
            render: (cell, record) => {
                const ownerEmail = getTenantOwnerEmail(record.tenantUser);
                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={record.logo}
                            alt={cell}
                            className="flex-none"
                            size={40}
                            shape="square"
                        >
                            {getAvatarPlaceholder(record.name)}
                        </Avatar>
                        <div className="grid flex-1 truncate">
                            <Tooltip
                                title={messages('common.detail')}
                                placement="right"
                            >
                                <Link
                                    href={getTenantDetailRoute(
                                        record.id,
                                        TENANT_TABS.INFO
                                    )}
                                    className="w-fit hover:underline"
                                >
                                    {cell}
                                </Link>
                            </Tooltip>
                            <p
                                style={{
                                    color: token.colorTextDescription,
                                }}
                            >
                                {messages('tenant.owner')}: {ownerEmail}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.title'),
            dataIndex: 'title',
            width: 250,
            ellipsis: true,
        },
        {
            title: messages('tenant.type.titleShort'),
            dataIndex: 'type',
            align: 'center',
            width: 120,
            render: (cell) => <TenantTag type={cell} />,
        },
        // {
        //     title: messages('tenant.primaryColor'),
        //     dataIndex: 'primaryColor',
        //     width: 120,
        //     ellipsis: true,
        //     render: (cell) => <AppColorPicker value={cell} disabled />,
        // },
        {
            title: messages('status.label'),
            dataIndex: 'isActive',
            align: 'center',
            width: 120,
            render: (cell, record) => (
                <Switch
                    checked={cell}
                    disabled={tenantId === record.id}
                    onChange={(status) => updateTenantStatus(record.id, status)}
                />
            ),
        },
        {
            title: messages('user.label'),
            dataIndex: 'user',
            align: 'center',
            width: 120,
            sorter: true,
            render: (cell, record) => formattedNumber(record.tenantUserCount),
        },
        {
            title: messages('tenant.member'),
            dataIndex: 'member',
            align: 'center',
            width: 120,
            sorter: true,
            render: (cell, record) => {
                if (record.children) {
                    return formattedNumber(record.children.length);
                }
                return '-';
            },
        },
        {
            title: messages('tenant.labels.max.label'),
            dataIndex: 'maxLabels',
            align: 'center',
            width: 120,
            sorter: true,
            render: (cell, record) => formattedNumber(record.maxLabels),
        },
        // {
        //     title: messages('common.createdAt'),
        //     dataIndex: TENANT_ORDER_BY.CREATED_AT,
        //     align: 'center',
        //     width: 180,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         TENANT_ORDER_BY.CREATED_AT
        //     ),
        //     render: (cell) => formattedDate(cell),
        // },
        // {
        //     title: messages('common.updatedAt'),
        //     dataIndex: TENANT_ORDER_BY.UPDATED_AT,
        //     align: 'center',
        //     width: 120,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         TENANT_ORDER_BY.UPDATED_AT
        //     ),
        //     render: (cell) => formattedDate(cell),
        // },
    ];

    // if (canUpdate) {
    //     columns.push({
    //         dataIndex: 'action',
    //         align: 'center',
    //         width: 50,
    //         fixed: 'right',
    //         render: (cell, record) => (
    //             <ActionButton
    //                 showUpdate={canUpdate}
    //                 onShowUpdate={() =>
    //                     openModal(TYPE_MODAL_TENANT.UPDATE, record)
    //                 }
    //             />
    //         ),
    //     });
    // }

    return (
        <AppTable
            {...props}
            loading={isPending || props.loading}
            pagination={false}
            columns={columns}
        />
    );
}

export default TenantTable;
