import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import AcrCloudScanHistoryModal from '@/modules/acr-cloud/components/modal/acr-scan-history-modal';
import AcrCloudScanModal from '@/modules/acr-cloud/components/modal/acr-scan-modal';
import AcrCloudScanResultModal from '@/modules/acr-cloud/components/modal/acr-scan-result-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackDataFilter } from '@/modules/tracks/types';
import { theme } from 'antd';
import TracksCollapse from './tracks-collapse';

type Props = {
    releaseId: string;
};

export default function TracksTab({ releaseId }: Props) {
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);

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

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between">
                <AppSearch
                    className="max-w-52"
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
                />
            </div>

            <TracksCollapse tracks={tracksData?.items || []} />

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
