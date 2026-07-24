import { DATE_FORMAT } from '@/enums/common';
import { DatePicker, GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

dayjs.extend(quarterOfYear);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type Props = Omit<RangePickerProps, 'value' | 'onChange'> & {
    value?: string;
    onChange?: (value: string) => void;
    externalOnChange?: (startDate: string, endDate: string) => void;
};

const MONTH_PRESET_START_OFFSET = 2;
const MONTH_PRESET_COUNT = 4;
const PAST_YEAR_PRESET_COUNT = 4;
const LIFETIME_START_DATE = '2000-01-01';

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

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const presets = useMemo(() => {
        if (picker === 'date') {
            return [
                {
                    label: messages('date.last7Days'),
                    value: () =>
                        [
                            dayjs().subtract(6, 'day').startOf('day'),
                            dayjs().endOf('day'),
                        ] as [Dayjs, Dayjs],
                },
                {
                    label: messages('date.lastDays', { days: 14 }),
                    value: () =>
                        [
                            dayjs().subtract(13, 'day').startOf('day'),
                            dayjs().endOf('day'),
                        ] as [Dayjs, Dayjs],
                },
                {
                    label: messages('date.lastDays', { days: 28 }),
                    value: () =>
                        [
                            dayjs().subtract(27, 'day').startOf('day'),
                            dayjs().endOf('day'),
                        ] as [Dayjs, Dayjs],
                },
                {
                    label: messages('date.thisMonth'),
                    value: () => {
                        const start = dayjs().startOf('month');
                        let end = dayjs().endOf('month');
                        if (end.isAfter(dayjs())) {
                            end = dayjs().endOf('day');
                        }
                        return [start, end] as [Dayjs, Dayjs];
                    },
                },
                {
                    label: messages('date.lastMonth'),
                    value: () => {
                        const lastMonth = dayjs().subtract(1, 'month');
                        return [
                            lastMonth.startOf('month'),
                            lastMonth.endOf('month'),
                        ] as [Dayjs, Dayjs];
                    },
                },
                ...Array.from({ length: 4 }, (_, i) => {
                    const targetMonth = dayjs().subtract(i + 2, 'month');
                    return {
                        label: targetMonth.format(DATE_FORMAT.MONTH_YEAR),
                        value: () =>
                            [
                                targetMonth.startOf('month'),
                                targetMonth.endOf('month'),
                            ] as [Dayjs, Dayjs],
                    };
                }),
            ];
        }

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
                    value: () => {
                        const start = targetYear.startOf('year');
                        let end = targetYear.endOf('year');
                        if (end.isAfter(dayjs())) {
                            end = dayjs().endOf('day');
                        }
                        return [start, end] as [Dayjs, Dayjs];
                    },
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
    }, [messages, picker]);

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

        let start = values[0];
        let end = values[1];

        if (picker === 'month') {
            start = start.startOf('month');
            end = end.endOf('month');
        } else if (picker === 'year') {
            start = start.startOf('year');
            end = end.endOf('year');
        } else if (picker === 'quarter') {
            start = start.startOf('quarter');
            end = end.endOf('quarter');
        }

        const startDate = start.format(valueFormat);
        const endDate = end.format(valueFormat);

        onChange?.(`${startDate},${endDate}`);
        externalOnChange?.(startDate, endDate);
    };

    const format =
        props.format ??
        (picker === 'month' ? DATE_FORMAT.MONTH_YEAR : DATE_FORMAT.DATE_ONLY);

    return (
        <DatePicker.RangePicker
            allowClear={false}
            picker={picker}
            disabledDate={disabledDate}
            {...props}
            style={{
                ...props.style,
                fontWeight: 400,
            }}
            format={format}
            presets={presets}
            value={rangeValue}
            onChange={handleRangeChange}
        />
    );
}
