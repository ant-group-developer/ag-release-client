import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import ProductTypeTag from '@/components/ui/tag/product-type-tag';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { UPLOAD_TYPE } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { getIntlCodeByTypeUpload } from '@/helpers/common';
import { getLastName } from '@/helpers/string';
import usePermissionStore from '@/hooks/use-permission';
import { UserData } from '@/modules/user/types/data';
import { ColumnsType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { FilterProductManagement, ProductManagementColumn } from '../../types';

type Props = {
    dataFilter: FilterProductManagement;
} & Omit<AppTableProps<ProductManagementColumn>, 'columns'>;

export default function ProductManagementTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { canRead } = usePermissionStore((state) => state.permission.product);

    const isHasFilterDeadline =
        !!dataFilter?.startDateDeadline && !!dataFilter?.endDateDeadline;

    const handleCodeClick = (orderCode: string, productTypeId: string) => {
        if (!canRead || !orderCode || !productTypeId) return;
        // router.push(
        //     APP_ROUTES.PRODUCT + '?keyword=' + orderCode + '&type=' + type
        // );
        const url = `/${locale}${APP_ROUTES.PRODUCT}?keyword=${orderCode}&productTypeId=${productTypeId}${`${isHasFilterDeadline ? `&startDateDeadline=${dataFilter.startDateDeadline}&endDateDeadline=${dataFilter.endDateDeadline}` : ''}`}  `;
        window.open(url, '_blank');
    };

    const handleUserClick = (userId: UserData['id']) => {
        if (!canRead || !userId) return;
        const url = `/${locale}${APP_ROUTES.PRODUCT}?assigneeId=${userId}${`${isHasFilterDeadline ? `&startDateDeadline=${dataFilter.startDateDeadline}&endDateDeadline=${dataFilter.endDateDeadline}` : ''}`}  `;
        window.open(url, '_blank');
    };

    const handleTypeClick = (userId: UserData['id'], productTypeId: string) => {
        if (!canRead || !userId || !productTypeId) return;
        console.log(productTypeId);
        const url = `/${locale}${APP_ROUTES.PRODUCT}?assigneeId=${userId}&productTypeId=${productTypeId}${`${isHasFilterDeadline ? `&startDateDeadline=${dataFilter.startDateDeadline}&endDateDeadline=${dataFilter.endDateDeadline}` : ''}`}  `;
        window.open(url, '_blank');
    };

    const columns: ColumnsType<ProductManagementColumn> = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: 'index',
            align: 'center',
            width: 100,
            render: (_, record, index) => {
                const displayIndex = record.originalIndex + 1;
                return displayIndex;
            },
            onCell: (record) => ({
                rowSpan: record.rowSpan,
            }),
        },
        {
            title: messages('common.assignee'),
            dataIndex: 'assigneeName',
            key: 'assigneeName',
            align: 'left',
            width: 300,
            onCell: (record) => ({
                rowSpan: record.rowSpan,
            }),
            sorter: (a, b) => {
                const nameA = a?.assigneeName || '';
                const nameB = b?.assigneeName || '';
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
                            onClick={() => handleUserClick(record?.assigneeId)}
                            className="cursor-pointer hover:text-blue-500 group-hover:underline"
                        >
                            {record?.assigneeName}
                        </span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.type'),
            key: 'type',
            align: 'center',
            width: 150,
            render: (_, record) => {
                if (!record.type) return null;
                const typeName = getIntlCodeByTypeUpload(
                    record?.typeName as UPLOAD_TYPE
                );

                return (
                    <CustomTooltip
                        size="small"
                        title={messages('filter.viewDetailValue', {
                            value: messages(typeName).toLowerCase(),
                        })}
                    >
                        <ProductTypeTag
                            color={record?.typeColor ?? '#000'}
                            name={messages(typeName)}
                            onClick={() =>
                                handleTypeClick(
                                    record?.assigneeId,
                                    record?.typeId
                                )
                            }
                        />
                        {/* <Tag color="blue">{record.typeName}</Tag> */}
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('order.orderQuantity'),
            dataIndex: '',
            key: 'orderQuantity',
            align: 'center',
            width: 150,
            render: (_, record) => {
                return record.typeCount;
            },
        },
        {
            title: messages('order.orderList'),
            dataIndex: '',
            key: '',
            align: 'left',
            render: (_, record) => {
                const typeName = record.typeName;
                const value = record.typeValue;
                const productTypeId = record?.typeId;

                return (
                    <span>
                        {value?.map((item: string, index: number) => (
                            <span
                                onClick={() =>
                                    handleCodeClick(item, productTypeId)
                                }
                                key={item}
                                className="cursor-pointer"
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
                                {index < value.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                );
            },
        },
    ];

    return (
        <AppTable
            {...props}
            // pagination={false}
            columns={columns}
            bordered
            rowClassName={() => 'group'}
        />
    );
}
