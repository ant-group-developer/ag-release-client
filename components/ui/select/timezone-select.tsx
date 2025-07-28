import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListTimezones } from '@/modules/timezone/hooks/use-get-list-timezones';
import { TimezoneData } from '@/modules/timezone/types';
import { Select, SelectProps } from 'antd';

interface TimezoneSelectProps extends SelectProps {}

export default function TimezoneSelect({ ...props }: TimezoneSelectProps) {
    const { timezonesData } = useGetListTimezones({ pageSize: 999 });

    const options = timezonesData.items.map((item: TimezoneData) => ({
        id: item.id,
        value: item.id,
        label: item.name,
    }));

    return (
        <Select
            placeholder={'Chọn múi giờ'}
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
