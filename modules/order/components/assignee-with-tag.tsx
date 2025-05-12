import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { getIntlCodeByProductType } from '@/helpers/common';
import { getLinkDrive } from '@/helpers/link';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HTMLAttributes } from 'react';
import { OrderProduct } from '../types';

type Props = {
    productData: OrderProduct;
    // color: string;
    // name: string;
    nameAssignee: string;
    nameAssigneeClick?: React.MouseEventHandler<HTMLSpanElement>;
    IconTypeClick?: React.MouseEventHandler<HTMLImageElement>;
} & HTMLAttributes<HTMLDivElement>;

export default function AssigneeWithIconType({
    productData,
    // color,
    // name,
    nameAssignee,
    nameAssigneeClick,
    IconTypeClick,
    ...props
}: Props) {
    const messages = useTranslations();

    if (!nameAssignee) {
        return null;
    }

    const imageUrl = getLinkDrive(
        productData?.productType?.googleDriveIconId as string
    );

    return (
        <div {...props} className="flex items-center">
            {/* <ProductTypeTag color={color} name={name} /> */}

            {imageUrl && (
                <CustomTooltip
                    title={messages(
                        getIntlCodeByProductType(
                            productData?.productType?.code as PRODUCT_TYPE
                        )
                    )}
                    size="small"
                >
                    <Image
                        src={imageUrl}
                        alt="icon"
                        width={16}
                        height={16}
                        className="mr-1 cursor-pointer"
                        onClick={IconTypeClick}
                    />
                </CustomTooltip>
            )}

            <CustomTooltip
                title={messages('filter.filterByUsername', {
                    value: nameAssignee,
                })}
                size="small"
            >
                <span
                    onClick={nameAssigneeClick}
                    className="cursor-pointer truncate hover:text-blue-500 hover:underline group-hover:underline"
                >
                    {nameAssignee}
                </span>
            </CustomTooltip>
        </div>
    );
}
