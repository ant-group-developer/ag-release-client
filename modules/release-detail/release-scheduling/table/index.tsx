import FacebookPolicySelect from '@/components/ui/select/facebook-policy-select';
import TikTokPolicySelect from '@/components/ui/select/tiktok-policy-select';
import YoutubePolicySelect from '@/components/ui/select/youtube-policy-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { Select, TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';

interface ReleaseSchedulingTableDataItem {
    key: string;
    track: string;
    priceCode: string;
    tikTokPolicy: string;
    facebookPolicy: string;
    youtubePolicy: string;
}

type Props = Omit<
    AppTableProps<ReleaseSchedulingTableDataItem>,
    'columns'
> & {};

export default function ReleaseSchedulingTable({ ...props }: Props) {
    const messages = useTranslations();
    const priceCodeList = [
        {
            label: '0.69$',
            value: '0.69',
        },
        {
            label: '0.99$',
            value: '0.99',
        },
        {
            label: '1.29$',
            value: '1.29',
        },
    ];

    const columns: TableColumnsType<ReleaseSchedulingTableDataItem> = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: 'ino',
            width: 50,
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        // {
        //     title: 'Territory',
        //     dataIndex: 'territory',
        //     key: 'territory',
        //     width: 120,
        //     align: 'left',
        // },
        // {
        //     title: 'Exclusivity',
        //     dataIndex: 'exclusivity',
        //     key: 'exclusivity',
        //     width: 120,
        //     align: 'left',
        // },
        {
            title: 'Track',
            dataIndex: 'track',
            key: 'track',
            width: 250,
            align: 'left',
        },
        {
            title: 'Price Code',
            dataIndex: 'priceCode',
            key: 'priceCode',
            width: 150,
            align: 'left',
            render: (value: string) => {
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
        // {
        //     title: 'Inst Grat Date',
        //     dataIndex: 'instGratDate',
        //     key: 'instGratDate',
        //     width: 200,
        //     align: 'left',
        //     render: (value) => {
        //         return (
        //             <DatePicker
        //                 className="w-full"
        //                 format={DATE_FORMAT.DATE_ONLY}
        //             />
        //         );
        //     },
        // },
        {
            title: 'Policy',
            colSpan: 3, // Spans across 3 columns (TikTok, Facebook, YouTube)
            align: 'center',
            children: [
                {
                    title: 'TikTok',
                    dataIndex: 'tikTokPolicy',
                    key: 'tikTokPolicy',
                    width: 200,
                    align: 'left',
                    render: (value: string) => <TikTokPolicySelect />,
                },
                {
                    title: 'Facebook',
                    dataIndex: 'facebookPolicy',
                    key: 'facebookPolicy',
                    width: 200,
                    align: 'left',
                    render: (value: string) => <FacebookPolicySelect />,
                },
                {
                    title: 'YouTube',
                    dataIndex: 'youtubePolicy',
                    key: 'youtubePolicy',
                    width: 250,
                    align: 'left',
                    render: (value: string) => <YoutubePolicySelect />,
                },
            ],
        },
    ];

    return (
        <AppTable
            pagination={false}
            rowClassName={'group'}
            columns={columns}
            {...props}
        />
    );
}
