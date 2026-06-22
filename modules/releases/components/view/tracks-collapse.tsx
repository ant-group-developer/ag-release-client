import { convertSecondsToTime, getIndex } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import TrackCoverArt from '@/modules/tracks/components/table/trackCoverArt';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { getTrackDetailRoute } from '@/modules/tracks/helpers/link';
import { TrackData } from '@/modules/tracks/types';
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Empty, Spin, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import TrackArtistsTable from './track-artists-table';
import TrackMetadataExternal, {
    getDspByMetadataKey,
} from './track-metadata-external';

const GRID_COLUMNS = {
    STT: 'col-span-1',
    THUMBNAIL: 'col-span-1',
    TITLE: 'col-span-3',
    ARTIST: 'col-span-2',
    ISRC: 'col-span-2',
    DURATION: 'col-span-1',
    EXTERNAL: 'col-span-1',
} as const;

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
                <div className="grid w-full grid-cols-12 items-center gap-4 py-1">
                    <span
                        className={`${GRID_COLUMNS.STT} text-center text-gray-400`}
                    >
                        {getIndex(pageSize, page, index)}
                    </span>
                    <div
                        className={`${GRID_COLUMNS.THUMBNAIL} flex items-center`}
                    >
                        <TrackCoverArt
                            trackData={record}
                            width={48}
                            height={48}
                        />
                    </div>
                    <div
                        className={`${GRID_COLUMNS.TITLE} flex min-w-0 flex-col pr-4`}
                    >
                        <Link
                            href={getTrackDetailRoute(
                                record.id,
                                TRACK_TABS.METADATA
                            )}
                            className="w-fit max-w-full truncate text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {record.title}
                        </Link>
                        {record.version && (
                            <span
                                className="truncate text-xs text-gray-500"
                                title={record.version}
                            >
                                {record.version}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${GRID_COLUMNS.ARTIST} truncate text-gray-600 pr-4`}
                        title={
                            record.trackArtists
                                ?.map((ta) => ta.artist?.name)
                                ?.filter(Boolean)
                                ?.join(', ') || ''
                        }
                    >
                        {record.trackArtists
                            ?.map((ta) => ta.artist?.name)
                            ?.filter(Boolean)
                            ?.join(', ') || '-'}
                    </div>
                    <div
                        className={`${GRID_COLUMNS.ISRC} truncate text-gray-600`}
                        title={record.isrc || ''}
                    >
                        {record.isrc || '-'}
                    </div>
                    <div className={`${GRID_COLUMNS.DURATION} text-gray-600`}>
                        {record.audioFile?.duration
                            ? convertSecondsToTime(record.audioFile.duration)
                            : '-'}
                    </div>
                    <div
                        className={`${GRID_COLUMNS.EXTERNAL} flex flex-wrap items-center gap-2`}
                    >
                        {(
                            Object.entries(record?.metadataExternal || {}) as [
                                string,
                                any,
                            ][]
                        )
                            .filter(
                                ([, metadata]) =>
                                    !!metadata &&
                                    (metadata.trackUrl || metadata.albumUrl)
                            )
                            .map(([key, metadata]) => {
                                const dsp = getDspByMetadataKey(key, dspItems);
                                const url =
                                    metadata.trackUrl || metadata.albumUrl;
                                return (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center transition-opacity hover:opacity-80"
                                        title={`${key}: ${url}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Avatar
                                            size={24}
                                            shape="square"
                                            src={dsp?.picture}
                                            className="rounded border border-gray-200"
                                        >
                                            {key[0]?.toUpperCase()}
                                        </Avatar>
                                    </a>
                                );
                            })}
                    </div>
                </div>
            ),
            children: (
                <div className="flex flex-col gap-4 px-4">
                    <TrackMetadataExternal
                        metadataExternal={record?.metadataExternal}
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
            <div
                className="overflow-hidden"
                style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 8,
                }}
            >
                <div
                    className="grid grid-cols-12 gap-4 border-b px-4 py-3 pr-12 text-sm font-semibold"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderColor: token.colorBorderSecondary,
                        color: token.colorTextHeading,
                    }}
                >
                    <div className={`${GRID_COLUMNS.STT} relative text-center`}>
                        {messages('common.iNo')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={`${GRID_COLUMNS.THUMBNAIL} relative`}>
                        {messages('common.thumbnail')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={`${GRID_COLUMNS.TITLE} relative`}>
                        {messages('common.title')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={`${GRID_COLUMNS.ARTIST} relative`}>
                        {messages('common.artist')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={`${GRID_COLUMNS.ISRC} relative`}>
                        {messages('common.isrc')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={`${GRID_COLUMNS.DURATION} relative`}>
                        {messages('common.duration')}
                        <span
                            className="absolute right-[-8px] top-1/2 w-[1px] -translate-y-1/2"
                            style={{
                                backgroundColor: token.colorSplit,
                                height: '1.6em',
                            }}
                        />
                    </div>
                    <div className={GRID_COLUMNS.EXTERNAL}>
                        {messages('common.link')}
                    </div>
                </div>
                <Collapse
                    items={collapseItems}
                    bordered={false}
                    className="cursor-pointer overflow-hidden !bg-transparent [&_.ant-collapse-item_.ant-collapse-content]:!border-none [&_.ant-collapse-item_.ant-collapse-header]:!items-center"
                    style={{
                        borderRadius: 0,
                    }}
                    expandIconPosition="end"
                    expandIcon={({ isActive }) => (
                        <DownOutlined
                            rotate={isActive ? 180 : 0}
                            className="text-gray-500"
                        />
                    )}
                    activeKey={activeKey}
                    onChange={onChange}
                />
            </div>
        </Spin>
    );
}
