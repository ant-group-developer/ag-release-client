import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
type Props = SelectProps & {};

export default function DateStatisticSelect({ ...props }: Props) {
    const messages = useTranslations();
    return (
        <Select
            className="w-[150px]"
            variant="filled"
            placeholder={messages('date.selectDate')}
            {...props}
        />
    );
}
