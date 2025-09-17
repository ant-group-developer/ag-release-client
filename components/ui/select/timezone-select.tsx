import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTimezones } from '@/modules/timezone/hooks/use-get-list-simple-timezones';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface TimezoneSelectProps extends SelectProps {
    fallBack?: string;
}

export default function TimezoneSelect({
    fallBack,
    ...props
}: TimezoneSelectProps) {
    const messages = useTranslations();
    const { timezonesData } = useGetListSimpleTimezones();

    const options = timezonesData.map((item) => ({
        id: item.id,
        value: item.id,
        name: item.name,
        label: `${item.name} ${item.utc}`,
    }));

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            placeholder={messages('timezone.placeholder.selectTimezone')}
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            optionFilterProp="name"
            options={options}
            allowClear
            labelRender={labelRender}
        />
    );
}
