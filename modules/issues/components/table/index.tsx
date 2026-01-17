import ActionButton from '@/components/ui/button/action-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Badge, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_ISSUES } from '../../enums';
import { IssueData, IssueDataFilter } from '../../types';

type Props = Omit<AppProTableProps<IssueData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: IssueDataFilter;
};

export default function IssueTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { token } = theme.useToken();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

    const column: ProColumns<IssueData>[] = [
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
            title: `${messages('common.name')}`,
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value, record) => {
                const name = getNameByLocale(
                    record?.nameEn,
                    record?.nameVi,
                    locale
                );
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
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 250,
            ellipsis: true,
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="truncate">{value}</span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('issueLevel.label'),
            key: 'issueLevel',
            dataIndex: 'issueLevel',
            align: 'left',
            width: 100,
            render: (_, record) => (
                <div className="space-x-2 truncate">
                    <Badge size="small" color={record?.issueLevel?.color} />
                    <span>
                        {getNameByLocale(
                            record?.issueLevel?.nameEn,
                            record?.issueLevel?.nameVi,
                            locale
                        )}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.score'),
            key: 'score',
            dataIndex: 'score',
            align: 'center',
            width: 100,
            render: (value) => <span className="truncate">{value}</span>,
        },
        {
            title: messages('issue.numberOfDaysAffect'),
            key: 'numberOfDaysAffect',
            dataIndex: 'numberOfDaysAffect',
            align: 'center',
            width: 180,
            render: (value) => <span className="truncate">{value}</span>,
        },

        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {value}
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
            render: (value) => (
                <CustomTooltip title={value}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {value}
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
                        openModal(TYPE_MODAL_ISSUES.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_ISSUES.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            key="issueTable"
            {...props}
            className={`rounded-t-lg ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
}
