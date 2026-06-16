'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import AcrCloudScanHistoryModal from '@/modules/acr-cloud/components/modal/acr-scan-history-modal';
import AcrCloudScanModal from '@/modules/acr-cloud/components/modal/acr-scan-modal';
import AcrCloudScanResultModal from '@/modules/acr-cloud/components/modal/acr-scan-result-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import TracksTable from '@/modules/tracks/components/table';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData, TrackDataFilter } from '@/modules/tracks/types';
import { Table, theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    releaseId: string;
};

export default function TracksTab({ releaseId }: Props) {
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const messages = useTranslations();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
        onSearch,
    } = useFilter<TrackDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        releaseId: releaseId,
    });

    const { tracksData, isFetching, refetch } = useGetListTracks(dataFilter);

    const rowExpandable = (record: TrackData) => {
        if (!record.metadataExternal) return false;
        return Object.values(record.metadataExternal).some((item) => !!item);
    };

    const expandedRowRender = (record: TrackData) => {
        if (!record.metadataExternal) return null;

        const dspDataList = Object.entries(record.metadataExternal)
            .filter(([_, value]) => !!value)
            .map(([key, value]) => ({
                key,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                albumId: value?.albumId,
                albumUrl: value?.albumUrl,
                trackId: (value as any)?.trackId,
                trackUrl: (value as any)?.trackUrl,
                coverUrl: value?.coverImages?.[0]?.url,
                lastSyncedAt: value?.lastSyncedAt,
            }));

        if (dspDataList.length === 0) return null;

        const columns = [
            {
                title: messages('track.dsp'),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: messages('track.albumUrl'),
                dataIndex: 'albumUrl',
                key: 'albumUrl',
                render: (albumUrl: string) => {
                    return albumUrl ? (
                        <a
                            href={albumUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            {albumUrl}
                        </a>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                title: messages('track.trackUrl'),
                dataIndex: 'trackUrl',
                key: 'trackUrl',
                render: (trackUrl: string) => {
                    return trackUrl ? (
                        <a
                            href={trackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            {trackUrl}
                        </a>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
        ];

        return (
            <div
                className="rounded-lg p-4 shadow-inner"
                style={{ backgroundColor: token.colorBgLayout }}
            >
                <div className="mb-3 text-sm font-semibold text-gray-500">
                    {messages('track.metadataExternal')}
                </div>
                <Table
                    columns={columns}
                    dataSource={dspDataList}
                    pagination={false}
                    rowKey="key"
                    size="small"
                    bordered={false}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 py-4">
            <TracksTable
                sticky
                headerTitle={
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                }
                dataSource={tracksData?.items}
                loading={isFetching}
                pagination={{
                    current: tracksData?.metadata?.page,
                    pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                }}
                dataFilter={dataFilter}
                options={false}
                expandable={{
                    expandedRowRender,
                    rowExpandable,
                    columnWidth: 30,
                }}
                className="[&_.ant-pro-table-list-toolbar-container]:!px-0"
            />

            <AppPagination
                className="rounded-b-lg"
                style={{ background: token.colorBgContainer }}
                align="end"
                current={tracksData?.metadata?.page}
                pageSize={dataFilter.pageSize}
                total={tracksData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN && (
                <AcrCloudScanModal />
            )}

            {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_HISTORY && (
                <AcrCloudScanHistoryModal />
            )}

            {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT && (
                <AcrCloudScanResultModal />
            )}
        </div>
    );
}
