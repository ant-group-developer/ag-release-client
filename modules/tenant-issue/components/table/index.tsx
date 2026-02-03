import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Badge, Switch, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_TENANT_ISSUES } from '../../enums';
import { useUpdateTenantIssue } from '../../hooks/use-update';
import { TenantIssueData, TenantIssueDataFilter } from '../../types';

type Props = Omit<AppProTableProps<TenantIssueData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: TenantIssueDataFilter;
};

export default function TenantIssueTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { updateTenantIssue } = useUpdateTenantIssue();
    const { token } = theme.useToken();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

    const column: ProColumns<TenantIssueData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 80,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: `${messages('tenant.label')}`,
            key: 'tenant',
            dataIndex: 'tenant',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => {
                const name = record?.tenant?.name;
                return (
                    <div className="flex items-center gap-4">
                        <CustomTooltip title={name}>
                            <span className="truncate">{name}</span>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: `${messages('issue.label')}`,
            key: 'issue',
            dataIndex: 'issue',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => {
                const name = getNameByLocale(
                    record?.issue?.nameEn,
                    record?.issue?.nameVi,
                    locale
                );
                const color = record?.issue?.issueLevel?.color;
                return (
                    <div className="flex items-center gap-4">
                        {color && <Badge color={color} />}
                        <CustomTooltip title={name}>
                            <span className="truncate">{name}</span>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.score'),
            key: 'score',
            dataIndex: 'score',
            align: 'center',
            width: 80,
            render: (value, record) => (
                <span className="truncate">{record?.score}</span>
            ),
        },
        {
            title: messages('common.startDateAffect'),
            key: 'startDateAffect',
            dataIndex: 'startDateAffect',
            align: 'center',
            width: 150,
            render: (value, record) => (
                <span className="truncate">
                    {formattedDate(record?.startDateAffect)}
                </span>
            ),
        },
        {
            title: messages('common.endDateAffect'),
            key: 'endDateAffect',
            dataIndex: 'endDateAffect',
            align: 'center',
            width: 150,
            render: (value, record) => (
                <span className="truncate">
                    {formattedDate(record?.endDateAffect)}
                </span>
            ),
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 100,
            render: (value, record) => (
                <Switch
                    checked={record?.isActive}
                    onChange={(e) =>
                        updateTenantIssue({
                            id: record?.id,
                            payload: {
                                isActive: e,
                            },
                        })
                    }
                />
            ),
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.description}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.note}
                    </span>
                </CustomTooltip>
            ),
        },
        // {
        //     title: messages('common.createdAt'),
        //     key: 'createdAt',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 70,
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'createdAt'
        //     ),
        // },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     align: 'center',
        //     width: 70,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'updatedAt'
        //     ),
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        // },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_TENANT_ISSUES.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_TENANT_ISSUES.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
        />
    );
}
