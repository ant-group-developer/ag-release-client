import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import CurrenciesSelect from '@/components/ui/select/currencies-select';
import SortableTable, { OnDragEnd } from '@/components/ui/table/sortable-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    formatCurrency,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Switch, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { PRICE_TIER_TYPE, TYPE_MODAL_PRICE_TIERS } from '../../enums';
import { useBulkUpdatePriceTiers } from '../../hooks/use-bulk-update-tiers';
import { useUpdatePriceTiers } from '../../hooks/use-update-tiers';
import { PriceTiersData, PriceTiersDataFilter } from '../../types';

type Props = any & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: PriceTiersDataFilter;
};

export default function PriceTiersTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updatePriceTiers } = useUpdatePriceTiers();
    const { updatePriceTiersOrder } = useBulkUpdatePriceTiers();

    const handleDragEnd: OnDragEnd<PriceTiersData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        updatePriceTiersOrder({
            priceTiers: payload,
        });
    };

    const column: ColumnType<PriceTiersData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
            render: () => null,
        },
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_: any, __: any, index: number) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('price.label'),
            key: 'amount',
            dataIndex: 'amount',
            align: 'left',
            width: 100,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => (
                <span className="flex items-center gap-1">
                    <span className="truncate">
                        {' '}
                        {formatCurrency(record?.amount, record?.currency?.code)}
                    </span>
                </span>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => (
                <CopyText text={record?.code}>
                    <span className="truncate">{record?.code}</span>
                </CopyText>
            ),
        },
        {
            title: 'CI Code',
            key: 'ciCode',
            dataIndex: 'ciCode',
            align: 'left',
            width: 100,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => (
                <CopyText text={record?.ciCode}>
                    <span className="truncate">{record?.ciCode}</span>
                </CopyText>
            ),
        },
        {
            title: messages('price.type'),
            key: 'type',
            dataIndex: 'type',
            align: 'center',
            width: 80,
            render: (value: PRICE_TIER_TYPE) => {
                const label =
                    value === PRICE_TIER_TYPE.ALBUM
                        ? messages('price.album')
                        : messages('price.track');
                return <Tag>{label}</Tag>;
            },
        },
        {
            title: messages('currencies.label'),
            key: 'currencyId',
            dataIndex: 'currencyId',
            align: 'left',
            width: 130,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => (
                <div>
                    <CurrenciesSelect
                        fallBack={`${record?.currency.code} - ${record?.currency.name}`}
                        defaultValue={value}
                        className="w-full"
                        onChange={(value) =>
                            updatePriceTiers({
                                id: record?.id,
                                payload: { currencyId: value },
                            })
                        }
                    />
                </div>
            ),
        },
        {
            title: messages('common.setIsDefault'),
            key: 'isDefault',
            dataIndex: 'isDefault',
            align: 'center',
            width: 100,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => (
                <Switch
                    disabled={!record?.isActive}
                    value={record?.isDefault}
                    onChange={(value) =>
                        updatePriceTiers({
                            id: record?.id,
                            payload: { isDefault: value },
                        })
                    }
                />
            ),
        },
        {
            title: messages('status.active'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 100,
            ellipsis: true,
            render: (value: any, record: PriceTiersData) => {
                return (
                    <CustomTooltip
                        title={
                            record.isDefault
                                ? messages(
                                      'priceTier.canDeactivateOnlyWhenNotDefault'
                                  )
                                : ''
                        }
                    >
                        <Switch
                            disabled={record?.isDefault}
                            // defaultChecked={record?.isActive}
                            checked={record?.isActive}
                            value={record?.isActive}
                            onChange={(value) =>
                                updatePriceTiers({
                                    id: record?.id,
                                    payload: { isActive: value },
                                })
                            }
                        />
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value: any) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value: any) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_: any, record: PriceTiersData) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_PRICE_TIERS.UPDATE, record);
                    }}
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_PRICE_TIERS.DELETE, record)
                    }
                />
            ),
        },
    ];

    return (
        <SortableTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
            onDragEnd={handleDragEnd}
        />
    );
}
