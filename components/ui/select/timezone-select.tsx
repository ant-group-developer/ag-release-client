import { Select, SelectProps } from 'antd';

const timezoneOptions = [
    { label: 'Asia/Ho_Chi_Minh (GMT+7)', value: 'Asia/Ho_Chi_Minh' },
    { label: 'America/New_York (GMT-4)', value: 'America/New_York' },
    { label: 'Europe/London (GMT+1)', value: 'Europe/London' },
    { label: 'Asia/Tokyo (GMT+9)', value: 'Asia/Tokyo' },
    { label: 'Australia/Sydney (GMT+10)', value: 'Australia/Sydney' },
];

interface TimezoneSelectProps extends SelectProps {}

export default function TimezoneSelect({
    placeholder = 'Select timezone',
    ...props
}: TimezoneSelectProps) {
    return (
        <Select
            {...props}
            showSearch
            placeholder={placeholder}
            optionFilterProp="label"
            options={timezoneOptions}
            filterOption={(input, option) =>
                (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
            }
            allowClear
        />
    );
}
