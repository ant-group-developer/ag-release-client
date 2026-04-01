import ActionsDspSelect from '@/components/ui/select/actions-dsp-select';
import PriceTiersSelect from '@/components/ui/select/price-tiers-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getIndex } from '@/helpers/common';
import { getTrackDetailRoute, RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { Link } from '@/i18n/routing';
import { useGetListEnablePolicyDsp } from '@/modules/dsp/hooks/use-get-list-enable-policy-dsp';
import { DspData } from '@/modules/dsp/types';
import { PRICE_TIER_TYPE } from '@/modules/price_tiers/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/releases/types';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { useUpdateTrackPolicy } from '@/modules/tracks/hooks/use-update-track-policy';
import { Table, TableColumnsType, theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<TrackData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseSchedulingTable({ ...props }: Props) {
    const messages = useTranslations();

    const { updateTrackDraft } = useUpdateTrackDraft();

    const { updateTrackPolicy } = useUpdateTrackPolicy();

    const { dspData } = useGetListEnablePolicyDsp();

    const action = useReleaseActionStore((s) => s.action);

    const formValues = useReleaseFormStore((state) => state.formValues);

    const { token } = theme.useToken();

    const isCanEdit = action === RELEASE_DETAIL_ACTION.EDIT;

    // const trackPolicies = props?.dataSource?.find(
    //     (track) => track?.trackPolicies?.length > 0
    // )?.trackPolicies;

    const columns: TableColumnsType<TrackData> = [
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: 'ino',
            width: 50,
            fixed: 'left',
            align: 'center',
            render: (_: any, __: any, index: number) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: `${messages('release.label')} / ${messages('track.label')}`,
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
            width: 175,
            align: 'center',
            render: (value: string, record) => {
                return (
                    <PriceTiersSelect
                        disabled={!isCanEdit}
                        defaultValue={record?.priceTier?.id}
                        className="w-full"
                        variant="borderless"
                        params={{
                            isActive: true,
                            type: PRICE_TIER_TYPE.TRACK,
                        }}
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
        ...(dspData && dspData.length > 0
            ? [
                  {
                      title: messages('common.policy'),
                      colSpan: dspData?.length <= 1 ? 0 : dspData?.length,
                      align: 'center' as const,
                      children: dspData?.map((item: DspData) => {
                          return {
                              title: (
                                  <div className="flex flex-col items-center gap-1">
                                      <div>{item?.name}</div>
                                      {/* <PriceTiersSelect
                                          disabled={!isCanEdit}
                                          className="w-full"
                                          allowClear
                                      /> */}
                                  </div>
                              ),
                              dataIndex: `dsp_${item.id}`,
                              key: item.id,
                              align: 'left' as const,
                              width: 150,
                              render: (value: string, record: TrackData) => {
                                  const trackPolicy =
                                      record.trackPolicies?.find(
                                          (p) => p.dspId === item?.id
                                      );

                                  return (
                                      <ActionsDspSelect
                                          dspId={item?.id}
                                          defaultValue={trackPolicy?.action?.id}
                                          disabled={!isCanEdit}
                                          className="w-full"
                                          variant="borderless"
                                          onChange={(value) =>
                                              updateTrackPolicy({
                                                  id: record.id,
                                                  actionId: value,
                                                  trackPolicyId:
                                                      trackPolicy?.id as string,
                                              })
                                          }
                                          actions={item?.dspActions}
                                      />
                                  );
                              },
                          };
                      }),
                  },
              ]
            : []),
    ];

    const releaseSummaryRow = () => {
        return (
            <Table.Summary fixed="top">
                <Table.Summary.Row style={{ background: token.colorFillAlter }}>
                    {/* # column */}
                    <Table.Summary.Cell
                        index={0}
                        align="center"
                        className="!bg-[var(--summary-bg)]"
                    ></Table.Summary.Cell>

                    {/* Release name column */}
                    <Table.Summary.Cell
                        index={1}
                        align="left"
                        className="!bg-[var(--summary-bg)]"
                    >
                        <span>{formValues?.title || '—'}</span>
                    </Table.Summary.Cell>

                    {/* Price column */}
                    <Table.Summary.Cell index={2} align="left">
                        <PriceTiersSelect
                            disabled={!isCanEdit}
                            className="w-full"
                            variant="borderless"
                            allowClear
                            params={{
                                isActive: true,
                                type: PRICE_TIER_TYPE.ALBUM,
                            }}
                        />
                    </Table.Summary.Cell>

                    {/* DSP columns */}
                    {dspData?.map((item: DspData, idx: number) => (
                        <Table.Summary.Cell
                            key={item.id}
                            index={3 + idx}
                            align="left"
                        >
                            <ActionsDspSelect
                                dspId={item?.id}
                                disabled={!isCanEdit}
                                className="w-full"
                                actions={item?.dspActions}
                                variant="borderless"
                                allowClear
                            />
                        </Table.Summary.Cell>
                    ))}
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    return (
        <AppTable
            bordered
            rowClassName={'group'}
            columns={columns}
            summary={releaseSummaryRow}
            {...props}
            pagination={false}
        />
    );
}
