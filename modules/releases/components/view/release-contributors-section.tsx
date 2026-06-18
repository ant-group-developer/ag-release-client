import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { ArtistProfileData } from '@/modules/artist/types';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import { ReleasesData } from '@/modules/releases/types';
import { Avatar, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { OVERVIEW_FALLBACK_VALUE } from './overview-constants';
import OverviewText from './overview-text';

const { Title } = Typography;
const CONTRIBUTOR_AVATAR_SIZE = 24;
const CONTRIBUTOR_PROFILE_AVATAR_SIZE = 28;
const CONTRIBUTOR_PROFILE_WINDOW_FEATURES = 'noopener';

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseContributorsSection({ releaseData }: Props) {
    const messages = useTranslations();
    const releaseContributors = releaseData?.releaseContributors || [];

    if (!releaseContributors.length) {
        return null;
    }

    const columns: ColumnsType<ReleaseContributor> = [
        {
            title: messages('common.name'),
            render: (_, item) => {
                const artist = item?.artist;

                return (
                    <Space align="center">
                        <Avatar
                            size={CONTRIBUTOR_AVATAR_SIZE}
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
            render: (_, item) => (
                <OverviewText value={item.artist?.country?.name} />
            ),
        },
        {
            title: messages('common.role'),
            render: (_, item) => <OverviewText value={item.artistRole?.name} />,
        },
        {
            title: messages('artist.profiles'),
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
                                        size={CONTRIBUTOR_PROFILE_AVATAR_SIZE}
                                        src={profile.dsp?.picture ?? ''}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            if (profile.url) {
                                                window.open(
                                                    profile.url,
                                                    '_blank',
                                                    CONTRIBUTOR_PROFILE_WINDOW_FEATURES
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
                {messages('release.overview.releaseContributors')}
            </Title>
            <Table
                columns={columns}
                dataSource={releaseContributors}
                pagination={false}
                rowKey="id"
                size="small"
            />
        </>
    );
}
