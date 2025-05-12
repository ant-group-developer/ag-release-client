import { COMMENT_RATING_TAB_KEY } from '@/enums/common';
import { getIntlCodeByProductType } from '@/helpers/common';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { useGetUploadHistory } from '@/modules/product/hooks/use-get-upload-history';
import { UploadProductHistoryPayload } from '@/modules/product/types';
import { Empty, Spin, Tabs, TabsProps } from 'antd';
import { Camera, FolderOpen, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PRODUCT_INFO_TAB } from '../../enums';
import { OrderData, OrderProduct } from '../../types';
import HistoryTimeline from '../history-timeline';
import ProductAttributes from '../product-attributes';
import ProductNote from '../product-note';

type Props = TabsProps & {
    data: OrderData;
    imageData: OrderProduct | undefined;
    videoData: OrderProduct | undefined;
    sourceData: OrderProduct | undefined;
    tabKey: COMMENT_RATING_TAB_KEY | undefined;
};

export default function ProductInfoTabs({
    imageData,
    videoData,
    sourceData,
    data,
    tabKey,
    ...props
}: Props) {
    const messages = useTranslations();

    const productData = data?.orderProduct;

    const payload: UploadProductHistoryPayload = {
        orderId: data?.id,
    };
    const isTabHistory = tabKey === COMMENT_RATING_TAB_KEY.HISTORY;
    const { uploadHistoryData, isFetching } = useGetUploadHistory(
        payload,
        isTabHistory
    );

    const imageHistoryData = uploadHistoryData.filter((item) => {
        return item?.productType?.code === PRODUCT_TYPE.IMAGE;
    });
    const videoHistoryData = uploadHistoryData.filter((item) => {
        return item?.productType?.code === PRODUCT_TYPE.VIDEO;
    });

    const sourceHistoryData = uploadHistoryData.filter((item) => {
        return item?.productType?.code === PRODUCT_TYPE.SOURCE;
    });

    const items: TabsProps['items'] = productData?.map((item) => {
        const productAttributes = () => {
            if (item?.productType?.code === PRODUCT_TYPE.VIDEO) {
                return <ProductAttributes videoData={item} />;
            } else if (item?.productType?.code === PRODUCT_TYPE.IMAGE) {
                return <ProductAttributes imageData={item} />;
            } else if (item?.productType?.code === PRODUCT_TYPE.SOURCE) {
                return <ProductAttributes sourceData={item} />;
            }
        };

        return {
            key: item.productType.code,
            label: messages(
                getIntlCodeByProductType(item.productType.code as PRODUCT_TYPE)
            ),
            disabled: !item?.product,
            children: (
                <div>
                    {/* <ProductAttributes data={item} /> */}
                    {productAttributes()}

                    <ProductNote
                        className="mt-4"
                        note={item?.note}
                        title={messages('order.description.assigneeNote')}
                    />
                </div>
            ),
        };
    });

    items?.push({
        key: PRODUCT_INFO_TAB.HISTORY,
        label: messages('common.historyUpload'),
        children: (
            <div className="flex gap-28 px-2">
                {isFetching ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Spin />
                    </div>
                ) : (
                    <div className="flex max-h-60 w-full overflow-auto">
                        <HistoryTimeline
                            className="flex-1"
                            data={videoHistoryData}
                            icon={<Video />}
                            title={messages('common.video')}
                        />
                        <HistoryTimeline
                            className="flex-1"
                            data={imageHistoryData}
                            icon={<Camera />}
                            title={messages('common.image')}
                        />
                        <HistoryTimeline
                            className="flex-1"
                            data={sourceHistoryData}
                            icon={<FolderOpen />}
                            title={messages('common.source')}
                        />
                        {!videoHistoryData.length &&
                            !imageHistoryData.length &&
                            !sourceData?.product?.source && (
                                <Empty className="w-full" />
                            )}
                    </div>
                )}
            </div>
        ),
    });

    return videoData?.product || imageData?.product || sourceData?.product ? (
        <Tabs type="card" activeKey={tabKey} {...props} items={items} />
    ) : null;
}
