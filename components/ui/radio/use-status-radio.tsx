import { formattedNumber } from '@/helpers/common';
import { StatusCountData } from '@/modules/order/types';
import { Empty, Radio, RadioProps } from 'antd';
import { useTranslations } from 'next-intl';
import { USED_STATUS } from '../../../modules/order/enums';

interface UseStatusRadioProps extends RadioProps {
    optionsData: StatusCountData[];
}

export default function UseStatusRadio({
    optionsData,
    ...props
}: UseStatusRadioProps) {
    const messages = useTranslations();

    const statusOptions = optionsData.map((item) => {
        let statusValue;
        let translationKey;
        switch (item.name) {
            case USED_STATUS.USED:
                statusValue = USED_STATUS.USED;
                translationKey = messages('common.used');
                break;

            case USED_STATUS.NOT_USED:
                statusValue = USED_STATUS.NOT_USED;
                translationKey = messages('common.notUsed');
                break;

            case null:
                statusValue = USED_STATUS.NULL;
                translationKey = messages('common.unknown');
                break;

            default:
                break;
        }

        return {
            value: statusValue,
            label: (
                <div className="flex w-[160px] justify-between">
                    <span className="truncate">{translationKey}</span>
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
