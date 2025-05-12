import GoogleDriveEmbed from '@/components/google-drive-embed';
import {
    FALLBACK_IMAGE_SMALL,
    FALLBACK_VIDEO_HORIZONTAL,
} from '@/constants/common';
import { getLinkDriveImage, getLinkDrivePreview } from '@/helpers/link';
import { Alert, Image } from 'antd';
import { useTranslations } from 'next-intl';
import { ReactEventHandler, forwardRef, useRef } from 'react';
import ReactPlayer from 'react-player';
import { ORDER_TYPE } from '../enums';
import { OrderData, OrderProduct } from '../types';

type Props = {
    data: OrderData;
    imageData: OrderProduct | undefined;
    videoData: OrderProduct | undefined;
};

export const ProductContent = forwardRef<HTMLDivElement, Props>(
    ({ data, imageData, videoData }, ref) => {
        const messages = useTranslations();
        const imageRef = useRef(null);
        const handleImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
            const containerDiv = e.currentTarget;
            const img = containerDiv.querySelector('img');
            if (img) {
                if (img.naturalHeight > img.naturalWidth) {
                    img.style.objectFit = 'contain';
                } else {
                    img.style.objectFit = 'cover';
                }
            }
        };

        const videoUrl = videoData?.product?.file?.googleDriveFileId
            ? getLinkDrivePreview(videoData?.product?.file?.googleDriveFileId)
            : videoData?.product?.file?.readUrl;
        const imageUrl = imageData?.product?.file?.googleDriveFileId
            ? getLinkDriveImage(imageData?.product?.file?.googleDriveFileId)
            : imageData?.product?.file?.readUrl;

        const typeVideoDrive = !!videoData?.product?.file?.googleDriveFileId;
        const typeImageDrive = !!imageData?.product?.file?.googleDriveFileId;

        const isTypeVideo = videoData?.productType?.code === ORDER_TYPE.VIDEO;
        const isTypeImage = imageData?.productType?.code === ORDER_TYPE.IMAGE;

        return (
            <div ref={ref}>
                {/* VIDEO */}
                {isTypeVideo &&
                    (videoUrl ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            {typeVideoDrive ? (
                                <GoogleDriveEmbed src={videoUrl} />
                            ) : (
                                <ReactPlayer
                                    url={videoUrl}
                                    controls
                                    width="100%"
                                    height="100%"
                                    playing={false}
                                    preload="none"
                                    config={{
                                        file: {
                                            attributes: {
                                                preload: 'none',
                                            },
                                        },
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <Image
                            className="max-h-[65vh] w-full rounded-lg"
                            alt="image"
                            src={FALLBACK_VIDEO_HORIZONTAL}
                            onLoad={handleImageLoad}
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                        />
                        // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ))}

                {/* IMAGE */}
                {isTypeImage &&
                    !isTypeVideo &&
                    (imageUrl ? (
                        <div
                            ref={imageRef}
                            className="w-full overflow-hidden rounded-lg bg-gray-50"
                        >
                            <Image
                                className="max-h-[65vh] w-full rounded-lg"
                                alt="image"
                                src={imageUrl}
                                onLoad={handleImageLoad}
                                preview={{
                                    maskClassName: 'rounded-lg',
                                }}
                                width={'100%'}
                                height={'100%'}
                            />
                        </div>
                    ) : (
                        // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        <Image
                            className="max-h-[65vh] w-full rounded-lg"
                            alt="image"
                            src={FALLBACK_IMAGE_SMALL}
                            onLoad={handleImageLoad}
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                        />
                    ))}

                {typeVideoDrive && (
                    // <p className="py-1 text-xs italic">
                    //     {messages('message.ifVideoNotProcessed')}
                    // </p>
                    <div className="mt-2 overflow-hidden rounded-md">
                        <Alert
                            banner
                            message={messages('message.ifVideoNotProcessed')}
                            type="info"
                        />
                    </div>
                )}
            </div>
        );
    }
);

ProductContent.displayName = 'ProductContent';

export default ProductContent;
