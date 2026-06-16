import { ReleasesData } from '@/modules/releases/types';
import { UserOutlined, CopyOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Space, Tag, Tooltip, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const { Text, Title, Link } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function OverviewTab({ releaseData }: Props) {
    const messages = useTranslations();

    if (!releaseData) return null;

    // Lấy thông tin nghệ sĩ chính
    const mainReleaseArtist = releaseData.releaseArtists?.[0]?.artist;
    const spotifyProfile = mainReleaseArtist?.artistProfiles?.find(
        (p) => p.dsp?.code?.toLowerCase() === 'spotify' || p.dsp?.name?.toLowerCase() === 'spotify'
    );
    
    // Tạo link spotify giả lập/thực tế cho Artist
    const artistSpotifyUrl = spotifyProfile?.url || `https://open.spotify.com/artist/3j8qdr4pnScV4x46pqMVuj`;
    const artistSpotifyUri = spotifyProfile?.url?.includes('spotify.com/artist/')
        ? `spotify:artist:${spotifyProfile.url.split('spotify.com/artist/')[1]?.split('?')[0]}`
        : `spotify:artist:3j8qdr4pnScV4x46pqMVuj`;

    // Tạo link spotify giả lập cho Album/Release
    const releaseSpotifyUrl = `https://open.spotify.com/album/6CxhDdAkoYXaA8f6pt1gon`;
    const releaseSpotifyUri = `spotify:album:6CxhDdAkoYXaA8f6pt1gon`;

    const feedName = releaseData.tenant?.name
        ? releaseData.tenant.name.toLowerCase().replace(/\s+/g, '')
        : 'antmusic';

    const pLine = releaseData.pLineYear && releaseData.pLineOwner
        ? `${releaseData.pLineYear} ${releaseData.pLineOwner}`
        : '';

    const cLine = releaseData.cLineYear && releaseData.cLineOwner
        ? `${releaseData.cLineYear} ${releaseData.cLineOwner}`
        : '';

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied!`);
    };

    const renderInfoRow = (label: string, value: React.ReactNode, copyText?: string, copyLabel?: string, tag?: string) => {
        return (
            <div 
                className="flex items-center justify-between py-3" 
                style={{ borderBottom: '1px solid #f0f0f0' }}
            >
                <div style={{ flex: '0 0 200px', paddingRight: '16px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{label}</Text>
                </div>
                <div className="flex flex-1 items-center justify-between min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="truncate">{value}</div>
                        {tag && (
                            <Tag 
                                bordered={false}
                                style={{ 
                                    fontSize: '10px', 
                                    fontWeight: 'bold', 
                                    backgroundColor: '#f5f5f5', 
                                    color: '#595959',
                                    borderRadius: '4px',
                                    padding: '0 4px',
                                    lineHeight: '16px'
                                }}
                            >
                                {tag}
                            </Tag>
                        )}
                    </div>
                    {copyText && (
                        <Tooltip title={messages('common.copy') || 'Copy'}>
                            <CopyOutlined 
                                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors ml-4" 
                                onClick={() => handleCopy(copyText, copyLabel || label)}
                                style={{ fontSize: '14px' }}
                            />
                        </Tooltip>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '8px 0' }}>
            <Row gutter={[48, 32]}>
                {/* Cột trái - Primary information & Release identifiers */}
                <Col xs={24} lg={12}>
                    <div className="mb-8">
                        <Title level={5} className="!mb-4 font-bold" style={{ fontSize: '16px' }}>
                            Primary information
                        </Title>
                        <div className="flex flex-col">
                            {renderInfoRow(
                                'Primary release ID',
                                <Text strong style={{ fontSize: '14px' }}>{releaseData.upc || '-'}</Text>,
                                releaseData.upc,
                                'Primary release ID',
                                'UPC'
                            )}
                            {renderInfoRow(
                                'URI',
                                <Link 
                                    href={releaseSpotifyUrl} 
                                    target="_blank" 
                                    style={{ color: '#722ed1', fontSize: '14px' }}
                                >
                                    {releaseSpotifyUri}
                                </Link>,
                                releaseSpotifyUri,
                                'URI'
                            )}
                            {renderInfoRow(
                                'Original release date',
                                <Text style={{ fontSize: '14px' }}>
                                    {releaseData.releaseOriginalDate 
                                        ? dayjs(releaseData.releaseOriginalDate).format('YYYY-MM-DD') 
                                        : (releaseData.releaseDate ? dayjs(releaseData.releaseDate).format('YYYY-MM-DD') : '-')}
                                </Text>
                            )}
                            {renderInfoRow(
                                'Included media',
                                <Text style={{ fontSize: '14px' }}>Audio</Text>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <Title level={5} className="!mb-4 font-bold" style={{ fontSize: '16px' }}>
                            Release identifiers
                        </Title>
                        <div className="flex flex-col">
                            {renderInfoRow(
                                'UPC',
                                <Text strong style={{ fontSize: '14px' }}>{releaseData.upc || '-'}</Text>,
                                releaseData.upc,
                                'UPC',
                                'Primary release ID'
                            )}
                        </div>
                    </div>
                </Col>

                {/* Cột phải - Main artist & URL */}
                <Col xs={24} lg={12}>
                    <div className="mb-8">
                        <div style={{ height: '28px' }} className="hidden lg:block"></div> {/* align spacing */}
                        <div className="flex flex-col">
                            {renderInfoRow(
                                'Main artist URI',
                                mainReleaseArtist ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar 
                                            size={32} 
                                            src={mainReleaseArtist.picture}
                                            icon={!mainReleaseArtist.picture && <UserOutlined />}
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <Link 
                                                href={artistSpotifyUrl} 
                                                target="_blank" 
                                                strong
                                                style={{ color: '#722ed1', fontSize: '14px', lineHeight: '1.4' }}
                                            >
                                                {mainReleaseArtist.name}
                                            </Link>
                                            <Text 
                                                type="secondary" 
                                                className="truncate"
                                                style={{ fontSize: '11px', color: '#722ed1', lineHeight: '1.2' }}
                                            >
                                                {artistSpotifyUri}
                                            </Text>
                                        </div>
                                    </div>
                                ) : (
                                    <Text type="secondary">-</Text>
                                ),
                                mainReleaseArtist ? artistSpotifyUri : undefined,
                                'Main artist URI'
                            )}
                            {renderInfoRow(
                                'URL',
                                <Link 
                                    href={releaseSpotifyUrl} 
                                    target="_blank" 
                                    style={{ color: '#722ed1', fontSize: '14px' }}
                                >
                                    {releaseSpotifyUrl}
                                </Link>,
                                releaseSpotifyUrl,
                                'URL'
                            )}
                            {renderInfoRow(
                                'Release type',
                                <Text style={{ fontSize: '14px' }}>
                                    {releaseData.albumFormat?.name || 'Single'}
                                </Text>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Section: Label information */}
            <div className="mt-4">
                <Title level={5} className="!mb-4 font-bold" style={{ fontSize: '16px' }}>
                    Label information
                </Title>
                <Row gutter={[48, 0]}>
                    <Col xs={24} lg={12}>
                        <div className="flex flex-col">
                            {renderInfoRow(
                                'Label',
                                <Text strong style={{ fontSize: '14px' }}>{releaseData.label?.name || '-'}</Text>
                            )}
                            {renderInfoRow(
                                'Feed name',
                                <Text style={{ fontSize: '14px' }}>{feedName}</Text>
                            )}
                            {renderInfoRow(
                                'P line',
                                <Text style={{ fontSize: '14px' }}>{pLine || '-'}</Text>
                            )}
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div className="flex flex-col">
                            {renderInfoRow(
                                'Licensor',
                                <Text style={{ fontSize: '14px' }}>{releaseData.pLineOwner || '-'}</Text>
                            )}
                            {renderInfoRow(
                                'C line',
                                <Text style={{ fontSize: '14px' }}>{cLine || '-'}</Text>
                            )}
                            {renderInfoRow(
                                'Courtesy line',
                                <Text style={{ fontSize: '14px' }}>-</Text>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
