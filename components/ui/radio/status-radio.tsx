import { formattedNumber, getIntlCodeByStatus } from '@/helpers/common';
import { StatusCountData } from '@/modules/order/types';
import { Empty, Radio, RadioProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ORDER_STATUS } from '../../../modules/order/enums';

interface StatusRadioProps extends RadioProps {
    optionsData: StatusCountData[];
}

export default function StatusRadio({
    optionsData,
    ...props
}: StatusRadioProps) {
    const messages = useTranslations();

    const statusOptions = optionsData.map((item) => {
        const getStatusName = messages(
            getIntlCodeByStatus(item.name as ORDER_STATUS)
        );

        return {
            value: item.name,
            label: (
                <div className="flex w-[160px] justify-between">
                    <span className="truncate">{getStatusName}</span>
                    <span>{formattedNumber(item.count)}</span>
                </div>
            ),
        };
    });

    if (optionsData.length === 0) return <Empty />;

    return (
        <Radio.Group className="w-full" {...props} options={statusOptions} />
    );
}
