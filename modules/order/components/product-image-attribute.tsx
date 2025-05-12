import { formattedDate } from '@/helpers/common';

import { Orientation } from '@/enums/common';
import { formatFileSize } from '@/helpers/common';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { OrderProduct } from '../types';
import { default as AttributeItem } from './attribute-item';

type Props = {
    imageData: OrderProduct;
};

export default function ProductImageAttribute({ imageData }: Props) {
    const messages = useTranslations();

    if (!imageData?.product) return <Empty />;
    return (
        <div className="grid grid-cols-5 gap-4">
            <AttributeItem
                label={messages('file.resolution')}
                value={
                    imageData.product?.width && imageData.product?.height
                        ? `${imageData.product.width}x${imageData.product.height}`
                        : messages('common.unknown')
                }
            />
            <AttributeItem
                label={messages('file.orientation')}
                value={
                    imageData.product?.orientation === Orientation.HORIZONTAL
                        ? messages('common.horizontal')
                        : imageData.product?.orientation ===
                            Orientation.VERTICAL
                          ? messages('common.vertical')
                          : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('file.fileSize')}
                value={
                    imageData.product?.file?.fileSizeInByte
                        ? formatFileSize(
                              Number(imageData?.product?.file?.fileSizeInByte)
                          )
                        : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('common.dateUpload')}
                value={
                    imageData?.product?.file?.dateCreated
                        ? formattedDate(imageData?.product?.file?.dateCreated)
                        : messages('common.unknown')
                }
            />

            <AttributeItem
                label={messages('common.userUpload')}
                value={imageData?.product?.nameUserCreator ?? ''}
            />
        </div>
    );
}
