import IconButton from '@/components/ui/button/icon-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import PrioritySelect from '@/components/ui/select/priority-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import PopoverTags from '@/components/ui/tag/popover-tags';
import StatusTag from '@/components/ui/tag/status-tag';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { OPACITY_TAG, SIZE_ICON_SMALL } from '@/constants/common';
import { LOCALE } from '@/enums/common';
import {
    formattedDate,
    getIntlCodeByStatus,
    getSortOrder,
    hexToRGBA,
} from '@/helpers/common';
import { getFallbackUrl } from '@/helpers/link';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Check, Pencil } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import ActionButton from '../../../../components/ui/button/action-button';
import {
    COLUMN_ORDER_DISPLAY,
    ORDER_STATUS,
    ORDER_TYPE_FILTER,
    TYPE_MODAL_ORDER,
    USED_STATUS,
} from '../../enums';
import { useUpdateOrder } from '../../hooks/use-update-order';
import { DataFilterOrder, OrderData } from '../../types';
import { UpdateOrder } from '../../types/update-order';
import AssigneeWithIconType from '../assignee-with-tag';
import UsedStatusSelect from '../select/used-status-select';

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: DataFilterOrder;
    visibleColumns: COLUMN_ORDER_DISPLAY[];
    onChangeFilter: OnChangeFilter<DataFilterOrder>;
    visible?: boolean;
} & Omit<AppTableProps<OrderData>, 'columns'>;

export default function OrderTable({
    visible = true,
    visibleColumns,
    dataFilter,
    onChangeFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const [orderId, setOrderId] = useState('');
    const [priorityId, setPriorityId] = useState('');
    const locale = useLocale();
    const openModal = useModalStore((state) => state.openModal);
    const { canDelete, canReview, canUpdate } = usePermissionStore(
        (state) => state.permission.order
    );
    const { profile } = useAuth();

    const getThumbnailUrl = (record: OrderData, width: number) => {
        // if (record.orderProduct.googleDriveFileId) {
        //     return getLinkDriveImage(record.orderProduct.googleDriveFileId, width);
        // }

        return record.urlProduct;
    };

    const { updateOrder, isPending } = useUpdateOrder();

    const handleUpdatePriority = (value: string, record: OrderData) => {
        const variables: UpdateOrder = {
            payload: {
                dataOrder: {
                    id: record.id,
                    priorityId: value,
                },
            },
            onSuccess: () => {
                setOrderId('');
            },
            onError: () => {},
        };
        updateOrder(variables);
    };

    const columns: ColumnType<OrderData>[] = [
        // {
        //     title: messages('common.iNo'),
        //     dataIndex: '',
        //     align: 'center',
        //     width: 40,
        //     render: (_, __, index) =>
        //         getIndex(
        //             props.pagination.pageSize,
        //             props.pagination.current,
        //             index
        //         ),
        // },
        {
            title: messages('product.label'),
            dataIndex: COLUMN_ORDER_DISPLAY.Product,
            align: 'center',
            fixed: 'left',
            width: 150,
            render: (value, record) => {
                const width = 150;
                const type =
                    record?.orderProduct?.find(
                        (item) =>
                            item?.productType?.code === PRODUCT_TYPE.VIDEO ||
                            item?.productType?.code === PRODUCT_TYPE.IMAGE
                    )?.productType?.code || PRODUCT_TYPE.SOURCE;
                const productUrl = getThumbnailUrl(record, width);
                const fallback = getFallbackUrl(type ?? PRODUCT_TYPE.IMAGE);

                return (
                    <ImageFallback
                        onClick={() =>
                            openModal(TYPE_MODAL_ORDER.COMMENT, record)
                        }
                        className="max aspect-video max-h-20 cursor-pointer rounded-lg object-cover"
                        src={productUrl ?? fallback}
                        alt={record.code}
                        fallbackSrc={fallback}
                        height={80}
                        width={width}
                    />
                );
            },
        },
        {
            title: messages('common.code'),
            dataIndex: COLUMN_ORDER_DISPLAY.Code,
            align: 'center',
            width: 100,
            fixed: 'left',
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                ORDER_TYPE_FILTER.CODE
            ),
        },
        {
            title: messages('common.userCreator'),
            dataIndex: COLUMN_ORDER_DISPLAY.Creator,
            align: 'left',
            width: 180,
            ellipsis: true,
            render: (value, record) => (
                <CustomTooltip
                    title={messages('filter.filterByUsername', {
                        value: record?.creatorUser?.name,
                    })}
                    size="small"
                >
                    <span
                        onClick={() =>
                            onChangeFilter({
                                creatorId: record?.creatorUser?.id,
                            })
                        }
                        className="cursor-pointer truncate hover:text-blue-500 group-hover:underline"
                    >
                        {record?.creatorUser?.name}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.assignee'),
            dataIndex: COLUMN_ORDER_DISPLAY.Assignee,
            align: 'left',
            width: 250,
            ellipsis: true,
            render: (value, record) => {
                // const userAssigneeVideo = record.orderProduct?.find(
                //     (item) => item?.productType?.code === PRODUCT_TYPE.VIDEO
                // );
                // const userAssigneeImage = record.orderProduct?.find(
                //     (item) => item?.productType?.code === PRODUCT_TYPE.IMAGE
                // );
                // const userAssigneeSource = record.orderProduct?.find(
                //     (item) => item?.productType?.code === PRODUCT_TYPE.SOURCE
                // );

                return (
                    <div className="flex flex-col gap-1 truncate">
                        {/* {userAssigneeImage?.nameAssignee && (
                            <AssigneeWithTag
                                nameAssignee={userAssigneeImage?.nameAssignee}
                                color={userAssigneeImage?.productType?.color}
                                name={
                                    locale === LOCALE.VI
                                        ? userAssigneeImage?.productType?.nameVi
                                        : userAssigneeImage?.productType?.nameEn
                                }
                                nameAssigneeClick={() =>
                                    onChangeFilter({
                                        assigneeId:
                                            userAssigneeImage?.assigneeId,
                                    })
                                }
                            />
                        )} */}
                        {/* {userAssigneeSource?.nameAssignee && (
                            <AssigneeWithTag
                                nameAssignee={userAssigneeSource?.nameAssignee}
                                color={userAssigneeSource?.productType?.color}
                                name={
                                    locale === LOCALE.VI
                                        ? userAssigneeSource?.productType
                                              ?.nameVi
                                        : userAssigneeSource?.productType
                                              ?.nameEn
                                }
                                nameAssigneeClick={() =>
                                    onChangeFilter({
                                        assigneeId:
                                            userAssigneeSource?.assigneeId,
                                    })
                                }
                            />
                        )}
                        {userAssigneeVideo?.nameAssignee && (
                            <AssigneeWithTag
                                nameAssignee={userAssigneeVideo?.nameAssignee}
                                color={userAssigneeVideo?.productType?.color}
                                name={
                                    locale === LOCALE.VI
                                        ? userAssigneeVideo?.productType?.nameVi
                                        : userAssigneeVideo?.productType?.nameEn
                                }
                                nameAssigneeClick={() =>
                                    onChangeFilter({
                                        assigneeId:
                                            userAssigneeVideo?.assigneeId,
                                    })
                                }
                            />
                        )} */}
                        {record?.orderProduct?.map((item, index) => {
                            return (
                                <AssigneeWithIconType
                                    productData={item}
                                    key={index}
                                    nameAssignee={item?.nameAssignee}
                                    // color={item?.productType?.color}
                                    // name={
                                    //     locale === LOCALE.VI
                                    //         ? item?.productType?.nameVi
                                    //         : item?.productType?.nameEn
                                    // }
                                    nameAssigneeClick={() =>
                                        onChangeFilter({
                                            assigneeId: item?.assigneeId,
                                        })
                                    }
                                    IconTypeClick={() =>
                                        onChangeFilter({
                                            productTypeId:
                                                item?.productType?.id,
                                        })
                                    }
                                />
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: messages('common.content'),
            dataIndex: COLUMN_ORDER_DISPLAY.Content,
            align: 'left',
            width: 420,
            ellipsis: true,
            render: (value: string) => (
                <span className="line-clamp-3 whitespace-pre-line">
                    {value}
                </span>
            ),
        },
        // {
        //     title: messages('common.note'),
        //     dataIndex: 'note',
        //     align: 'left',
        //     width: 200,
        //     ellipsis: true,
        //     render: (value: string) => (
        //         <span className="">
        //             {value}
        //         </span>
        //     ),
        // },
        {
            title: messages('priority.label'),
            dataIndex: COLUMN_ORDER_DISPLAY.Priority,
            align: 'left',
            width: orderId ? 190 : 150,
            render: (value, record) => {
                const priorityName =
                    locale === LOCALE.VI
                        ? record?.priority?.nameVi
                        : record?.priority?.nameEn;
                const rgbaColor = hexToRGBA(
                    record?.priority?.color,
                    OPACITY_TAG
                );

                if (!record?.priority?.color) return null;

                const isOpenEditPriority = orderId === record?.id;

                return (
                    <div className="flex items-center gap-1">
                        {!isOpenEditPriority && (
                            <>
                                <CustomTooltip
                                    title={messages('filter.filterByPriority', {
                                        value: priorityName?.toLowerCase(),
                                    })}
                                    size="small"
                                >
                                    <Tag
                                        color={rgbaColor}
                                        bordered={false}
                                        className="cursor-pointer group-hover:underline"
                                        onClick={() =>
                                            onChangeFilter({
                                                priorityId: value?.id,
                                            })
                                        }
                                    >
                                        <span
                                            style={{
                                                color: value?.color,
                                                textDecorationColor:
                                                    value?.color,
                                            }}
                                            className="group-hover:underline"
                                        >
                                            {priorityName}
                                        </span>
                                    </Tag>
                                </CustomTooltip>
                                <CustomTooltip
                                    size="small"
                                    title={messages('common.update')}
                                    className="invisible items-center group-hover:visible"
                                >
                                    <IconButton
                                        onClick={() => setOrderId(record?.id)}
                                    >
                                        <Pencil size={SIZE_ICON_SMALL} />
                                    </IconButton>
                                </CustomTooltip>
                            </>
                        )}

                        {isOpenEditPriority && (
                            <div className="flex w-full items-center gap-1">
                                <PrioritySelect
                                    disabled={isPending}
                                    defaultValue={record?.priority?.id}
                                    onChange={(value) => setPriorityId(value)}
                                    placeholder={messages(
                                        'priority.select.placeholder'
                                    )}
                                    className="flex-1"
                                    fallback={priorityName}
                                />
                                <CustomTooltip
                                    size="small"
                                    title={messages('common.update')}
                                    className="invisible items-center group-hover:visible"
                                >
                                    <IconButton
                                        onClick={() => {
                                            handleUpdatePriority(
                                                priorityId,
                                                record
                                            );
                                        }}
                                    >
                                        <Check size={SIZE_ICON_SMALL} />
                                    </IconButton>
                                </CustomTooltip>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.status'),
            dataIndex: COLUMN_ORDER_DISPLAY.Status,
            align: 'center',
            width: 150,
            render: (value, record) => {
                const isOvertime = new Date(record.deadline) < new Date();
                const isDone = record.status === ORDER_STATUS.COMPLETED;
                const isCancel = record.status === ORDER_STATUS.CANCEL;
                return (
                    <div className="flex flex-col flex-wrap items-center justify-center gap-2">
                        <CustomTooltip
                            size="small"
                            title={messages('filter.filterByStatus', {
                                value: messages(
                                    getIntlCodeByStatus(value)
                                ).toLocaleLowerCase(),
                            })}
                        >
                            <StatusTag
                                value={value}
                                onClick={() =>
                                    onChangeFilter({ status: value })
                                }
                                className="cursor-pointer group-hover:underline"
                            />
                        </CustomTooltip>
                        {isOvertime && !isDone && !isCancel && (
                            <CustomTooltip
                                size="small"
                                title={messages('filter.filterByStatus', {
                                    value: messages(
                                        'order.status.deadline'
                                    ).toLocaleLowerCase(),
                                })}
                            >
                                <Tag
                                    bordered={false}
                                    color="red"
                                    className="cursor-pointer group-hover:underline"
                                    onClick={() =>
                                        onChangeFilter({
                                            status: ORDER_STATUS.OVERDUE,
                                        })
                                    }
                                >
                                    {messages('common.overtime')}
                                </Tag>
                            </CustomTooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.use'),
            dataIndex: COLUMN_ORDER_DISPLAY.UsedStatus,
            align: 'left',
            width: 150,
            render: (value: USED_STATUS, record: OrderData) => {
                return (
                    <UsedStatusSelect
                        defaultValue={record.usedStatus}
                        orderId={record.id}
                        allowClear
                    />
                );
            },
        },
        {
            title: messages('productType.label'),
            dataIndex: COLUMN_ORDER_DISPLAY.OrderType,
            align: 'center',
            width: 140,
            render: (value, record) => {
                const tagsName = record?.orderProduct?.map((item) => {
                    return getNameByLocale(
                        item?.productType?.nameEn,
                        item?.productType?.nameVi,
                        locale
                    );
                });

                return (
                    // <ProductTypeTags
                    //     data={record?.orderProduct as OrderProduct[]}
                    //     onChangeFilter={onChangeFilter}
                    // />

                    <PopoverTags tags={tagsName} />
                );
            },
        },
        {
            title: messages('common.dateCreated'),
            dataIndex: COLUMN_ORDER_DISPLAY.DateCreated,
            align: 'center',
            width: 130,
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                COLUMN_ORDER_DISPLAY.DateCreated
            ),
            render: (value) => (
                <p className="mx-auto max-w-20">{formattedDate(value)}</p>
            ),
        },
        {
            title: messages('common.deadline'),
            dataIndex: COLUMN_ORDER_DISPLAY.Deadline,
            align: 'center',
            width: 130,
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                COLUMN_ORDER_DISPLAY.Deadline
            ),
            render: (value) => (
                <p className="mx-auto max-w-20">{formattedDate(value)}</p>
            ),
        },

        // {
        //     title: messages('common.dateUpdated'),
        //     dataIndex: 'dateUpdated',
        //     align: 'center',
        //     width: 150,
        //     render: (value) => formattedDate(value),
        // },
        {
            // title: messages('common.action'),
            dataIndex: 'action',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (value, record) => {
                const isCompleted = record.status === ORDER_STATUS.COMPLETED;
                const isNew = record.status === ORDER_STATUS.NEW;
                const isCancel = record.status === ORDER_STATUS.CANCEL;

                return (
                    <ActionButton
                        showComment={
                            !isNew &&
                            (canReview || record.userCreatorId === profile.id)
                        }
                        showDetail
                        showUpdate={isNew && canUpdate}
                        showCancel={!isCompleted && !isCancel}
                        showDelete={!isCompleted && canDelete}
                        showContinue={isCancel}
                        onShowContinue={() =>
                            openModal(TYPE_MODAL_ORDER.CONTINUE, record)
                        }
                        onShowComment={() =>
                            openModal(TYPE_MODAL_ORDER.COMMENT, record)
                        }
                        onShowDetail={() =>
                            openModal(TYPE_MODAL_ORDER.DETAIL, record)
                        }
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_ORDER.UPDATE, record)
                        }
                        onShowCancel={() =>
                            openModal(TYPE_MODAL_ORDER.CANCEL, record)
                        }
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_ORDER.DELETE, record)
                        }
                    />
                );
            },
        },
    ];

    const newColumns = columns.map((column) => ({
        ...column,
        hidden: !visibleColumns.includes(
            column.dataIndex as COLUMN_ORDER_DISPLAY
        ),
    }));

    if (!visible) return null;

    return (
        <AppTable
            {...props}
            pagination={false}
            // size="large"
            columns={newColumns}
            rowClassName={() => 'group'}
        />
    );
}
