import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { LOG_LEVEL_MSG_KEY } from '../../constants';
import { LOG_LEVEL } from '../../enums';

interface Props extends SelectProps {}

export const LogLevelsSelect = ({ ...props }: Props) => {
    const messages = useTranslations();

    const options = Object.values(LOG_LEVEL).map((item) => {
        return {
            label: messages(LOG_LEVEL_MSG_KEY[item] as any),
            value: item,
        };
    });

    return <Select options={options} {...props} />;
};
