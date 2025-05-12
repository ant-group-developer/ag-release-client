import { formattedDate } from '@/helpers/common';

import { Orientation } from '@/enums/common';
import { formatFileSize, formatTime } from '@/helpers/common';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { OrderProduct } from '../types';
import AttributeItem from './attribute-item';

type Props = { videoData: OrderProduct };

export default function ProductVideoAttribute({ videoData }: Props) {
    const messages = useTranslations();

    if (!videoData?.product) return <Empty />;

    return (
        <div className="grid grid-cols-5 gap-4">
            <AttributeItem
                label={messages('file.duration')}
                value={formatTime(Number(videoData.product?.duration ?? 0))}
            />
            <AttributeItem
                label={messages('file.resolution')}
                value={
                    videoData.product?.width && videoData.product?.height
                        ? `${videoData.product.width}x${videoData.product.height}`
                        : messages('common.unknown')
                }
            />
            <AttributeItem
                label={messages('file.frameRate')}
                value={
                    videoData.product?.frameRate
                        ? `${videoData.product.frameRate} FPS`
                        : messages('common.unknown')
                }
            />
            <AttributeItem
                label={messages('file.videoEncoding')}
                value={
                    videoData.product?.encoding ?? messages('common.unknown')
                }
            />
            <AttributeItem
                label={messages('file.orientation')}
                value={
                    videoData.product?.orientation === Orientation.HORIZONTAL
                        ? messages('common.horizontal')
                        : videoData.product?.orientation ===
                            Orientation.VERTICAL
                          ? messages('common.vertical')
                          : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('file.fileSize')}
                value={
                    videoData.product?.file?.fileSizeInByte
                        ? formatFileSize(
                              Number(videoData?.product?.file?.fileSizeInByte)
                          )
                        : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('common.dateUpload')}
                value={
                    videoData?.product?.file?.dateCreated
                        ? formattedDate(videoData?.product?.file?.dateCreated)
                        : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('common.userUpload')}
                value={videoData?.product?.nameUserCreator}
            />
        </div>
    );
}
