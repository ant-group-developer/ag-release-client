import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = CardProps & {
    album: ReleasesData;
};

export default function CardAlbum({ album, ...props }: Props) {
    const messages = useTranslations();

    const albumStatus =
        album.status === RELEASES_STATUS.PUBLISHED
            ? 'Đã sản xuất'
            : 'Đang xử lý';

    return (
        <Card
            {...props}
            className="custom-card-body !border-gray-200"
            cover={
                <div className="relative overflow-hidden">
                    <Image
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
                        <span className="cursor-pointer"> {album.title}</span>
                    </CustomTooltip>
                }
                description={
                    <div className="flex flex-col">
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
