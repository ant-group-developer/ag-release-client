import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { ArtistProfileData } from '@/modules/artist/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ReleasesData } from '@/modules/releases/types';
import { Avatar, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { OVERVIEW_FALLBACK_VALUE } from './overview-constants';
import OverviewText from './overview-text';

const { Title } = Typography;
const ARTIST_AVATAR_SIZE = 24;
const ARTIST_PROFILE_AVATAR_SIZE = 28;
const ARTIST_PROFILE_WINDOW_FEATURES = 'noopener';

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseArtistsSection({ releaseData }: Props) {
    const messages = useTranslations();
    const releaseArtists = releaseData?.releaseArtists || [];

    if (!releaseArtists.length) {
        return null;
    }

    const columns: ColumnsType<ReleaseArtist> = [
        {
            title: messages('common.name'),
            width: 600,
            render: (_, item) => {
                const artist = item?.artist;

                return (
                    <Space align="center">
                        <Avatar
                            size={ARTIST_AVATAR_SIZE}
                            src={artist?.picture ?? ''}
                            className="flex-shrink-0"
                        >
                            {artist?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <span>{artist?.name || OVERVIEW_FALLBACK_VALUE}</span>
                    </Space>
                );
            },
        },
        {
            title: messages('country.label'),
            width: 400,
            render: (_, item) => (
                <OverviewText value={item.artist?.country?.name} />
            ),
        },
        {
            title: messages('artist.profiles'),
            width: 400,
            render: (_, item) =>
                item.artist?.artistProfiles?.length ? (
                    <Space size={6} wrap>
                        {item.artist.artistProfiles.map(
                            (profile: ArtistProfileData) => (
                                <CustomTooltip
                                    key={profile.id}
                                    title={profile.dsp?.name}
                                >
                                    <Avatar
                                        size={ARTIST_PROFILE_AVATAR_SIZE}
                                        src={profile.dsp?.picture ?? ''}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            if (profile.url) {
                                                window.open(
                                                    profile.url,
                                                    '_blank',
                                                    ARTIST_PROFILE_WINDOW_FEATURES
                                                );
                                            }
                                        }}
                                    >
                                        {profile.dsp?.name?.[0]}
                                    </Avatar>
                                </CustomTooltip>
                            )
                        )}
                    </Space>
                ) : (
                    <OverviewText value={OVERVIEW_FALLBACK_VALUE} />
                ),
        },
    ];

    return (
        <>
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.overview.releaseArtists')}
            </Title>
            <Table
                columns={columns}
                dataSource={releaseArtists}
                pagination={false}
                rowKey="id"
                size="small"
            />
        </>
    );
}
