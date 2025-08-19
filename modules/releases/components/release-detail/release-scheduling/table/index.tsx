import ActionsSelect from '@/components/ui/select/actions-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { useGetListDspAction } from '@/modules/dsp-action/hooks/use-get-list-dsp-action';
import { DspData } from '@/modules/dsp/types';
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
    const { dspActionsData } = useGetListDspAction({ pageSize: 999 });

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

    const dspColumn = dspActionsData?.items?.map((item: DspData) => {
        const defaultAction = item?.dspActions?.find(
            (item) => item?.isDefault === true
        );
        return {
            title: item.name,
            dataIndex: `dsp_${item.id}`,
            key: item.id,
            width: 200,
            align: 'left' as const,
            render: (value: string) => (
                <ActionsSelect
                    defaultValue={defaultAction?.action?.id}
                    className="w-full"
                />
            ),
        };
    });

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
            title: messages('tracks.name'),
            dataIndex: 'track',
            key: 'track',
            width: 250,
            align: 'left',
        },
        {
            title: messages('common.price'),
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
            title: messages('common.policy'),
            colSpan: dspActionsData?.metadata?.totalItems,
            align: 'center',
            children: dspColumn,
            //  [
            //     {
            //         title: 'TikTok',
            //         dataIndex: 'tikTokPolicy',
            //         key: 'tikTokPolicy',
            //         width: 200,
            //         align: 'left',
            //         render: (value: string) => (
            //             <ActionsSelect className="w-full" />
            //         ),
            //     },
            //     {
            //         title: 'Facebook',
            //         dataIndex: 'facebookPolicy',
            //         key: 'facebookPolicy',
            //         width: 200,
            //         align: 'left',
            //         render: (value: string) => (
            //             <ActionsSelect className="w-full" />
            //         ),
            //     },
            //     {
            //         title: 'YouTube',
            //         dataIndex: 'youtubePolicy',
            //         key: 'youtubePolicy',
            //         width: 250,
            //         align: 'left',
            //         render: (value: string) => (
            //             <ActionsSelect className="w-full" />
            //         ),
            //     },
            // ],
        },
    ];

    return (
        <AppTable
            bordered
            pagination={false}
            rowClassName={'group'}
            columns={columns}
            {...props}
        />
    );
}
