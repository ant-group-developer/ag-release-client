import { ReleasesData } from '@/modules/releases/types';
import { UserOutlined } from '@ant-design/icons';
import { Image, theme } from 'antd';
import ReleaseStatusTag from '../../tag/release-status-tag';
import ReleaseInfoView from './release-info-view';

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseViewHeader({ releaseData }: Props) {
    const { token } = theme.useToken();

    if (!releaseData) return null;

    const coverArtUrl = releaseData.coverArtThumbnails?.original || releaseData.coverArtThumbnails?.['160x160'];

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                paddingBottom: '24px',
            }}
        >
            <div
                className="flex items-center justify-between overflow-hidden transition-all duration-300"
                style={{
                    maxHeight: 100,
                    opacity: 1,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 8,
                    paddingBottom: 24,
                }}
            >
                <ReleaseStatusTag
                    style={{
                        padding: '2px 16px',
                    }}
                    status={releaseData.status}
                />
            </div>

            <div className="flex justify-between gap-4">
                <div className="flex w-3/4 items-start gap-4">
                    <div style={{ flexShrink: 0 }}>
                        {coverArtUrl ? (
                            <Image
                                width={112}
                                height={112}
                                src={coverArtUrl}
                                alt={releaseData.title}
                                style={{ borderRadius: '8px', objectFit: 'cover' }}
                                fallback="/placeholder.png"
                            />
                        ) : (
                            <div
                                style={{
                                    width: 112,
                                    height: 112,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid #d9d9d9',
                                }}
                            >
                                <UserOutlined style={{ fontSize: '32px', color: '#bfbfbf' }} />
                            </div>
                        )}
                    </div>

                    {/* release info */}
                    <ReleaseInfoView releaseData={releaseData} />
                </div>
            </div>
        </div>
    );
}
