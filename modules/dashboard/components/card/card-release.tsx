import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import { useRouter } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useTranslations } from 'next-intl';

type Props = CardProps & {
    data: ReleasesData;
};

export default function CardRelease({ data, ...props }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    // const albumStatus = messages(getIntlCodeByReleaseStatus(data.status));

    return (
        <Card
            {...props}
            className="custom-card-body !bg-card-bg dark:!bg-card-bg-dark"
            cover={
                <div className="relative aspect-square overflow-hidden">
                    <ImageFallback
                        onClick={() =>
                            router.push(
                                getReleaseDetailTabRoute(
                                    data.id,
                                    RELEASES_TABS.CORE_DETAIL
                                )
                            )
                        }
                        fallbackSrc={FALLBACK_IMAGE}
                        className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={
                            data?.coverArtThumbnails?.original || FALLBACK_IMAGE
                        }
                        width={300}
                        height={300}
                    />
                    {/* <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                        <span> {albumStatus} </span>
                    </div> */}
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
                            <p> {'artist'} </p>
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
