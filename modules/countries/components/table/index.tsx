import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_COUNTRIES } from '../../enums';
import { CountriesData, CountriesDataFilter } from '../../types';

// Table cho Countries

type Props = Omit<AppTableProps<CountriesData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: CountriesDataFilter;
};

export const CountriesTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<CountriesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('country.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 110,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        // {
        //     title: 'ISO3',
        //     key: 'iso3',
        //     dataIndex: 'iso3',
        //     align: 'left',
        //     width: 60,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'iso3'
        //     ),
        // },
        {
            title: 'ISO2',
            key: 'iso2',
            dataIndex: 'iso2',
            align: 'left',
            width: 50,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'iso2'
            ),
        },
        // {
        //     title: messages('common.numericCode'),
        //     key: 'numericCode',
        //     dataIndex: 'numericCode',
        //     align: 'left',
        //     width: 60,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'numericCode'
        //     ),
        // },
        // {
        //     title: messages('common.capital'),
        //     key: 'capital',
        //     dataIndex: 'capital',
        //     align: 'left',
        //     width: 100,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'capital'
        //     ),
        // },
        // {
        //     title: messages('common.currency'),
        //     key: 'currency',
        //     dataIndex: 'currency',
        //     align: 'left',
        //     width: 80,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'currency'
        //     ),
        // },
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
            width: 20,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_COUNTRIES.DELETE, record);
                    }}
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_COUNTRIES.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
};
