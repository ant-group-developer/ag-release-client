import { DATE_FORMAT } from '@/enums/common';
import { DatePicker, GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

dayjs.extend(isoWeek);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type Props = Omit<RangePickerProps, 'value' | 'onChange'> & {
    value?: string;
    onChange?: (value: string) => void;
    externalOnChange?: (startDate: string, endDate: string) => void;
};

const DAY_RANGES = [7, 14, 30, 90, 180, 365];

export default function DateSelect2({
    value,
    onChange,
    externalOnChange,
    ...props
}: Props) {
    const messages = useTranslations();

    const presets = useMemo(() => {
        const customPresets = [
            {
                label: messages('date.thisWeek'),
                value: () =>
                    [dayjs().startOf('isoWeek'), dayjs()] as [Dayjs, Dayjs],
            },
            {
                label: messages('date.thisMonth'),
                value: () =>
                    [dayjs().startOf('month'), dayjs()] as [Dayjs, Dayjs],
            },
            {
                label: messages('date.thisYear'),
                value: () =>
                    [dayjs().startOf('year'), dayjs()] as [Dayjs, Dayjs],
            },
        ];

        const relativePresets = DAY_RANGES.map((days) => ({
            label: messages('date.lastDays', { days }),
            value: () =>
                [dayjs().subtract(days - 1, 'day'), dayjs()] as [Dayjs, Dayjs],
        }));

        return [...customPresets, ...relativePresets];
    }, [messages]);

    const rangeValue = useMemo<RangePickerProps['value']>(() => {
        if (!value) return null;
        const [startDateStr, endDateStr] = value.split(',');
        if (startDateStr && endDateStr) {
            const start = dayjs(startDateStr, DATE_FORMAT.MYSQL_TYPE_DATE);
            const end = dayjs(endDateStr, DATE_FORMAT.MYSQL_TYPE_DATE);
            if (start.isValid() && end.isValid()) {
                return [start, end];
            }
        }
        return null;
    }, [value]);

    const handleRangeChange = (values: RangePickerProps['value']) => {
        if (!values || !values[0] || !values[1]) {
            onChange?.('');
            externalOnChange?.('', '');
            return;
        }

        const startDate = values[0].format(DATE_FORMAT.MYSQL_TYPE_DATE);
        const endDate = values[1].format(DATE_FORMAT.MYSQL_TYPE_DATE);

        onChange?.(`${startDate},${endDate}`);
        externalOnChange?.(startDate, endDate);
    };

    return (
        <DatePicker.RangePicker
            allowClear={false}
            format={DATE_FORMAT.DATE_ONLY}
            {...props}
            presets={presets}
            value={rangeValue}
            onChange={handleRangeChange}
        />
    );
}
