import { SIZE_ICON } from '@/constants/common';
import { LAYOUT_TABLE } from '@/enums/common';
import { Radio, RadioGroupProps } from 'antd';
import { AlignJustify, LayoutGrid } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CustomTooltip from '../tooltip/custom-tooltip';

type Props = RadioGroupProps & {
    value: LAYOUT_TABLE;
};

export default function TableLayoutSegmented({ value, ...props }: Props) {
    const messages = useTranslations();

    return (
        // <Segmented
        //     {...props}
        //     size="small"
        //     options={[
        //         {
        //             label: (
        //                 <CustomTooltip
        //                     placement="bottomLeft"
        //                     title={messages('common.listLayout')}
        //                 >
        //                     <AlignJustify height={28} size={SIZE_ICON} />
        //                 </CustomTooltip>
        //             ),
        //             value: LAYOUT_TABLE.LIST,
        //         },
        //         {
        //             label: (
        //                 <CustomTooltip
        //                     placement="bottomLeft"
        //                     title={messages('common.gridLayout')}
        //                 >
        //                     <LayoutGrid height={28} size={SIZE_ICON} />
        //                 </CustomTooltip>
        //             ),
        //             value: LAYOUT_TABLE.GRID,
        //         },
        //     ]}
        //     {...props}
        // />
        // <Flex {...props}>
        <Radio.Group
            {...props}
            defaultValue={value}
            size="middle"
            className="min-w-[110px]"
        >
            <CustomTooltip
                placement="bottomLeft"
                title={messages('common.listLayout')}
            >
                <Radio.Button value={LAYOUT_TABLE.LIST}>
                    <AlignJustify size={SIZE_ICON} className="h-full" />
                </Radio.Button>
            </CustomTooltip>
            <CustomTooltip
                placement="bottomLeft"
                title={messages('common.gridLayout')}
            >
                <Radio.Button value={LAYOUT_TABLE.GRID}>
                    <LayoutGrid size={SIZE_ICON} className="h-full" />
                </Radio.Button>
            </CustomTooltip>
        </Radio.Group>
        // </Flex>
    );
}
