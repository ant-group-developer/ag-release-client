import ImageListUpload from '@/components/ui/input/image-list-upload';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { ExternalMetadata, ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import ReleaseStatusTag from '../../tag/release-status-tag';
import ReleaseInfoView from './release-info-view';

type Props = {
    releaseData: ReleasesData;
};

function getFirstExternalCoverUrl(
    metadataExternal?: Partial<Record<string, ExternalMetadata | undefined>>
) {
    return Object.values(metadataExternal ?? {})
        .flatMap(
            (metadata) =>
                metadata?.coverImages?.map((coverImage) => coverImage.url) ?? []
        )
        .find(Boolean);
}

export default function ReleaseViewHeader({ releaseData }: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const imgFileId =
        releaseData?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S300] ??
        releaseData?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];

    const {
        linkReadFile,
        isPending: isCoverArtLoading,
        isFetching: isCoverArtFetching,
    } = useGetLinkReadFile(imgFileId as string, {
        enabled: !!imgFileId,
    });

    if (!releaseData) return null;

    const externalCoverUrl = getFirstExternalCoverUrl(
        releaseData.metadataExternal
    );

    const coverArtUrl = linkReadFile || externalCoverUrl;

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
                        <ImageListUpload
                            disabled
                            loading={isCoverArtFetching}
                            value={
                                coverArtUrl
                                    ? {
                                          fileList: [
                                              {
                                                  uid: '-1',
                                                  url: coverArtUrl,
                                                  name: releaseData.title,
                                              },
                                          ],
                                      }
                                    : undefined
                            }
                            className="release-detail-header-upload !aspect-square !size-28 !rounded-lg !p-0 transition-all duration-300"
                            placeholder={messages('common.uploadImage')}
                            maxCount={1}
                        />
                    </div>

                    {/* release info */}
                    <ReleaseInfoView releaseData={releaseData} />
                </div>
            </div>
        </div>
    );
}
