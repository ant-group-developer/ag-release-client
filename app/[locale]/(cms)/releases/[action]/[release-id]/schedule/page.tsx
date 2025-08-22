'use client';
import { SCREEN, THEME } from '@/enums/common';
import { useThemeStore } from '@/hooks/use-theme-store';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetListTracksWithPolicies } from '@/modules/tracks/hooks/use-get-list-tracks-with-policies';
import { ConfigProvider } from 'antd';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { tracksData, isFetching } = useGetListTracksWithPolicies({
        releaseId: formValues.id,
    });

    const { theme: currentTheme } = useThemeStore();
    const customTheme = {
        token: {
            colorBgContainerDisabled:
                currentTheme == THEME.LIGHT ? '#fff' : '#2a2a2a',
        },
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div className="w-full space-y-4 py-4">
                <ReleaseSchedulingForm />

                <ReleaseSchedulingTable
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    scroll={{
                        x: SCREEN.XL,
                    }}
                />
            </div>
        </ConfigProvider>
    );
}
