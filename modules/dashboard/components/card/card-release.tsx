import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import { Link, useRouter } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Card, CardProps, Skeleton } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useTranslations } from 'next-intl';

type Props = CardProps & {
    data: ReleasesData;
};

export default function CardRelease({ data, ...props }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    // const albumStatus = messages(getIntlCodeByReleaseStatus(data.status));
    const imageFileId =
        data?.coverArtThumbnails?.['300x300'] ??
        data?.coverArtThumbnails?.original;

    const { linkReadFile, isFetching } = useGetLinkReadFile(
        imageFileId as string
    );

    const showSkeleton = isFetching;

    return (
        <Card
            {...props}
            hoverable
            // className="custom-card-body !bg-card-bg dark:!bg-card-bg-dark"
            cover={
                <div className="relative aspect-square overflow-hidden">
                    <Link
                        href={getReleaseDetailTabRoute(
                            data.id,
                            RELEASES_TABS.CORE_DETAIL,
                            RELEASE_DETAIL_ACTION.READ
                        )}
                    >
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
                                width={300}
                                height={300}
                            />
                        )}
                    </Link>
                    <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                        <span>
                            {' '}
                            {messages(
                                getIntlCodeByReleaseStatus(data?.status)
                            )}{' '}
                        </span>
                    </div>
                </div>
            }
        >
            <Meta
                title={
                    <CustomTooltip title={data.title}>
                        <span className="cursor-pointer text-sm">
                            {' '}
                            {data.title}
                        </span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col font-medium">
                        <p className="flex justify-between">
                            <p> {data?.albumFormat.name} </p>
                            <span>
                                {formattedDate(
                                    data.releaseDate,
                                    DATE_FORMAT.DATE_ONLY
                                )}{' '}
                            </span>
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
