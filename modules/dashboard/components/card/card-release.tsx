import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { getReleaseDetailTabRoute } from '@/modules/releases/helpers/link';
import { ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Card, CardProps, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';

const { Meta } = Card;

type Props = CardProps & {
    data: ReleasesData;
};

export default function CardRelease({ data, ...props }: Props) {
    const messages = useTranslations();
    // const router = useRouter();

    const imageFileId =
        data?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S300] ??
        data?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];

    const { linkReadFile, isFetching } = useGetLinkReadFile(
        imageFileId as string
    );

    const showSkeleton = isFetching;

    return (
        <Card
            {...props}
            hoverable
            variant="outlined"
            // className="custom-card-body !bg-card-bg dark:!bg-card-bg-dark"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...props.style,
            }}
            styles={{
                body: {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
            cover={
                <Link
                    href={getReleaseDetailTabRoute(
                        data.id,
                        RELEASES_TABS.CORE_DETAIL
                    )}
                >
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        {showSkeleton ? (
                            <Skeleton.Node
                                active
                                className="!h-[300px] !w-[300px] !rounded-lg"
                            />
                        ) : (
                            <ImageFallback
                                fallbackSrc={FALLBACK_IMAGE}
                                className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                                alt="example"
                                src={linkReadFile || FALLBACK_IMAGE}
                                width={600}
                                height={600}
                            />
                        )}

                        <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                            <span>
                                {' '}
                                {messages(
                                    `release.statusV2.${data?.status}`
                                )}{' '}
                            </span>
                        </div>
                    </div>
                </Link>
            }
        >
            <Meta
                title={
                    <Link
                        href={getReleaseDetailTabRoute(
                            data.id,
                            RELEASES_TABS.CORE_DETAIL
                        )}
                    >
                        <CustomTooltip title={data.title}>
                            <span className="cursor-pointer text-sm">
                                {' '}
                                {data.title}
                            </span>
                        </CustomTooltip>
                    </Link>
                }
                description={
                    <div className="flex flex-col font-medium">
                        <div className="flex justify-between">
                            <span> {data?.albumFormat?.name || '\u00A0'} </span>
                            <span>
                                {formattedDate(
                                    data.releaseDate,
                                    DATE_FORMAT.DATE_ONLY
                                ) || '\u00A0'}{' '}
                            </span>
                        </div>
                    </div>
                }
            />
        </Card>
    );
}
