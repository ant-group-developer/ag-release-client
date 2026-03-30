'use client';
import { PAGE_SIZE } from '@/constants/page-size';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetListTracksWithPolicies } from '@/modules/tracks/hooks/use-get-list-tracks-with-policies';
import { TrackDataFilter } from '@/modules/tracks/types';
import { ConfigProvider, theme } from 'antd';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);
    const headerHeight = useElementHeightById('release-header');

    const { dataFilter, onChangePage } = useFilter<TrackDataFilter>({
        releaseId: formValues?.id as string,
        fieldOrder: 'order',
        pageSize: 30,
    });

    const { tracksData, isFetching } = useGetListTracksWithPolicies(dataFilter);

    const { token } = theme.useToken();
    // const { isDark } = useThemeMode();
    const customTheme = {
        token: {
            colorTextDisabled: token?.colorText,
        },
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div className="w-full space-y-4 pb-10">
                <ReleaseSchedulingForm />

                <ReleaseSchedulingTable
                    sticky={{ offsetHeader: headerHeight }}
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: tracksData.metadata.page,
                        total: tracksData.metadata.totalItems,
                    }}
                    className="rounded-lg"
                />
                {/* <AppPagination
                    className="!mt-0 rounded-b-[8px] bg-white"
                    align="end"
                    current={tracksData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={tracksData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                /> */}
            </div>
        </ConfigProvider>
    );
}
