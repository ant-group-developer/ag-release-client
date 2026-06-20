import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { LOG_TYPE_MSG_KEY } from '../../constants';
import { LOG_TYPE } from '../../enums';

interface Props extends SelectProps {}

export const LogTypesSelect = ({ ...props }: Props) => {
    const messages = useTranslations();

    const options = Object.values(LOG_TYPE).map((item) => {
        return {
            label: messages(LOG_TYPE_MSG_KEY[item] as any),
            value: item,
        };
    });

    return <Select options={options} {...props} />;
};
