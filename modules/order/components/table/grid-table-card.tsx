import ActionButton from '@/components/ui/button/action-button';
import { getFallbackUrl, getLinkDriveImage } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import Image from 'next/image';
import { useRef } from 'react';
import { ORDER_STATUS, TYPE_MODAL_ORDER } from '../../enums';
import { OrderData } from '../../types';

type Props = {
    data: OrderData;
};

export default function GridTableCard({ data }: Props) {
    const ActionButtonRef = useRef<HTMLDivElement>(null);

    const openModal = useModalStore((state) => state.openModal);
    const { canDelete, canReview, canUpdate } = usePermissionStore(
        (state) => state.permission.order
    );

    const productBasedOnPriority =
        data.orderProduct?.find(
            (p) => p.productType?.code === PRODUCT_TYPE.VIDEO
        ) ??
        data.orderProduct?.find(
            (p) => p.productType?.code === PRODUCT_TYPE.IMAGE
        ) ??
        data.orderProduct?.find(
            (p) => p.productType?.code === PRODUCT_TYPE.SOURCE
        ) ??
        null;

    const productUrl = data?.urlProduct;
    const fallback = getFallbackUrl(
        productBasedOnPriority?.productType?.code ?? PRODUCT_TYPE.IMAGE
    );
    const googleDriveIconId =
        productBasedOnPriority?.productType?.googleDriveIconId;
    const icon = getLinkDriveImage(googleDriveIconId as string);
    const isCompleted = data.status === ORDER_STATUS.COMPLETED;
    const isNew = data.status === ORDER_STATUS.NEW;
    const isCancel = data.status === ORDER_STATUS.CANCEL;
    const isTypeVideo =
        productBasedOnPriority?.productType?.code === PRODUCT_TYPE.VIDEO;

    const handleCardClick = () => {
        openModal(TYPE_MODAL_ORDER.COMMENT, data);
    };

    return (
        <div className="flex aspect-square flex-col overflow-hidden rounded-xl bg-slate-100 hover:bg-slate-200">
            <div className="flex items-center">
                <div className="flex flex-1 items-center py-3">
                    <div className="mx-3">
                        <Image
                            src={icon}
                            alt=""
                            width={20}
                            height={20}
                            className="h-4 w-4 text-red-500"
                        />
                    </div>
                    <span className="truncate font-bold">{data?.code}</span>
                </div>
                <span ref={ActionButtonRef} className="mr-1">
                    <ActionButton
                        showComment={!isNew && canReview}
                        showDetail
                        showUpdate={isNew && canUpdate}
                        showCancel={!isCompleted && !isCancel}
                        showDelete={!isCompleted && canDelete}
                        showContinue={isCancel}
                        onShowContinue={() =>
                            openModal(TYPE_MODAL_ORDER.CONTINUE, data)
                        }
                        onShowComment={() =>
                            openModal(TYPE_MODAL_ORDER.COMMENT, data)
                        }
                        onShowDetail={() =>
                            openModal(TYPE_MODAL_ORDER.DETAIL, data)
                        }
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_ORDER.UPDATE, data)
                        }
                        onShowCancel={() =>
                            openModal(TYPE_MODAL_ORDER.CANCEL, data)
                        }
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_ORDER.DELETE, data)
                        }
                    />
                </span>
            </div>
            <div
                onClick={() => handleCardClick()}
                className="relative mx-3 mb-3 flex-1 cursor-pointer overflow-hidden rounded-md"
            >
                <Image
                    alt=""
                    width={300}
                    height={300}
                    src={productUrl ?? fallback}
                    className="h-full w-full object-cover"
                />
                {productUrl && isTypeVideo && (
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
        </div>
    );
}
