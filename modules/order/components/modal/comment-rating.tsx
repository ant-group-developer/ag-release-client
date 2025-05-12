import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import StatusTag from '@/components/ui/tag/status-tag';
import { FALLBACK_IMAGE_HORIZONTAL } from '@/constants/common';
import { COMMENT_RATING_TAB_KEY, UPLOAD_TYPE } from '@/enums/common';
import { getColorByStatus, getIntlCodeByStatus } from '@/helpers/common';
import { getLinkDriveImage, getLinkDrivePreview } from '@/helpers/link';
import { getNameByLocale } from '@/helpers/string';
import { CloseModalProps, OpenModalProps } from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ACCOUNT_TYPE } from '@/modules/user/enums';
import { Divider, Skeleton, Spin, Tabs, TabsProps, Tag } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ORDER_STATUS } from '../../enums';
import { useGetDetailOrder } from '../../hooks/use-detail-order';
import { useGetRatingComment } from '../../hooks/use-get-rating-comment';
import { OrderData } from '../../types';
import DownloadOptions from '../button/download-options';
import CommentList from '../comment-list';
import CommentForm from '../form/comment-form';
import OrderInformation from '../order-information';
import ProductContent from '../product-content';
import ProductThumbnail from '../product-thumbnail';
import ProductInfoTabs from '../tabs/product-info-tab';
type Props = {
    onClose: CloseModalProps;
    orderData: OrderData;
    showRating?: boolean;
    showFormComment?: boolean;
    initialTabKey?: COMMENT_RATING_TAB_KEY;
    openModal: OpenModalProps;
} & Omit<AppModalProps, 'children'>;

export default function CommentRating({
    orderData,
    showRating = true,
    showFormComment = true,
    initialTabKey,
    openModal,
    ...props
}: Props) {
    // const isLoading = useLoading(UseLoadingType.Fetching);
    const [tabKey, setTabKey] = useState<COMMENT_RATING_TAB_KEY>();
    const messages = useTranslations();
    const locale = useLocale();
    const productRef = useRef<HTMLDivElement>(null);
    const { data, isLoading } = useGetDetailOrder(orderData?.id);
    const { data: dataRating, isLoading: isLoadingRating } =
        useGetRatingComment(orderData?.id, { enabled: !!data?.id });
    const [productContentHeight, setProductContentHeight] = useState(0);

    const dataProduct = data?.orderProduct;

    const imageData = dataProduct?.find(
        (item) => item?.productType?.code === UPLOAD_TYPE.IMAGE
    );
    const videoData = dataProduct?.find(
        (item) => item?.productType?.code === UPLOAD_TYPE.VIDEO
    );
    const sourceData = dataProduct?.find(
        (item) => item?.productType?.code === UPLOAD_TYPE.SOURCE
    );

    const videoUrl = videoData?.product?.file?.googleDriveFileId
        ? getLinkDrivePreview(videoData?.product?.file?.googleDriveFileId)
        : videoData?.product?.file?.readUrl;
    const imageUrl = imageData?.product?.file?.googleDriveFileId
        ? getLinkDriveImage(imageData?.product?.file?.googleDriveFileId)
        : imageData?.product?.file?.readUrl;
    const sourceUrl = sourceData?.product?.source;

    const isVideoHasData = !!videoUrl;
    const isImageHasData = !!imageUrl;
    const isSourceHasData = !!sourceUrl;

    const { profile } = useAuth();
    const { canManage } = usePermissionStore(
        (state) => state.permission.product
    );

    const shouldShowRating = () => {
        const isManager = canManage;
        const isCreatorOrder = data?.userCreatorId === profile?.id;
        const isAdmin = profile?.accountType === ACCOUNT_TYPE.ADMIN;

        const currentProduct = data?.orderProduct?.find(
            (product) => product.productType?.code === tabKey
        );

        const isApprover = currentProduct?.approverId === profile?.id;

        switch (currentProduct?.status) {
            case ORDER_STATUS.NEW:
                return false;
            case ORDER_STATUS.IN_PROGRESS:
                return false;
            case ORDER_STATUS.LEADER_REJECT:
                if (isApprover || isManager || isAdmin) return true;
                return false;
            case ORDER_STATUS.PENDING_LEADER_APPROVAL:
                if (isApprover || isManager || isAdmin) return true;
                return false;
            case ORDER_STATUS.PENDING_APPROVAL:
                if (isAdmin || isCreatorOrder) return true;
                return false;
            case ORDER_STATUS.COMPLETED:
                if (isAdmin || isCreatorOrder) return true;
                return false;
            case ORDER_STATUS.REJECT:
                if (isAdmin || isCreatorOrder) return true;
                return false;
            case ORDER_STATUS.OVERDUE:
                return false;
            case ORDER_STATUS.CANCEL:
                return false;
            default:
                break;
        }
    };

    // const isTypeVideoAndThumbnail =
    //     data?.type === ORDER_TYPE.VIDEO_AND_THUMBNAIL;

    const latestRatingVideo = dataRating?.find(
        (item) =>
            item?.rate &&
            item?.orderProduct?.productType?.code == UPLOAD_TYPE.VIDEO
    );

    const latestRatingImage = dataRating?.find(
        (item) =>
            item?.rate &&
            item?.orderProduct?.productType?.code == UPLOAD_TYPE.IMAGE
    );
    const latestRatingSource = dataRating?.find(
        (item) =>
            item?.rate &&
            item?.orderProduct?.productType?.code == UPLOAD_TYPE.SOURCE
    );

    const getStatusBadgeByRating = (rating: number | undefined) => {
        if (!rating) return 'processing';
        return 'default';
    };

    // const getColorByRating = (rating: number | undefined): string => {
    //     if (!rating) return getColorByStatus(ORDER_STATUS.NEW);
    //     return rating > 5
    //         ? getColorByStatus(ORDER_STATUS.COMPLETED)
    //         : getColorByStatus(ORDER_STATUS.REJECT);
    // };

    const createBadgeLabel = (
        ratingText: string,
        rating?: number,
        status?: ORDER_STATUS
    ) => {
        const isValidStatusToShow =
            status === ORDER_STATUS.COMPLETED || status === ORDER_STATUS.REJECT;

        return (
            <div className="flex items-center gap-1">
                <span className="capitalize">{ratingText}</span>
                <Tag
                    className="!mr-0"
                    // bordered={false}
                    color={getColorByStatus(status as ORDER_STATUS)}
                >
                    <span className="capitalize">
                        {messages(getIntlCodeByStatus(status as ORDER_STATUS))}
                    </span>
                    {isValidStatusToShow && `: ${rating}`}
                </Tag>
                {/* <Badge
                count={rating ?? undefined}
                // size="small"
                status={getStatusBadgeByRating(rating)}
                color={getColorByStatus(status as ORDER_STATUS)}
                // offset={[8, -2]}
            /> */}
            </div>
        );
    };

    const typeTabsItems = () => {
        const items: TabsProps['items'] = dataProduct?.map((item) => {
            const getRate = () => {
                switch (item.productType.code) {
                    case UPLOAD_TYPE.IMAGE:
                        return latestRatingImage?.rate;
                    case UPLOAD_TYPE.VIDEO:
                        return latestRatingVideo?.rate;
                    case UPLOAD_TYPE.SOURCE:
                        return latestRatingSource?.rate;
                    default:
                        return 0;
                }
            };
            const label = getNameByLocale(
                item?.productType?.nameEn,
                item?.productType?.nameVi,
                locale
            ).toLocaleLowerCase();

            return {
                key: item.productType.code,
                label: createBadgeLabel(` ${label}`, getRate(), item?.status),
                // disabled: !item?.product,
            };
        });

        return items;
    };

    const onChangeTab = (activeKey: string | COMMENT_RATING_TAB_KEY) => {
        setTabKey(activeKey as COMMENT_RATING_TAB_KEY);
    };

    const getUniqueUserCreatorIds = () => {
        const uniqueUserCreatorIds = new Set(
            dataRating.map((item) => item.userCreatorId)
        );
        return uniqueUserCreatorIds.size;
    };

    // const isStatusValidToRating = (status?: ORDER_STATUS) => {
    //     return (
    //         status === ORDER_STATUS.COMPLETED ||
    //         status === ORDER_STATUS.REJECT ||
    //         status === ORDER_STATUS.PENDING_APPROVAL ||
    //         status === ORDER_STATUS.PENDING_LEADER_APPROVAL
    //     );
    // };

    useEffect(() => {
        if (!tabKey) {
            const newTabKey =
                initialTabKey ?? dataProduct?.[0]?.productType?.code;
            setTabKey(newTabKey as COMMENT_RATING_TAB_KEY);
        }

        // Lấy chiều cao của content product cho thumbnail
        if (productRef.current) {
            setProductContentHeight(productRef.current.offsetHeight);
        }
    }, [dataProduct, initialTabKey, productRef.current?.offsetHeight, tabKey]);

    // const isActiveTab = () => {
    //     switch (tabKey) {
    //         case COMMENT_RATING_TAB_KEY.VIDEO:
    //             return (
    //                 isVideoHasData && isStatusValidToRating(videoData?.status)
    //             );
    //         case COMMENT_RATING_TAB_KEY.IMAGE:
    //             return (
    //                 isImageHasData && isStatusValidToRating(imageData?.status)
    //             );
    //         case COMMENT_RATING_TAB_KEY.SOURCE:
    //             return (
    //                 isSourceHasData && isStatusValidToRating(sourceData?.status)
    //             );
    //         default:
    //             return false;
    //     }
    // };

    if (isLoading || !data) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    const titleModal = () => {
        return (
            <div className="flex items-center justify-between">
                <div>
                    {messages('rating.rating&comment')} {orderData.code}{' '}
                    <StatusTag bordered value={data?.status} />
                </div>
            </div>
        );
    };

    return (
        <AppModal
            {...props}
            title={titleModal()}
            footer={null}
            width={1800}
            style={{ top: 10 }}
            cancelButtonProps={{ disabled: isLoading }}
        >
            <div className="scrollbar-hidden grid h-full max-h-[85vh] grid-cols-12 gap-4 overflow-auto">
                <div className="col-span-8">
                    <ProductContent
                        data={data}
                        imageData={imageData}
                        videoData={videoData}
                        ref={productRef}
                    />

                    <DownloadOptions
                        videoFileId={videoData?.product?.fileId}
                        imageFileId={imageData?.product?.fileId}
                        videoGoogleDriveFileId={
                            videoData?.product?.file?.googleDriveFileId
                        }
                        imageGoogleDriveFileId={
                            imageData?.product?.file?.googleDriveFileId
                        }
                    />

                    <ProductInfoTabs
                        imageData={imageData}
                        videoData={videoData}
                        sourceData={sourceData}
                        data={data}
                        tabKey={tabKey}
                        onChange={onChangeTab}
                    />

                    <Divider />

                    <OrderInformation data={data} />
                </div>

                <div className="col-span-4 flex flex-col">
                    {!!videoData && !!imageData && (
                        <ProductThumbnail
                            className="mb-4 min-h-[35vh] w-full flex-1 overflow-hidden rounded-lg object-cover"
                            style={{ maxHeight: productContentHeight }}
                            src={imageUrl ?? ''}
                            fallback={FALLBACK_IMAGE_HORIZONTAL}
                            preview={
                                imageUrl
                                    ? {
                                          maskClassName: 'rounded-lg ',
                                      }
                                    : false
                            }
                        />

                        // <GoogleDriveEmbed src={imageUrl} />
                    )}
                    <Tabs
                        type="card"
                        className="!mb-0"
                        activeKey={tabKey}
                        items={typeTabsItems()}
                        onChange={(activeKey) => onChangeTab(activeKey)}
                    />
                    {showFormComment && (
                        <CommentForm
                            className="mt-4"
                            activeTab={tabKey}
                            imageData={imageData}
                            videoData={videoData}
                            sourceData={sourceData}
                            showRating={shouldShowRating()}
                        />
                    )}
                    {isLoadingRating ? (
                        <Skeleton avatar paragraph={{ rows: 4 }} />
                    ) : (
                        <CommentList
                            totalUserCreator={getUniqueUserCreatorIds()}
                            data={dataRating || []}
                            className="custom-scrollbar max-h-[750px] min-h-[400px] overflow-auto"
                        />
                    )}
                </div>
            </div>
        </AppModal>
    );
}
