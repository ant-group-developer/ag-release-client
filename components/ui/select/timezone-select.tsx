import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTimezones } from '@/modules/timezone/hooks/use-get-list-simple-timezones';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface TimezoneSelectProps extends SelectProps {}

export default function TimezoneSelect({ ...props }: TimezoneSelectProps) {
    const messages = useTranslations();
    const { timezonesData } = useGetListSimpleTimezones();

    const options = timezonesData.map((item) => ({
        id: item.id,
        value: item.id,
        label: item.name,
    }));

    return (
        <Select
            placeholder={messages('timezone.placeholder.selectTimezone')}
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            optionFilterProp="label"
            options={options}
            allowClear
        />
    );
}
