import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { PRICE_TIER_TYPE } from '../../enums';

type Props = SelectProps & {};

export default function PriceTierTypeSelect({ ...props }: Props) {
    const messages = useTranslations();

    const options = [
        {
            label: messages('price.album'),
            value: PRICE_TIER_TYPE.ALBUM,
        },
        {
            label: messages('price.track'),
            value: PRICE_TIER_TYPE.TRACK,
        },
    ];

    return (
        <Select
            placeholder={messages('price.type')}
            options={options}
            {...props}
        />
    );
}
