import { convertSecondsToTime, getIndex } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import TrackCoverArt from '@/modules/tracks/components/table/trackCoverArt';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { getTrackDetailRoute } from '@/modules/tracks/helpers/link';
import { TrackData } from '@/modules/tracks/types';
import { Collapse, Empty, Spin, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import TrackArtistsTable from './track-artists-table';
import TrackMetadataExternal from './track-metadata-external';
import { DownOutlined } from '@ant-design/icons';

type Props = {
    tracks: TrackData[];
    page?: number;
    pageSize?: number;
    activeKey?: string[];
    onChange?: (key: string | string[]) => void;
    loading?: boolean;
};

export default function TracksCollapse({
    tracks,
    page,
    pageSize,
    activeKey,
    onChange,
    loading,
}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const { dspData } = useGetListDsp({ pageSize: 1000 });
    const dspItems = useMemo(() => dspData?.items ?? [], [dspData?.items]);

    const collapseItems = tracks.map((record, index) => {
        return {
            key: String(index),
            label: (
                <div className="flex items-center gap-4 py-2">
                    <span className="w-6 text-center font-medium">
                        {getIndex(pageSize, page, index)}
                    </span>
                    <TrackCoverArt trackData={record} />
                    <div className="flex flex-col">
                        <Link
                            href={getTrackDetailRoute(
                                record.id,
                                TRACK_TABS.METADATA
                            )}
                            className="font-semibold text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {record.title}
                        </Link>
                        <span className="text-sm text-gray-500">
                            {record.version ? `${record.version} • ` : ''}
                            {record.audioFile?.duration
                                ? convertSecondsToTime(
                                      record.audioFile.duration
                                  )
                                : '-'}
                            {record.isrc ? ` • ${record.isrc}` : ''}
                        </span>
                    </div>
                </div>
            ),
            children: (
                <div className="flex flex-col gap-4 px-4">
                    <TrackMetadataExternal
                        metadataExternal={record.metadataExternal}
                        dspItems={dspItems}
                    />

                    <TrackArtistsTable
                        trackArtists={record.trackArtists}
                        trackContributors={record.trackContributors}
                    />
                </div>
            ),
            style: {
                backgroundColor: token.colorBgContainer,
                borderBottom:
                    index === tracks.length - 1
                        ? 'none'
                        : `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 0,
            },
        };
    });

    if ((!tracks || tracks.length === 0) && loading) {
        return (
            <div
                className="flex items-center justify-center rounded-lg py-10"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <Spin />
            </div>
        );
    }

    if (!tracks || tracks.length === 0) {
        return (
            <div
                className="flex items-center justify-center rounded-lg py-10"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <Spin spinning={loading}>
            <Collapse
                items={collapseItems}
                bordered={false}
                className="overflow-hidden !bg-transparent [&_.ant-collapse-item_.ant-collapse-content]:!border-none [&_.ant-collapse-item_.ant-collapse-header]:!items-center"
                style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 8,
                }}
                expandIconPosition="start"
                expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} className="text-gray-500" />
                )}
                activeKey={activeKey}
                onChange={onChange}
            />
        </Spin>
    );
}
