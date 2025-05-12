import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import {
    getFallbackUrl,
    getIconByType,
    getLinkDriveImageV2,
} from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { ORDER_STATUS } from '@/modules/order/enums';
import DriveIconImage from '@/modules/product-types/components/table/drive-icon-image';
import { PRODUCT_TYPE, TYPE_MODAL_PRODUCT } from '@/modules/product/enums';
import { useRef } from 'react';
import { ProductData } from '../../types';
import ProductVideoThumbnail from '../product-video-thumbnail';

type Props = {
    data: ProductData;
};

export default function GridTableCard({ data }: Props) {
    const ActionButtonRef = useRef<HTMLDivElement>(null);

    const type = data?.productType?.code;

    const openModal = useModalStore((state) => state.openModal);

    const { canUploadFile, canManage } = usePermissionStore(
        (state) => state.permission.product
    );

    const fallback = getFallbackUrl(type ?? PRODUCT_TYPE.IMAGE);
    const icon = getIconByType(type ?? PRODUCT_TYPE.IMAGE);
    const isNew = data.status === ORDER_STATUS.NEW;

    const handleCardClick = () => {
        openModal(TYPE_MODAL_PRODUCT.COMMENT, data);
    };

    const isDone = data.status === ORDER_STATUS.COMPLETED;

    const getThumbnailUrl = (record: ProductData, heigh: number) => {
        const file = record?.product?.file;

        if (file.googleDriveFileId) {
            return getLinkDriveImageV2(file.googleDriveFileId, heigh);
        }

        return file.readUrl;
    };

    const getProductThumbnail = () => {
        const productUrl = getThumbnailUrl(data, 300);
        const googleDriveFileId = data?.product?.file?.googleDriveFileId ?? '';
        if (type === PRODUCT_TYPE.VIDEO) {
            return (
                <div className="relative h-full">
                    <ProductVideoThumbnail
                        onClick={() =>
                            openModal(TYPE_MODAL_PRODUCT.COMMENT, data)
                        }
                        googleDriveFileId={googleDriveFileId}
                        width={400}
                        height={400}
                        fallbackSrc={fallback}
                        alt={data.order?.code}
                        className="!aspect-auto h-full w-full rounded-md object-cover"
                    />
                    {googleDriveFileId && (
                        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white">
                            <svg
                                width="40px"
                                height="40px"
                                viewBox="0 0 40 40"
                                focusable="false"
                            >
                                <g
                                    stroke="none"
                                    stroke-width="1"
                                    fill="none"
                                    fill-rule="evenodd"
                                >
                                    <path
                                        opacity="0.54"
                                        fill="#000000"
                                        d="M20,0 C8.95,0 0,8.95 0,20 C0,31.05 8.95,40 20,40 C31.05,40 40,31.05 40,20 C40,8.95 31.05,0 20,0 L20,0 Z"
                                    ></path>
                                    <path
                                        fill="#FFFFFF"
                                        d="M16,29 L16,11 L28,20 L16,29 L16,29 Z"
                                    ></path>
                                </g>
                            </svg>
                        </div>
                    )}
                </div>
            );
        }
        return (
            <ImageFallback
                onClick={() => openModal(TYPE_MODAL_PRODUCT.COMMENT, data)}
                className="!aspect-auto h-full w-full rounded-md object-cover"
                src={productUrl ?? fallback}
                alt={data.order?.code}
                fallbackSrc={fallback}
                height={500}
                width={500}
            />
        );
    };

    return (
        <div className="flex aspect-square flex-col overflow-hidden rounded-xl bg-slate-100 hover:bg-slate-200">
            <div className="flex items-center">
                <div className="flex flex-1 items-center py-3">
                    <div className="mx-3">
                        <DriveIconImage
                            googleDriveFileId={
                                data?.productType?.googleDriveIconId as string
                            }
                            className="h-4 w-4 object-contain"
                        />
                    </div>
                    <span className="truncate font-bold">
                        {data?.order?.code}
                    </span>
                </div>
                <span
                    ref={ActionButtonRef}
                    className="mr-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ActionButton
                        showComment={!isNew}
                        showDetail
                        showUpload={!isDone && canUploadFile}
                        onShowComment={() =>
                            openModal(TYPE_MODAL_PRODUCT.COMMENT, data)
                        }
                        onShowDetail={() =>
                            openModal(TYPE_MODAL_PRODUCT.DETAIL, data)
                        }
                        onShowUpload={() =>
                            openModal(TYPE_MODAL_PRODUCT.UPLOAD, data)
                        }
                    />
                </span>
            </div>
            <div
                onClick={() => handleCardClick()}
                className="flex-1 cursor-pointer overflow-hidden rounded-md px-3 pb-3"
            >
                {getProductThumbnail()}
            </div>
        </div>
    );
}
