import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ERN_VERSION } from '../../enums';

type Props = SelectProps & {};

export default function ErnVersionSelect({ ...props }: Props) {
    const messages = useTranslations();

    const options = [
        {
            label: ERN_VERSION.ERN_43,
            value: ERN_VERSION.ERN_43,
        },
        {
            label: ERN_VERSION.ERN_382,
            value: ERN_VERSION.ERN_382,
        },
    ];

    return <Select options={options} {...props} />;
}
