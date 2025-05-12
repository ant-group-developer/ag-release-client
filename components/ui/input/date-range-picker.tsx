import { DATE_FORMAT } from '@/enums/common';
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const { RangePicker } = DatePicker;

type Props = {
    externalOnChange?: (
        fromDate: any | undefined,
        toDate: any | undefined
    ) => void;
} & RangePickerProps;

const VALUE_FORMAT = DATE_FORMAT.MYSQL_TYPE_DATE;
const DISPLAY_FORMAT = DATE_FORMAT.DATE_ONLY;

function DateRangePicker({ onChange, externalOnChange, ...props }: Props) {
    const messages = useTranslations();
    const [open, setOpen] = useState<boolean | undefined>(undefined);

    const handleChange: RangePickerProps['onChange'] = (
        values,
        formatString
    ) => {
        const fromDate = values?.[0]
            ? dayjs(values?.[0]).format(VALUE_FORMAT)
            : undefined;

        const toDate = values?.[1]
            ? dayjs(values?.[1]).format(VALUE_FORMAT)
            : undefined;

        externalOnChange?.(fromDate, toDate);
        onChange?.(values, formatString);
    };

    const handleQuickSelect = (
        monthsOffset: number,
        isFullYear: boolean = false
    ) => {
        let fromDate: any;
        let fromDate1: any;
        let toDate: any;
        let toDate1: any;

        if (isFullYear) {
            fromDate = dayjs().subtract(monthsOffset, 'year').startOf('year');
            fromDate1 = dayjs()
                .subtract(monthsOffset, 'year')
                .startOf('year')
                .format(VALUE_FORMAT);
            toDate = dayjs().subtract(monthsOffset, 'year').endOf('year');
            toDate1 = dayjs()
                .subtract(monthsOffset, 'year')
                .endOf('year')
                .format(VALUE_FORMAT);
        } else {
            fromDate = dayjs().subtract(monthsOffset, 'month').startOf('month');
            fromDate1 = dayjs()
                .subtract(monthsOffset, 'month')
                .startOf('month')
                .format(VALUE_FORMAT);
            toDate = dayjs().subtract(monthsOffset, 'month').endOf('month');
            toDate1 = dayjs()
                .subtract(monthsOffset, 'month')
                .endOf('month')
                .format(VALUE_FORMAT);
        }

        externalOnChange?.(fromDate1, toDate1);
        onChange?.([fromDate, toDate], [fromDate, toDate]);
        setOpen(false);
    };

    const quickSelectOptions = [
        { monthsOffset: 0, label: dayjs().format('MM/YYYY') },
        {
            monthsOffset: 1,
            label: dayjs().subtract(1, 'month').format('MM/YYYY'),
        },
        {
            monthsOffset: 2,
            label: dayjs().subtract(2, 'month').format('MM/YYYY'),
        },
        {
            monthsOffset: 3,
            label: dayjs().subtract(3, 'month').format('MM/YYYY'),
        },
        {
            monthsOffset: 4,
            label: dayjs().subtract(4, 'month').format('MM/YYYY'),
        },
        {
            monthsOffset: 5,
            label: dayjs().subtract(5, 'month').format('MM/YYYY'),
        },
        {
            monthsOffset: 1,
            label: dayjs().subtract(1, 'year').format('YYYY'),
            isFullYear: true,
        },
        { monthsOffset: 0, label: dayjs().format('YYYY'), isFullYear: true },
    ];

    const renderExtraFooter = () => (
        <div className="grid grid-cols-4 gap-2 py-2">
            {quickSelectOptions.map((option, index) => (
                <div key={index}>
                    <p
                        onClick={() =>
                            handleQuickSelect(
                                option.monthsOffset,
                                option.isFullYear
                            )
                        }
                        className="text-primary mx-auto w-fit cursor-pointer rounded-lg px-3 py-1 text-center text-sm hover:bg-blue-100"
                    >
                        {option.label}
                    </p>
                </div>
            ))}
        </div>
    );

    return (
        <RangePicker
            open={open}
            format={DISPLAY_FORMAT}
            placeholder={[
                messages('common.fromDate'),
                messages('common.toDate'),
            ]}
            {...props}
            onChange={handleChange}
            renderExtraFooter={renderExtraFooter}
            onOpenChange={setOpen}
        />
    );
}

export default DateRangePicker;
