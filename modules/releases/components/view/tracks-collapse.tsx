import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { Link } from '@/i18n/routing';
import { ArtistProfileData } from '@/modules/artist/types';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import InfoRow from '@/modules/releases/components/view/info-row';
import OverviewText from '@/modules/releases/components/view/overview-text';
import TrackCoverArt from '@/modules/tracks/components/table/trackCoverArt';
import { TRACK_TABS } from '@/modules/tracks/enums';
import { getTrackDetailRoute } from '@/modules/tracks/helpers/link';
import { TrackData } from '@/modules/tracks/types';
import { Avatar, Col, Collapse, Row, Space, Table, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
    OVERVIEW_COLUMN_GUTTER,
    OVERVIEW_FALLBACK_VALUE,
} from './overview-constants';

function normalizeMetadataKey(value?: string | null) {
    return value?.trim().toLowerCase();
}

function getDspByMetadataKey(key: string, dspData: any[]) {
    const normalizedKey = normalizeMetadataKey(key);

    return dspData.find((item) =>
        [item.code, item.codeCi, item.name].some(
            (value) => normalizeMetadataKey(value) === normalizedKey
        )
    );
}

type Props = {
    tracks: TrackData[];
};

export default function TracksCollapse({ tracks }: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const activeKeys = tracks.map((item) => item.id);
    const { dspData } = useGetListDsp({ pageSize: 1000 });
    const dspItems = useMemo(() => dspData?.items ?? [], [dspData?.items]);

    const collapseItems = tracks.map((record, index) => {
        const spotifyMeta = record.metadataExternal?.spotify;

        const artistsList = [
            ...(record.trackArtists?.map((ta) => {
                return {
                    id: ta.id,
                    name: ta.artist?.name,
                    picture: ta.artist?.picture,
                    role: messages('common.mainArtist') || 'Main artist',
                    profiles: ta.artist?.artistProfiles || [],
                };
            }) || []),
            ...(record.trackContributors?.map((tc) => {
                return {
                    id: tc.id,
                    name: tc.artist?.name,
                    picture: tc.artist?.picture,
                    role: tc.artistRole?.name || 'Contributor',
                    profiles: tc.artist?.artistProfiles || [],
                };
            }) || []),
        ];

        const artistColumns = [
            {
                title: messages('common.name'),
                key: 'name',
                render: (_: any, row: any) => (
                    <Space align="center">
                        <Avatar
                            size={24}
                            src={row.picture ?? ''}
                            className="flex-shrink-0"
                        >
                            {row.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <span className="font-semibold">
                            {row.name || OVERVIEW_FALLBACK_VALUE}
                        </span>
                    </Space>
                ),
            },
            {
                title: messages('common.role'),
                dataIndex: 'role',
                key: 'role',
                render: (text: string) => <OverviewText value={text} strong />,
            },
            {
                title: messages('artist.profiles'),
                key: 'profiles',
                render: (_: any, row: any) =>
                    row.profiles?.length ? (
                        <Space size={6} wrap>
                            {row.profiles.map((profile: ArtistProfileData) => (
                                <CustomTooltip
                                    key={profile.id}
                                    title={profile.dsp?.name}
                                >
                                    <Avatar
                                        size={28}
                                        src={profile.dsp?.picture ?? ''}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            if (profile.url) {
                                                window.open(
                                                    profile.url,
                                                    '_blank',
                                                    'noopener'
                                                );
                                            }
                                        }}
                                    >
                                        {profile.dsp?.name?.[0]}
                                    </Avatar>
                                </CustomTooltip>
                            ))}
                        </Space>
                    ) : (
                        <OverviewText value={OVERVIEW_FALLBACK_VALUE} />
                    ),
            },
        ];

        return {
            key: record.id,
            label: (
                <div className="flex items-center gap-4 py-2">
                    <span className="w-6 text-center font-medium">
                        {index + 1}
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
                            {record.sampleLength || '-'}
                        </span>
                    </div>
                </div>
            ),
            children: (
                <div className="flex flex-col gap-4 p-4">
                    {record.metadataExternal &&
                    Object.entries(record.metadataExternal).length > 0 ? (
                        <div className="flex flex-col gap-4 pb-4">
                            {Object.entries(record.metadataExternal)
                                .filter(([, metadata]) => !!metadata)
                                .map(([key, metadata]: [string, any]) => {
                                    const dsp = getDspByMetadataKey(
                                        key,
                                        dspItems
                                    );
                                    const name = key;

                                    return (
                                        <Row
                                            key={key}
                                            gutter={OVERVIEW_COLUMN_GUTTER}
                                            align="middle"
                                            className="rounded-lg bg-zinc-100"
                                        >
                                            <Col xs={24} lg={4}>
                                                <Space align="center">
                                                    <Avatar
                                                        size={24}
                                                        shape="square"
                                                        src={dsp?.picture}
                                                        className="flex-shrink-0 rounded"
                                                    >
                                                        {name[0]?.toUpperCase()}
                                                    </Avatar>
                                                    <span className="font-semibold">
                                                        {name}
                                                    </span>
                                                </Space>
                                            </Col>

                                            <Col xs={24} lg={8}>
                                                <InfoRow
                                                    label={
                                                        messages('track.id') ||
                                                        'Track ID'
                                                    }
                                                    value={
                                                        <OverviewText
                                                            value={
                                                                metadata.trackId ||
                                                                metadata.albumId
                                                            }
                                                            strong
                                                        />
                                                    }
                                                    copyText={
                                                        metadata.trackId ||
                                                        metadata.albumId
                                                    }
                                                />
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <InfoRow
                                                    label={messages(
                                                        'track.trackUrl'
                                                    )}
                                                    value={
                                                        metadata.trackUrl ||
                                                        metadata.albumUrl ? (
                                                            <a
                                                                href={
                                                                    metadata.trackUrl ||
                                                                    metadata.albumUrl
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[14px] font-normal !text-purple-600 hover:!text-purple-800 hover:underline"
                                                            >
                                                                {metadata.trackUrl ||
                                                                    metadata.albumUrl}
                                                            </a>
                                                        ) : (
                                                            <OverviewText
                                                                value={
                                                                    metadata.trackUrl ||
                                                                    metadata.albumUrl
                                                                }
                                                            />
                                                        )
                                                    }
                                                    copyText={
                                                        metadata.trackUrl ||
                                                        metadata.albumUrl
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    );
                                })}
                        </div>
                    ) : null}

                    <Table
                        dataSource={artistsList}
                        pagination={false}
                        rowKey="id"
                        size="small"
                        columns={artistColumns}
                    />
                </div>
            ),
            style: {
                backgroundColor: token.colorBgContainer,
                marginBottom: 16,
                borderRadius: 8,
                overflow: 'hidden',
                border: 'none',
            },
        };
    });

    if (!tracks || tracks.length === 0) {
        return (
            <div
                className="flex items-center justify-center rounded-lg py-10"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <span className="text-gray-500">No tracks found</span>
            </div>
        );
    }

    return (
        <Collapse
            defaultActiveKey={activeKeys}
            items={collapseItems}
            bordered={false}
            className="bg-transparent [&_.ant-collapse-item_.ant-collapse-content]:!border-none [&_.ant-collapse-item_.ant-collapse-header]:!items-center"
            expandIconPosition="end"
        />
    );
}
