'use client';
import { SCREEN } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetListTracksWithPolicies } from '@/modules/tracks/hooks/use-get-list-tracks-with-policies';
import { ConfigProvider, theme } from 'antd';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { tracksData, isFetching } = useGetListTracksWithPolicies({
        releaseId: formValues.id,
    });

    const { token } = theme.useToken();
    const { isDark } = useThemeMode();
    const customTheme = {
        token: {
            colorBgContainerDisabled: isDark ? '#2a2a2a' : '#fff',
            colorTextDisabled: token?.colorText,
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
