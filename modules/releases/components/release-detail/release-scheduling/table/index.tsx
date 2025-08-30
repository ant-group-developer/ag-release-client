import ActionsDspSelect from '@/components/ui/select/actions-dsp-select';
import PriceTiersSelect from '@/components/ui/select/price-tiers-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getTrackDetailRoute, RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { Link } from '@/i18n/routing';
import { TrackData } from '@/modules/releases/types';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { useUpdateTrackPolicy } from '@/modules/tracks/hooks/use-update-track-policy';
import { TrackPolicyData } from '@/modules/tracks/types';
import { TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<TrackData>, 'columns'> & {};

export default function ReleaseSchedulingTable({ ...props }: Props) {
    const messages = useTranslations();

    const { updateTrackDraft } = useUpdateTrackDraft();

    const { updateTrackPolicy } = useUpdateTrackPolicy();

    const { action } = useGetReleaseDetailRoute();

    const isCanEdit = action === RELEASE_DETAIL_ACTION.EDIT;

    const trackPolicies = props?.dataSource?.find(
        (track) => track?.trackPolicies?.length > 0
    )?.trackPolicies;

    const columns: TableColumnsType<TrackData> = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: 'ino',
            width: 50,
            fixed: 'left',
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: messages('track.name'),
            dataIndex: 'track',
            key: 'track',
            width: 400,
            fixed: 'left',
            align: 'left',
            ellipsis: true,
            render: (_, record) => (
                <CustomTooltip title={messages('common.viewDetail')}>
                    <Link
                        href={getTrackDetailRoute(
                            record?.id,
                            TRACK_TABS.METADATA
                        )}
                    >
                        <span className="cursor-pointer group-hover:underline">
                            {record?.title}
                        </span>
                    </Link>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.price'),
            dataIndex: 'priceCode',
            key: 'priceCode',
            width: 150,

            align: 'left',
            render: (value: string, record) => {
                return (
                    <PriceTiersSelect
                        disabled={!isCanEdit}
                        defaultValue={record?.priceTier?.id}
                        className="w-full"
                        onChange={(value) =>
                            updateTrackDraft({
                                id: record?.id,
                                payload: {
                                    priceTierId: value,
                                },
                            })
                        }
                    />
                );
            },
        },
        {
            title: messages('common.policy'),
            colSpan: trackPolicies?.length,
            align: 'center',
            children: trackPolicies?.map((item: TrackPolicyData) => {
                const dsp = item?.dsp;
                return {
                    title: dsp.name,
                    dataIndex: `dsp_${dsp.id}`,
                    key: dsp.id,
                    align: 'left' as const,
                    width: 250,
                    render: (value: string, record: TrackData) => {
                        const trackPolicy = record.trackPolicies?.find(
                            (p) => p.dspId === dsp?.id
                        );
                        return (
                            <ActionsDspSelect
                                dspId={dsp?.id}
                                defaultValue={trackPolicy?.action?.id}
                                disabled={!isCanEdit}
                                className="w-full"
                                onChange={(value) =>
                                    updateTrackPolicy({
                                        id: record.id,
                                        actionId: value,
                                        trackPolicyId:
                                            trackPolicy?.id as string,
                                    })
                                }
                            />
                        );
                    },
                };
            }),
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
