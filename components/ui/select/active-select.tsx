import AppSelect from '@/components/ui/select/nomal-select';
import { ACTIVE_TYPE } from '@/enums/common';
import { SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface ActiveSelectProps extends SelectProps {}

export default function ActiveSelect({ ...props }: ActiveSelectProps) {
    const messages = useTranslations();
    const statusOptions = [
        {
            value: ACTIVE_TYPE.ON,
            label: messages('status.active'),
        },
        {
            value: ACTIVE_TYPE.OFF,
            label: messages('status.inActive'),
        },
    ];
    return (
        <AppSelect
            {...props}
            options={statusOptions}
            placeholder={messages('status.select')}
            className="min-w-[150px]"
            allowClear
        />
    );
}
