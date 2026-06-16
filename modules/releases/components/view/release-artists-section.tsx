import { ReleasesData } from '@/modules/releases/types';
import { Avatar, Card, Col, Empty, Row, Typography, theme } from 'antd';
import { useTranslations } from 'next-intl';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { ArtistProfileData } from '@/modules/artist/types';

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseArtistsSection({ releaseData }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const releaseArtists = releaseData?.releaseArtists || [];

    return (
        <Card
            title={
                <span className="text-base font-semibold">
                    {messages('release.overview.releaseArtists')}
                </span>
            }
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            styles={{
                body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' },
            }}
        >
            {releaseArtists.length === 0 ? (
                <div
                    className="flex justify-center items-center py-8 rounded-lg border border-dashed"
                    style={{
                        borderColor: token.colorBorder,
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {releaseArtists.map((item) => {
                        const artist = item?.artist;
                        if (!artist) return null;
                        return (
                            <Col span={24} key={item.id}>
                                <div
                                    className="flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md"
                                    style={{
                                        backgroundColor: token.colorBgContainer,
                                        borderColor: token.colorBorderSecondary,
                                    }}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar
                                            size={48}
                                            src={artist.picture ?? ''}
                                            style={{ backgroundColor: token.colorPrimary }}
                                        >
                                            {artist.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <div className="min-w-0">
                                            <Typography.Text strong className="block truncate text-[14px]">
                                                {artist.name}
                                            </Typography.Text>
                                            <Typography.Text type="secondary" className="block truncate text-[12px]">
                                                {artist.genre?.name || artist.country?.name || '-'}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                                        {artist.artistProfiles && artist.artistProfiles.length > 0 ? (
                                            artist.artistProfiles.map((profile: ArtistProfileData) => (
                                                <CustomTooltip key={profile.id} title={profile.dsp?.name}>
                                                    <Avatar
                                                        size={28}
                                                        src={profile.dsp?.picture ?? ''}
                                                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                                                        onClick={(e) => {
                                                            e?.stopPropagation();
                                                            if (profile.url) {
                                                                 window.open(profile.url, '_blank', 'noopener');
                                                            }
                                                        }}
                                                    >
                                                        {profile.dsp?.name?.[0]}
                                                    </Avatar>
                                                </CustomTooltip>
                                            ))
                                        ) : (
                                            <Typography.Text type="secondary" className="text-[12px] italic">
                                                -
                                            </Typography.Text>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Card>
    );
}
