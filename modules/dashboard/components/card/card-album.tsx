import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate, getIntlCodeByReleaseStatus } from '@/helpers/common';
import { useRouter } from '@/i18n/routing';
import { ReleasesData } from '@/modules/releases/types';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useTranslations } from 'next-intl';

type Props = CardProps & {
    album: ReleasesData;
};

export default function CardRelease({ album, ...props }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const albumStatus = messages(getIntlCodeByReleaseStatus(album.status));

    return (
        <Card
            {...props}
            className="custom-card-body !bg-card-bg dark:!bg-card-bg-dark"
            cover={
                <div className="relative overflow-hidden">
                    <ImageFallback
                        onClick={() =>
                            router.push(
                                `${APP_ROUTES.RELEASES}/detail/${album.releaseId}/core-detail`
                            )
                        }
                        fallbackSrc={FALLBACK_IMAGE}
                        className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                        alt="example"
                        src={album.thumbnail}
                        width={300}
                        height={300}
                    />
                    <div className="absolute right-2 top-2 rounded-lg bg-black/80 p-1 px-2 text-xs font-medium text-white">
                        <span> {albumStatus} </span>
                    </div>
                </div>
            }
        >
            <Meta
                title={
                    <CustomTooltip title={album.title}>
                        <span className="cursor-pointer text-sm">
                            {' '}
                            {album.title}
                        </span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col font-medium">
                        <p> {album.artist} </p>

                        <p className="flex justify-between">
                            <span>
                                {formattedDate(
                                    album.releaseDate,
                                    DATE_FORMAT.DATE_ONLY
                                )}
                            </span>
                            <span>
                                {`${album.trackCount} ${messages('common.track')}`}
                            </span>
                        </p>
                    </div>
                }
            />
        </Card>
    );
}
