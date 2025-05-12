import { BOOLEAN_TEXT } from '@/enums/common';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {} & SelectProps;

function LogStatusSelect({ ...props }: Props) {
    const messages = useTranslations();
    const options = [
        {
            label: messages('status.success'),
            value: BOOLEAN_TEXT.TRUE,
        },
        {
            label: messages('status.error'),
            value: BOOLEAN_TEXT.FALSE,
        },
    ];

    return (
        <Select
            placeholder={messages('status.label')}
            allowClear
            {...props}
            options={options}
        />
    );
}

export default LogStatusSelect;
