import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { DATE_FORMAT } from '@/enums/common';
import { DatePicker, Select } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<any>, 'columns'> & {};

export default function ReleaseSchedulingTable({ ...props }: Props) {
    const messages = useTranslations();
    const priceCodeList = [
        {
            label: '1 Low Track Single',
            value: '0.69',
        },
        {
            label: '1 Mid Track Single',
            value: '0.99',
        },
        {
            label: '1 Premium Track Single',
            value: '1.29',
        },
    ];

    const columns: ColumnType<any>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: '',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Territory',
            dataIndex: 'territory',
            key: 'territory',
            width: 120,
            align: 'left',
        },
        {
            title: 'Exclusivity',
            dataIndex: 'exclusivity',
            key: 'exclusivity',
            width: 120,
            align: 'left',
        },
        {
            title: 'Track',
            dataIndex: 'track',
            key: 'track',
            width: 180,
            align: 'left',
        },
        {
            title: 'Price Code',
            dataIndex: 'priceCode',
            key: 'priceCode',
            width: 100,
            align: 'left',
            render: (value) => {
                return (
                    <Select
                        options={priceCodeList}
                        defaultValue={priceCodeList[0]}
                        className="w-full"
                    />
                );
            },
        },
        // {
        //     title: 'Release Date',
        //     dataIndex: 'releaseDate',
        //     key: 'releaseDate',
        //     width: 120,
        //     align: 'center',
        // },
        // {
        //     title: 'Pre-Order Date',
        //     dataIndex: 'preOrderDate',
        //     key: 'preOrderDate',
        //     width: 120,
        //     align: 'center',
        // },
        {
            title: 'Inst Grat Date',
            dataIndex: 'instGratDate',
            key: 'instGratDate',
            width: 120,
            align: 'center',
            render: (value) => {
                return (
                    <DatePicker
                        className="w-full"
                        format={DATE_FORMAT.DATE_ONLY}
                    />
                );
            },
        },
        {
            title: 'PD',
            dataIndex: 'pd',
            key: 'pd',
            width: 40,
            align: 'center',
        },
        {
            title: 'ETU',
            dataIndex: 'etu',
            key: 'etu',
            width: 40,
            align: 'center',
        },
        {
            title: 'Ad SS',
            dataIndex: 'adSs',
            key: 'adSs',
            width: 40,
            align: 'center',
        },
        {
            title: 'UGC',
            dataIndex: 'ugc',
            key: 'ugc',
            width: 100,
            align: 'left',
            render: (value) => {
                return (
                    <Select
                        className="w-full"
                        options={[
                            {
                                label: 'Monetize',
                                value: 'Monetize',
                            },
                            { label: 'Block', value: 'Block' },
                            { label: 'Track', value: 'Track' },
                        ]}
                        defaultValue="Monetize"
                    />
                );
            },
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            rowClassName={'group'}
            columns={columns}
            className="custom-scrollbar"
            scroll={{ y: 49 * 6 }}
        />
    );
}
