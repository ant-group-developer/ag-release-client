import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { APP_ROUTES } from '@/enums/routes';
import { getLastName } from '@/helpers/string';
import usePermissionStore from '@/hooks/use-permission';
import { UserData } from '@/modules/user/types/data';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { FilterOrderManagement, OrderManagementData } from '../../types';

type Props = {
    // pagination: {
    //     pageSize: number;
    //     current: number;
    // };
    dataFilter: FilterOrderManagement;
} & Omit<AppTableProps<OrderManagementData>, 'columns'>;

export default function OrderManagementTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    // const router = useRouter();
    const locale = useLocale();
    const [currentPage, setCurrentPage] = useState(1);

    const isHasFilterDeadline =
        !!dataFilter?.startDateDeadline && !!dataFilter?.endDateDeadline;

    const { canRead } = usePermissionStore((state) => state.permission.order);
    const handleClickOnOrderId = (
        orderCode: string,
        userId: UserData['id']
    ) => {
        if (!canRead || !orderCode) return;
        // router.push(APP_ROUTES.ORDER + '?keyword=' + orderCode);
        const url = `/${locale}${APP_ROUTES.ORDER}?keyword=${orderCode}&creatorId=${userId}${`${isHasFilterDeadline ? `&startDateDeadline=${dataFilter.startDateDeadline}&endDateDeadline=${dataFilter.endDateDeadline}` : ''}`}  `;
        window.open(url, '_blank');
    };

    const handleUserClick = (userId: UserData['id']) => {
        if (!canRead || !userId) return;
        const url = `/${locale}${APP_ROUTES.ORDER}?creatorId=${userId}${`${isHasFilterDeadline ? `&startDateDeadline=${dataFilter.startDateDeadline}&endDateDeadline=${dataFilter.endDateDeadline}` : ''}`}  `;
        window.open(url, '_blank');
    };

    const columns: ColumnType<OrderManagementData>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 50,
            render: (_: any, _record, index: number) => {
                const { pagination } = props;
                if (pagination && typeof pagination !== 'boolean') {
                    const pageSize = pagination.pageSize || 10;
                    return (currentPage - 1) * pageSize + index + 1;
                }
                return index + 1;
            },
        },
        {
            title: messages('common.userCreator'),
            dataIndex: 'nameUserCreator',
            key: 'nameUserCreator',
            align: 'left',
            width: 100,
            sorter: (a, b) => {
                const nameA = a?.nameUserCreator || '';
                const nameB = b?.nameUserCreator || '';
                return (getLastName(nameA) || '').localeCompare(
                    getLastName(nameB) || ''
                );
            },
            render: (value, record) => {
                return (
                    <CustomTooltip
                        size="small"
                        title={messages('filter.viewDetailValue', { value })}
                    >
                        <span
                            onClick={() =>
                                handleUserClick(record?.userCreatorId)
                            }
                            className="cursor-pointer hover:text-blue-500 group-hover:underline"
                        >
                            {value}
                        </span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('order.orderQuantity'),
            dataIndex: 'countOrders',
            key: 'countOrders',
            align: 'center',
            width: 60,
        },
        {
            title: messages('order.orderList'),
            dataIndex: 'listOrders',
            key: 'listOrders',
            align: 'left',
            width: 500,
            ellipsis: true,
            render: (value, record) => {
                const newValue = value.split(',');
                return (
                    <span className="whitespace-pre-line">
                        {newValue.map((item: string, index: number) => (
                            <span
                                onClick={() =>
                                    handleClickOnOrderId(
                                        item,
                                        record?.userCreatorId
                                    )
                                }
                                className="cursor-pointer"
                                key={item}
                            >
                                {' '}
                                <CustomTooltip
                                    size="small"
                                    title={messages('filter.viewDetailValue', {
                                        value: item,
                                    })}
                                >
                                    <span className="hover:text-blue-500 hover:underline hover:underline-offset-4">
                                        {item}
                                    </span>
                                </CustomTooltip>
                                {index < newValue.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                );
            },
        },
    ];

    const handleTableChange = (pagination: any) => {
        if (pagination && pagination.current) {
            setCurrentPage(pagination.current);
        }
    };

    return (
        <AppTable
            {...props}
            onChange={handleTableChange}
            columns={columns}
            rowClassName={() => 'group'}
        />
    );
}
