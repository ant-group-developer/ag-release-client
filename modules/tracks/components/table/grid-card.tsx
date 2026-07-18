import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { TrackData } from '../../types';

import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
type Props = CardProps & {
    data: TrackData;
};

export default function GridCardTracks({ data, ...props }: Props) {
    const imgFileId =
        data?.release?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S300] ??
        data?.release?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];
    const [ref, entry] = useIntersectionObserver({
        root: null,
        rootMargin: '0px',
        threshold: 0,
    });
    const { linkReadFile } = useGetLinkReadFile(imgFileId as string, {
        enabled: !!entry?.isIntersecting,
    });
    return (
        <div ref={ref}>
            <Card
                {...props}
                className="custom-card-body !bg-card-bg"
                cover={
                    <div className="relative overflow-hidden">
                        <ImageFallback
                            className="cursor-pointer overflow-hidden object-cover duration-300 hover:scale-110"
                            alt="example"
                            src={linkReadFile}
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
                                {data.title}
                            </span>
                        </CustomTooltip>
                    }
                    description={
                        <div className="flex justify-between font-medium">
                            {/* <span> {data.artists[0].name} </span> */}

                            <p className="flex justify-between">
                                <span>
                                    {/* {formattedDate(
                                        data.releaseDate,
                                        DATE_FORMAT.DATE_ONLY
                                    )} */}
                                </span>
                            </p>
                        </div>
                    }
                />
            </Card>
        </div>
    );
}
