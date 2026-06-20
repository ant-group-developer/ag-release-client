import { DATE_FORMAT } from '@/enums/common';
import { DatePicker, GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type Props = Omit<RangePickerProps, 'value' | 'onChange'> & {
    value?: string;
    onChange?: (value: string) => void;
    externalOnChange?: (startDate: string, endDate: string) => void;
};

const MONTH_PRESET_START_OFFSET = 2;
const MONTH_PRESET_COUNT = 4;
const PAST_YEAR_PRESET_COUNT = 4;
const LIFETIME_START_DATE = '1970-01-01';

export default function DateSelect2({
    value,
    onChange,
    externalOnChange,
    picker = 'month',
    ...props
}: Props) {
    const messages = useTranslations();
    const valueFormat =
        typeof props.format === 'string'
            ? props.format
            : DATE_FORMAT.MYSQL_TYPE_DATE;

    const presets = useMemo(() => {
        const monthPresets = Array.from(
            { length: MONTH_PRESET_COUNT },
            (_, i) => {
                const targetMonth = dayjs()
                    .subtract(MONTH_PRESET_START_OFFSET, 'month')
                    .subtract(i, 'month');

                return {
                    label: targetMonth.format(DATE_FORMAT.MONTH_YEAR),
                    value: () =>
                        [
                            targetMonth.startOf('month'),
                            targetMonth.endOf('month'),
                        ] as [Dayjs, Dayjs],
                };
            }
        );

        const pastYearsPresets = Array.from(
            { length: PAST_YEAR_PRESET_COUNT },
            (_, i) => {
                const yearDiff = i;
                const targetYear = dayjs().subtract(yearDiff, 'year');

                return {
                    label: targetYear.format(DATE_FORMAT.YEAR),
                    value: () =>
                        [
                            targetYear.startOf('year'),
                            targetYear.endOf('year'),
                        ] as [Dayjs, Dayjs],
                };
            }
        );

        const lifetimePreset = {
            label: <div>{messages('date.lifetime')}</div>,
            value: () =>
                [
                    dayjs(LIFETIME_START_DATE, DATE_FORMAT.MYSQL_TYPE_DATE),
                    dayjs(),
                ] as [Dayjs, Dayjs],
        };

        return [...monthPresets, lifetimePreset, ...pastYearsPresets];
    }, [messages]);

    const rangeValue = useMemo<RangePickerProps['value']>(() => {
        if (!value) return null;
        const [startDateStr, endDateStr] = value.split(',');
        if (startDateStr && endDateStr) {
            const start = dayjs(startDateStr, valueFormat);
            const end = dayjs(endDateStr, valueFormat);
            if (start.isValid() && end.isValid()) {
                return [start, end];
            }
        }
        return null;
    }, [value, valueFormat]);

    const handleRangeChange = (values: RangePickerProps['value']) => {
        if (!values || !values[0] || !values[1]) {
            onChange?.('');
            externalOnChange?.('', '');
            return;
        }

        const startDate = values[0].format(valueFormat);
        const endDate = values[1].format(valueFormat);

        onChange?.(`${startDate},${endDate}`);
        externalOnChange?.(startDate, endDate);
    };

    const format =
        props.format ??
        (picker === 'month'
            ? DATE_FORMAT.MONTH_YEAR
            : DATE_FORMAT.DATE_ONLY);

    return (
        <DatePicker.RangePicker
            allowClear={false}
            picker={picker}
            {...props}
            format={format}
            presets={presets}
            value={rangeValue}
            onChange={handleRangeChange}
        />
    );
}
