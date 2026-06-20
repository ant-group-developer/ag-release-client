'use client';

import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { ReleasesData } from '@/modules/releases/types';
import { TRACK_SORT_FIELD } from '@/modules/tracks/enums';
import { useGetListTracksWithPolicies } from '@/modules/tracks/hooks/use-get-list-tracks-with-policies';
import { TrackDataFilter } from '@/modules/tracks/types';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

type Props = {
    releaseData: ReleasesData;
};

export default function ScheduleTab({ releaseData }: Props) {
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);
    const headerHeight = useElementHeightById('release-header');

    // Thiết lập hành động là READ để các form và table rơi vào chế độ chỉ đọc
    useEffect(() => {
        setReleaseAction(RELEASE_DETAIL_ACTION.READ);
    }, [setReleaseAction]);

    // Đồng bộ dữ liệu phát hành vào store formValues
    useEffect(() => {
        if (releaseData?.id) {
            setFormValues(releaseData);
        }
    }, [releaseData, setFormValues]);

    const { dataFilter } = useFilter<TrackDataFilter>({
        releaseId: releaseData?.id,
        fieldOrder: TRACK_SORT_FIELD.ORDER,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const { tracksData, isFetching } = useGetListTracksWithPolicies(dataFilter);

    const { token } = theme.useToken();
    const customTheme = {
        token: {
            colorTextDisabled: token?.colorText,
        },
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div className="w-full space-y-4 pb-10 pt-4">
                <ReleaseSchedulingForm />

                <ReleaseSchedulingTable
                    sticky
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE_EXTRA_LARGE,
                        current: tracksData?.metadata?.page,
                    }}
                    className="rounded-lg"
                />
            </div>
        </ConfigProvider>
    );
}
