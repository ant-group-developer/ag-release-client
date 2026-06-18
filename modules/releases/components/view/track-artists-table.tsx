import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { ArtistProfileData } from '@/modules/artist/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TrackContributorData } from '@/modules/track-contributor/types';
import { Avatar, Space, Table } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { OVERVIEW_FALLBACK_VALUE } from './overview-constants';
import OverviewText from './overview-text';

interface TrackArtistsTableProps {
    trackArtists?: TrackArtistData[];
    trackContributors?: TrackContributorData[];
}

export default function TrackArtistsTable({
    trackArtists,
    trackContributors,
}: TrackArtistsTableProps) {
    const messages = useTranslations();

    const artistsList = useMemo(() => {
        return [
            ...(trackArtists?.map((ta) => {
                return {
                    id: ta.id,
                    name: ta.artist?.name,
                    picture: ta.artist?.picture,
                    role: messages('common.mainArtist') || 'Main artist',
                    profiles: ta.artist?.artistProfiles || [],
                };
            }) || []),
            ...(trackContributors?.map((tc) => {
                return {
                    id: tc.id,
                    name: tc.artist?.name,
                    picture: tc.artist?.picture,
                    role: tc.artistRole?.name || 'Contributor',
                    profiles: tc.artist?.artistProfiles || [],
                };
            }) || []),
        ];
    }, [trackArtists, trackContributors, messages]);

    const artistColumns = useMemo(() => {
        return [
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
                        <span>{row.name || OVERVIEW_FALLBACK_VALUE}</span>
                    </Space>
                ),
            },
            {
                title: messages('common.role'),
                dataIndex: 'role',
                key: 'role',
                render: (text: string) => <OverviewText value={text} />,
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
    }, [messages]);

    return (
        <Table
            bordered={true}
            dataSource={artistsList}
            pagination={false}
            rowKey="id"
            size="small"
            columns={artistColumns}
        />
    );
}
