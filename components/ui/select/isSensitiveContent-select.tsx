import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {};

export default function IsSensitiveContentSelect({ ...props }: Props) {
    const messages = useTranslations();
    return (
        <Select
            {...props}
            className="w-full"
            showSearch
            options={[
                {
                    label: messages('common.yes'),
                    value: 'true',
                },
                {
                    label: messages('common.no'),
                    value: 'false',
                },
            ]}
        />
    );
}
