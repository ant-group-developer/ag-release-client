import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import {
    formattedDate,
    formattedNumber,
    getAvatarPlaceholder,
    getIndex,
    getRandomInt,
    getSortOrder,
} from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { Avatar, Switch, theme, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TENANT_ORDER_BY, TENANT_TABS } from '../enums';
import { useUpdateTenant } from '../hooks/use-update-tenant';
import { DataFilterTenant, TenantData } from '../types/data';
import { getTenantDetailRoute } from '../utils';
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
    const canUpdate = true;

    const { updateTenant } = useUpdateTenant();

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
                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={record.logo}
                            alt={cell}
                            className="flex-none"
                            size={40}
                            shape="square"
                        >
                            {getAvatarPlaceholder(record.owner.email)}
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
                            <CopyText text={record.owner.email}>
                                <p
                                    style={{
                                        color: token.colorTextDescription,
                                    }}
                                >
                                    {record.owner.email}
                                </p>
                            </CopyText>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.type.titleShort'),
            dataIndex: 'type',
            width: 120,
            render: (cell) => <TenantTag type={cell} />,
        },
        {
            title: messages('tenant.title'),
            dataIndex: 'title',
            width: 180,
            ellipsis: true,
            render: (cell) => <CopyText text={cell} />,
        },
        {
            title: messages('tenant.primaryColor'),
            dataIndex: 'primaryColor',
            width: 120,
            ellipsis: true,
            render: (cell) => <AppColorPicker value={cell} disabled />,
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
            render: () => formattedNumber(getRandomInt(3, 15)),
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
        // {
        //     title: messages('common.dateCreated'),
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
        {
            title: messages('common.dateUpdated'),
            dataIndex: TENANT_ORDER_BY.UPDATED_AT,
            align: 'center',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TENANT_ORDER_BY.UPDATED_AT
            ),
            render: (cell) => formattedDate(cell),
        },
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
            size="middle"
            pagination={false}
            columns={columns}
        />
    );
}

export default TenantTable;
