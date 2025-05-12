import { LOCALE } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import TextArea from 'antd/es/input/TextArea';
import { useLocale, useTranslations } from 'next-intl';
import { OrderData } from '../types';
import IllustrativeImageList from './illustrative-Image-list';

type Props = {
    data: OrderData;
};

export default function OrderInformation({ data }: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const orderProduct = data?.orderProduct;
    {
        console.log(data?.orderIllustrative);
    }

    return (
        <>
            <p className="py-2 text-base font-bold">
                {messages('order.detailOrder')}
            </p>

            <div className="space-y-4">
                <div className="flex gap-1">
                    <p>{messages('order.user.creator')}:</p>
                    <span> {data?.nameUserCreator} </span>
                </div>

                <div className="flex items-center gap-1">
                    <p>{messages('common.deadline')}:</p>
                    <span> {formattedDate(data?.deadline)} </span>
                </div>

                {data?.content && (
                    <div>
                        <span>{messages('common.content')}:</span>
                        <TextArea
                            autoSize={{ minRows: 3, maxRows: 10 }}
                            value={data?.content}
                        />
                    </div>
                )}

                {orderProduct &&
                    orderProduct.length > 0 &&
                    orderProduct.map((item) => {
                        const descriptionName =
                            locale === LOCALE.EN
                                ? item.productType.nameEn
                                : item.productType.nameVi;

                        if (!item.description) return null;
                        return (
                            <div>
                                <span>
                                    {`${messages('common.description')} ${descriptionName.toLowerCase()}`}
                                    :
                                </span>
                                <TextArea
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                    value={item.description}
                                />
                            </div>
                        );
                    })}

                {data && data?.orderIllustrative?.length > 0 && (
                    <div>
                        <span>{messages('order.illustrativeImage')}:</span>
                        <IllustrativeImageList
                            data={data?.orderIllustrative}
                            title={messages('order.illustrativeImage')}
                        />
                    </div>
                )}

                <div>
                    <span>{messages('common.note')}:</span>
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        value={data?.note}
                    />
                </div>
            </div>
        </>
    );
}
