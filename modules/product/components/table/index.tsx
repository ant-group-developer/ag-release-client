import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import ProductTypeTag from '@/components/ui/tag/product-type-tag';
import StatusTag from '@/components/ui/tag/status-tag';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { OPACITY_TAG } from '@/constants/common';
import {
    formattedDate,
    getIntlCodeByStatus,
    getIntlCodeByTypeUpload,
    getSortOrder,
    hexToRGBA,
} from '@/helpers/common';
import { getFallbackUrl, getLinkDrive } from '@/helpers/link';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ORDER_STATUS } from '@/modules/order/enums';
import { PriorityData } from '@/modules/priorities/types';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    COLUMN_PRODUCT_DISPLAY,
    PRODUCT_TYPE,
    TYPE_MODAL_PRODUCT,
} from '../../enums';
import { useUpdateOrderProduct } from '../../hooks/use-update-orderProduct';
import { DataFilterProduct, ProductData } from '../../types';
import ProductVideoThumbnail from '../product-video-thumbnail';
import QuickApproverSelect from '../select/quick-approver-select';
import QuickAssigneeSelect from '../select/quick-assignee-select';
import RateCell from './rate-cell';

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: DataFilterProduct;
    visibleColumns: COLUMN_PRODUCT_DISPLAY[];
    onChangeFilter: OnChangeFilter<DataFilterProduct>;
    visible?: boolean;
} & Omit<AppTableProps<ProductData>, 'columns'>;

export default function ProductTable({
    visibleColumns,
    dataFilter,
    onChangeFilter,
    visible = true,
    ...props
}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const [editRateCell, setEditRateCell] = useState('');
    const openModal = useModalStore((state) => state.openModal);
    const { updateOrderProduct } = useUpdateOrderProduct();
    const { canUploadFile, canManage } = usePermissionStore(
        (state) => state.permission.product
    );
    const { profile } = useAuth();

    const getThumbnailUrl = (record: ProductData, width: number) => {
        const file = record?.product?.file;

        if (file.googleDriveFileId) {
            return getLinkDrive(file.googleDriveFileId);
        }

        return file.readUrl;
    };

    const handleChangeRate = (e: any, record: ProductData) => {
        updateOrderProduct({
            orderProductId: record.id,
            payload: {
                rate: Number(e.target.value),
            },
        });
        setEditRateCell('');
    };

    // const getThumbnailUrlGoogleDriver = (record: ProductData) => {
    //     const googleDriveFolderId = record?.order?.googleDriveFolderId;
    // };

    const columns: ColumnType<ProductData>[] = [
        // {
        //     title: messages('common.iNo'),
        //     dataIndex: '',
        //     key: '',
        //     align: 'center',
        //     width: 50,
        //     render: (_, __, index) =>
        //         getIndex(
        //             props.pagination.pageSize,
        //             props.pagination.current,
        //             index
        //         ),
        // },
        {
            title: messages('product.label'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.PRODUCT,
            align: 'center',
            fixed: 'left',
            width: 160,
            render: (value, record) => {
                const width = 150;
                const type = record?.productType?.code;

                const productUrl = getThumbnailUrl(record, width);
                const fallback = getFallbackUrl(type);

                if (type === PRODUCT_TYPE.VIDEO) {
                    return (
                        <ProductVideoThumbnail
                            onClick={() =>
                                openModal(TYPE_MODAL_PRODUCT.COMMENT, record)
                            }
                            googleDriveFileId={
                                record?.product?.file?.googleDriveFileId ?? ''
                            }
                            width={width}
                            height={80}
                            fallbackSrc={fallback}
                            alt={record.order?.code}
                        />
                    );
                }

                return (
                    <ImageFallback
                        onClick={() =>
                            openModal(TYPE_MODAL_PRODUCT.COMMENT, record)
                        }
                        className="aspect-video max-h-20 cursor-pointer rounded-lg object-cover"
                        src={productUrl ?? fallback}
                        alt={record.order?.code}
                        fallbackSrc={fallback}
                        height={80}
                        width={width}
                    />
                );
            },
        },
        {
            title: messages('common.code'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.CODE,
            align: 'center',
            width: 120,
            fixed: 'left',
            ellipsis: true,
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                COLUMN_PRODUCT_DISPLAY.CODE
            ),
            render: (value, record) => (
                <div>
                    <CustomTooltip
                        title={messages('filter.filterByCode', {
                            value: record.order?.code,
                        })}
                        size="small"
                    >
                        <span
                            onClick={() =>
                                onChangeFilter({ keyword: record.order?.code })
                            }
                            className="cursor-pointer truncate hover:text-blue-500 group-hover:underline group-hover:underline-offset-4"
                        >
                            {record.order?.code}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.userCreator'),
            // dataIndex: 'userCreatorId',
            dataIndex: COLUMN_PRODUCT_DISPLAY.CREATOR,
            align: 'left',
            width: 180,
            ellipsis: true,
            render: (value, record) => (
                <div>
                    <CustomTooltip
                        title={messages('filter.filterByUsername', {
                            value: record?.order?.creatorUser?.name,
                        })}
                        size="small"
                    >
                        <span
                            onClick={() =>
                                onChangeFilter({
                                    creatorId: record?.order?.creatorUser?.id,
                                })
                            }
                            className="cursor-pointer truncate hover:text-blue-500 group-hover:underline group-hover:underline-offset-4"
                        >
                            {record?.order?.creatorUser?.name}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.assignee'),
            // dataIndex: 'assigneeId',
            dataIndex: COLUMN_PRODUCT_DISPLAY.ASSIGNEE,
            key: 'assigneeId',
            align: 'left',
            width: 210,
            ellipsis: true,
            render: (value, record) => {
                const isInProgress = record.status === ORDER_STATUS.IN_PROGRESS;
                const isNew = record.status === ORDER_STATUS.NEW;
                const isCompleted = record.status === ORDER_STATUS.COMPLETED;
                const isPendingApprove =
                    record.status === ORDER_STATUS.PENDING_APPROVAL;

                const disabled = !canManage || isCompleted || isPendingApprove;

                if (disabled) {
                    return (
                        <div>
                            <CustomTooltip
                                title={messages('filter.filterByValue', {
                                    value: record?.assigneeUser?.name,
                                })}
                                size="small"
                            >
                                <span
                                    onClick={() =>
                                        onChangeFilter({
                                            assigneeId:
                                                record?.assigneeUser?.id,
                                        })
                                    }
                                    className="cursor-pointer truncate hover:text-blue-500 group-hover:underline group-hover:underline-offset-4"
                                >
                                    {record?.assigneeUser?.name}
                                </span>
                            </CustomTooltip>
                        </div>
                    );
                }

                return (
                    <div className="flex gap-1">
                        <div className="min-w-0 flex-1">
                            <QuickAssigneeSelect
                                allowClear={isNew || isInProgress}
                                disabled={disabled}
                                selectedRowKeys={[record.id]}
                                value={record?.assigneeUser?.id}
                                fallback={record?.assigneeUser?.name}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('common.approver'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.APPROVER,
            key: 'approverId',
            align: 'left',
            width: 210,
            ellipsis: true,
            render: (value, record) => {
                const isInProgress = record.status === ORDER_STATUS.IN_PROGRESS;
                const isCompleted = record.status === ORDER_STATUS.COMPLETED;
                const isPendingApprove =
                    record.status === ORDER_STATUS.PENDING_APPROVAL;

                const disabled = !canManage || isCompleted || isPendingApprove;

                if (disabled) {
                    return (
                        <div>
                            <CustomTooltip
                                title={messages('filter.filterByValue', {
                                    value: record?.approverUser?.name,
                                })}
                                size="small"
                            >
                                <span
                                    onClick={() =>
                                        onChangeFilter({
                                            approverId:
                                                record?.approverUser?.id,
                                        })
                                    }
                                    className="cursor-pointer truncate hover:text-blue-500 group-hover:underline group-hover:underline-offset-4"
                                >
                                    {record?.approverUser?.name}
                                </span>
                            </CustomTooltip>
                        </div>
                    );
                }

                return (
                    <div className="flex gap-1">
                        <div className="min-w-0 flex-1">
                            <QuickApproverSelect
                                disabled={disabled}
                                selectedRowKeys={[record.id]}
                                value={record?.approverUser?.id}
                                fallback={record?.approverUser?.name}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('rating.point'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.RATE,
            key: 'rate',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (value, record) => (
                <RateCell
                    record={record}
                    editRateCell={editRateCell}
                    setEditRateCell={setEditRateCell}
                    handleChangeRate={handleChangeRate}
                    canManage={canManage}
                />
            ),
        },
        {
            title: messages('common.description'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.DESCRIPTION,
            key: 'description',
            align: 'left',
            width: 360,
            ellipsis: true,
            render: (value, record) => (
                <span className="line-clamp-3 whitespace-pre-line">
                    {record.description}
                </span>
            ),
        },
        {
            title: messages('priority.label'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.PRIORITY,
            align: 'center',
            width: 120,
            render: (value, record) => {
                const priority: PriorityData = record?.order?.priority;

                const priorityName = getNameByLocale(
                    priority?.nameEn as string,
                    priority?.nameVi as string,
                    locale
                );

                const rgbaColor = hexToRGBA(priority?.color, OPACITY_TAG);

                if (!priority?.color) return null;

                return (
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
                                    priorityId: priority?.id,
                                })
                            }
                        >
                            <span
                                style={{
                                    color: priority?.color,
                                    textDecorationColor: priority?.color,
                                }}
                                className="group-hover:underline"
                            >
                                {priorityName}
                            </span>
                        </Tag>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('product.type'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.TYPE,
            key: 'type',
            align: 'center',
            width: 130,
            render: (value, record) => {
                const productTypeName = getNameByLocale(
                    record?.productType?.nameEn,
                    record?.productType?.nameVi,
                    locale
                );

                return (
                    <CustomTooltip
                        title={messages('filter.filterByProductType', {
                            value: messages(
                                getIntlCodeByTypeUpload(value)
                            ).toLowerCase(),
                        })}
                        size="small"
                    >
                        <ProductTypeTag
                            color={record?.productType?.color}
                            name={productTypeName}
                            onClick={() =>
                                onChangeFilter({
                                    productTypeId: record?.productType?.id,
                                })
                            }
                            className="cursor-pointer hover:text-blue-500 group-hover:underline"
                        />
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.status'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.STATUS,
            key: 'status',
            align: 'center',
            width: 150,
            render: (value, record) => {
                const deadline = record.order?.deadline;
                const isDone = record.status === ORDER_STATUS.COMPLETED;
                const isCancel = record.status === ORDER_STATUS.CANCEL;
                const isOvertime = deadline && new Date(deadline) < new Date();
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
                                    color="red"
                                    bordered={false}
                                    className="cursor-pointer group-hover:underline"
                                    onClick={() =>
                                        onChangeFilter({
                                            status: ORDER_STATUS.OVERDUE,
                                        })
                                    }
                                >
                                    {messages('common.overtime')}{' '}
                                </Tag>
                            </CustomTooltip>
                        )}
                    </div>
                );
            },
        },

        {
            title: messages('common.dateCreated'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.DATE_CREATED,
            align: 'center',
            width: 130,
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                COLUMN_PRODUCT_DISPLAY.DATE_CREATED
            ),
            render: (value, record) => (
                <p className="mx-auto max-w-20">
                    {formattedDate(record.order?.dateCreated)}
                </p>
            ),
        },
        {
            title: messages('common.deadline'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.DEADLINE,
            align: 'center',
            width: 130,
            sorter: true,
            showSorterTooltip: { placement: 'bottom' },
            sortOrder: getSortOrder(
                dataFilter.order,
                dataFilter.orderBy,
                COLUMN_PRODUCT_DISPLAY.DEADLINE
            ),
            render: (value, record) => (
                <p className="mx-auto max-w-20">
                    {formattedDate(record.order?.deadline)}
                </p>
            ),
        },
        // {
        //     title: messages('common.dateUpdated'),
        //     dataIndex: 'dateUpdated',
        //     key: 'dateUpdated',
        //     align: 'center',
        //     width: 120,
        //     render: (value) => formattedDate(value),
        // },
        {
            // title: messages('common.action'),
            dataIndex: COLUMN_PRODUCT_DISPLAY.ACTION,
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (value, record) => {
                const isDone = record.status === ORDER_STATUS.COMPLETED;
                const isNew = record.status === ORDER_STATUS.NEW;
                return (
                    <ActionButton
                        showComment={!isNew}
                        showDetail
                        showUpload={
                            !isDone &&
                            (canUploadFile || record.assigneeId === profile.id)
                        }
                        onShowComment={() =>
                            openModal(TYPE_MODAL_PRODUCT.COMMENT, record)
                        }
                        onShowDetail={() =>
                            openModal(TYPE_MODAL_PRODUCT.DETAIL, record)
                        }
                        onShowUpload={() =>
                            openModal(TYPE_MODAL_PRODUCT.UPLOAD, record)
                        }
                    />
                );
            },
        },
    ];

    const newColumns = columns.map((column) => ({
        ...column,
        hidden: !visibleColumns.includes(
            column.dataIndex as COLUMN_PRODUCT_DISPLAY
        ),
    }));

    if (!visible) return null;

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={newColumns}
            rowClassName={() => 'group'}
        />
    );
}
