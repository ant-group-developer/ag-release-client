'use client';
import { SCREEN, THEME } from '@/enums/common';
import { useThemeStore } from '@/hooks/use-theme-store';
import ReleaseSchedulingForm from '@/modules/releases/components/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/releases/components/release-detail/release-scheduling/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider } from 'antd';

export default function Schedule() {
    const formValues = useReleaseFormStore((state) => state.formValues);

    const { tracksData } = useGetListTracks({ releaseId: formValues.id });

    const trackData = tracksData.items.map((track: TrackData) => {
        return {
            key: track.id,
            track: track.title,
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        };
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
            <ReleaseSchedulingForm />
            <ReleaseSchedulingTable
                dataSource={trackData}
                scroll={{
                    x: SCREEN.MD,
                }}
            />
        </ConfigProvider>
    );
}
