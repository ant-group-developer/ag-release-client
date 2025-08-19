import PriceTiersSelect from '@/components/ui/select/price-tiers-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useGetListDspAction } from '@/modules/dsp-action/hooks/use-get-list-dsp-action';
import { DspActionData } from '@/modules/dsp-action/types';
import { DspData } from '@/modules/dsp/types';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import { TrackData } from '@/modules/releases/types';
import { Select, TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<TrackData>, 'columns'> & {};

export default function ReleaseSchedulingTable({ ...props }: Props) {
    const messages = useTranslations();
    const { dspActionsData } = useGetListDspAction({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const { priceTiersData } = useGetListPriceTiers({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const dspColumn = dspActionsData?.items?.map((item: DspData) => {
        const defaultAction = item?.dspActions?.find(
            (item) => item?.isDefault === true
        );
        const options = item?.dspActions.map((item: DspActionData) => ({
            id: item.action.id,
            value: item.action.id,
            name: item?.action.name,
            label: (
                <p className="flex items-center justify-between gap-1">
                    <span>{item?.action?.name}</span>
                    {item?.action?.note && (
                        <IconInfoTooltip title={item?.action?.note} />
                    )}
                </p>
            ),
        }));
        return {
            title: item.name,
            dataIndex: `dsp_${item.id}`,
            key: item.id,
            width: 300,
            align: 'left' as const,
            render: (value: string) => (
                <Select
                    defaultValue={defaultAction?.action?.id}
                    options={options}
                    className="w-full"
                />
            ),
        };
    });

    const columns: TableColumnsType<TrackData> = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: 'ino',
            width: 50,
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: messages('tracks.name'),
            dataIndex: 'track',
            key: 'track',
            width: 500,
            align: 'left',
            ellipsis: true,
            render: (_, record) => (
                <span className="truncate">
                    {' '}
                    <CustomTooltip title={record?.title}>
                        {record?.title}
                    </CustomTooltip>
                </span>
            ),
        },
        {
            title: messages('common.price'),
            dataIndex: 'priceCode',
            key: 'priceCode',
            width: 166,

            align: 'left',
            render: (value: string) => {
                const defaultPriceTier = priceTiersData?.items?.find(
                    (item) => item?.isDefault === true
                );
                return (
                    <PriceTiersSelect
                        defaultValue={defaultPriceTier?.id}
                        className="w-full"
                    />
                );
            },
        },
        {
            title: messages('common.policy'),
            colSpan: dspActionsData?.metadata?.totalItems,
            align: 'center',
            children: dspColumn,
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
