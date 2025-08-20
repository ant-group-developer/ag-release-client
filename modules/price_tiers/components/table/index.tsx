import ActionButton from '@/components/ui/button/action-button';
import CurrenciesSelect from '@/components/ui/select/currencies-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    formatCurrency,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_PRICE_TIERS } from '../../enums';
import { useUpdatePriceTiers } from '../../hooks/use-update-tiers';
import { PriceTiersData, PriceTiersDataFilter } from '../../types';

type Props = Omit<AppTableProps<PriceTiersData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: PriceTiersDataFilter;
};

export const PriceTiersTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updatePriceTiers } = useUpdatePriceTiers();

    const column: ColumnType<PriceTiersData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
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
            render: (value, record) => (
                <span className="flex items-center gap-1">
                    <span className="truncate">
                        {' '}
                        {formatCurrency(record?.amount, record?.currency?.code)}
                    </span>
                </span>
            ),
        },
        {
            title: messages('currencies.label'),
            key: 'currencyId',
            dataIndex: 'currencyId',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (value, record) => (
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
            render: (value, record) => (
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
            render: (value, record) => (
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
                        defaultChecked={record?.isActive}
                        onChange={(value) =>
                            updatePriceTiers({
                                id: record?.id,
                                payload: { isActive: value },
                            })
                        }
                    />
                </CustomTooltip>
            ),
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
            render: (value) => (
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
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_PRICE_TIERS.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_PRICE_TIERS.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
};
