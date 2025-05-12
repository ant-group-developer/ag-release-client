import { OPACITY_TAG } from '@/constants/common';
import { hexToRGBA } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { OrderProduct } from '@/modules/order/types';
import { Tag } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import CustomTooltip from '../tooltip/custom-tooltip';

type Props = {
    data: OrderProduct[];
    onChangeFilter: (value?: any) => void;
};

export default function ProductTypeTags({ data, onChangeFilter }: Props) {
    const messages = useTranslations();
    const locale = useLocale();

    // console.log(data);

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-2">
            {data
                ?.sort((a, b) =>
                    a.productType?.code.localeCompare(b.productType?.code)
                )
                .map((item, index) => {
                    const productType = item?.productType;
                    const priorityName = getNameByLocale(
                        productType?.nameEn,
                        productType?.nameVi,
                        locale
                    );

                    const rgbaColor = hexToRGBA(
                        productType?.color,
                        OPACITY_TAG
                    );
                    return (
                        <CustomTooltip
                            key={index}
                            title={messages('filter.filterByProductType', {
                                value: priorityName?.toLowerCase(),
                            })}
                            size="small"
                        >
                            <Tag
                                color={rgbaColor}
                                bordered={false}
                                className="cursor-pointer group-hover:underline"
                                onClick={() =>
                                    onChangeFilter({
                                        productTypeId: productType?.id,
                                    })
                                }
                            >
                                <span
                                    style={{
                                        color: productType?.color,
                                        textDecorationColor: productType?.color,
                                    }}
                                    className="group-hover:underline"
                                >
                                    {priorityName}
                                </span>
                            </Tag>
                        </CustomTooltip>
                    );
                })}
        </div>
    );
}
