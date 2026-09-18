import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTimezones } from '@/modules/timezone/hooks/use-get-list-simple-timezones';
import { Select, SelectProps, Typography } from 'antd';
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
        utc: item.utc,
        label: (
            <div className="space-x-1">
                <Typography.Text className="!text-xs">
                    {item?.utc}
                </Typography.Text>
                <Typography.Text>{item?.name}</Typography.Text>
            </div>
        ),
    }));

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    const filterOption = (input: string, option: any) => {
        const searchValue = toNonAccentVietnamese(input).toLowerCase().trim();
        if (!searchValue) return true;

        const name = toNonAccentVietnamese(option?.name ?? '').toLowerCase();
        if (name.includes(searchValue)) return true;

        const rawUtc = toNonAccentVietnamese(option?.utc ?? '').toLowerCase();
        if (rawUtc.includes(searchValue)) return true;

        const cleanSearch = searchValue.replace(/\s+/g, '');
        const cleanUtc = rawUtc.replace(/\s+/g, '');
        if (cleanUtc.includes(cleanSearch)) return true;

        const normalizedSearch = cleanSearch.replace(/([+-])0(\d)/g, '$1$2');
        const normalizedUtc = cleanUtc.replace(/([+-])0(\d)/g, '$1$2');
        return normalizedUtc.includes(normalizedSearch);
    };

    return (
        <Select
            placeholder={messages('timezone.placeholder.selectTimezone')}
            {...props}
            showSearch
            filterOption={filterOption}
            options={options}
            allowClear
            labelRender={labelRender}
        />
    );
}
