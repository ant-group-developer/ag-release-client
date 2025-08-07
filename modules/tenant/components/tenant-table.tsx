import ActionButton from '@/components/ui/button/action-button';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import {
    formattedDate,
    getAvatarPlaceholder,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Avatar, Switch } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TENANT_ORDER_BY, TENANT_TYPE, TYPE_MODAL_TENANT } from '../enums';
import { useUpdateTenant } from '../hooks/use-update-tenant';
import { DataFilterTenant, TenantData } from '../types/data';

type Props = {
    dataFilter: DataFilterTenant;
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<AppTableProps<TenantData>, 'columns'>;

function TenantTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
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
            width: 320,
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
                        >
                            {getAvatarPlaceholder(record.owner.email)}
                        </Avatar>
                        <div className="grid flex-1 truncate">
                            <CopyText text={cell}>
                                <p>{cell}</p>
                            </CopyText>
                            <CopyText text={record.owner.email}>
                                <p className="italic text-gray-500/80">
                                    {record.owner.email}
                                </p>
                            </CopyText>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.type.title'),
            dataIndex: 'type',
            width: 120,
            align: 'center',
            render: (cell) => {
                if (cell === TENANT_TYPE.LABEL)
                    return messages('tenant.type.label.label');
                if (cell === TENANT_TYPE.WHITE_LABEL)
                    return messages('tenant.type.whiteLabel.label');
                return cell;
            },
        },
        {
            title: messages('tenant.title'),
            dataIndex: 'title',
            width: 180,
            ellipsis: true,
            render: (cell) => (
                <CopyText text={cell}>
                    <p>{cell}</p>
                </CopyText>
            ),
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
            title: messages('common.dateCreated'),
            dataIndex: TENANT_ORDER_BY.CREATED_AT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TENANT_ORDER_BY.CREATED_AT
            ),
            render: (cell) => formattedDate(cell),
        },
        {
            title: messages('common.dateUpdated'),
            dataIndex: TENANT_ORDER_BY.UPDATED_AT,
            align: 'center',
            width: 180,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                TENANT_ORDER_BY.UPDATED_AT
            ),
            render: (cell) => formattedDate(cell),
        },
    ];

    if (canUpdate) {
        columns.push({
            dataIndex: 'action',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (cell, record) => (
                <ActionButton
                    showUpdate={canUpdate}
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_TENANT.UPDATE, record)
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

export default TenantTable;
