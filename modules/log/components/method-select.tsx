import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { METHOD } from '../enums';

type Props = {} & SelectProps;

function MethodSelect({ ...props }: Props) {
    const messages = useTranslations();
    const options = Object.values(METHOD).map((item) => ({
        label: item,
        value: item,
    }));

    return (
        <Select
            placeholder={messages('common.method')}
            allowClear
            {...props}
            options={options}
        />
    );
}

export default MethodSelect;
