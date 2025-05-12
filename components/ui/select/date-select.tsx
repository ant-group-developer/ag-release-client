import { DATE_FORMAT } from '@/enums/common';
import { cn } from '@/helpers/common';
import { Select, SelectProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import DateRangePicker from '../input/date-range-picker';

type Props = {
    rangeMonth?: number;
    rangeYear?: number;
    externalOnChange?: (startDate: string, endDate: string) => void;
    selectClassName?: string;
    rangeClassName?: string;
} & SelectProps;

enum TYPE {
    SELECT = 'SELECT',
    RANGE = 'RANGE',
}

function DateSelect({
    rangeMonth = 3,
    rangeYear = 2,
    className,
    rootClassName,
    externalOnChange,
    selectClassName,
    rangeClassName,
    ...props
}: Props) {
    const messages = useTranslations();
    const [type, setType] = useState<TYPE>(TYPE.SELECT);

    const getTime = (
        range: number,
        type: 'month' | 'year',
        format: DATE_FORMAT
    ) => {
        const label = dayjs().subtract(range, type).format(format);
        const startDate = dayjs()
            .subtract(range, type)
            .startOf(type)
            .format(DATE_FORMAT.MYSQL_TYPE_DATE);

        const endDate = dayjs()
            .subtract(range, type)
            .endOf(type)
            .format(DATE_FORMAT.MYSQL_TYPE_DATE);

        return {
            label,
            value: `${startDate},${endDate}`,
        };
    };

    const options = [
        {
            label: messages('common.filterByMonth'),
            options: Array(rangeMonth)
                .fill('month')
                .map((_, index) => {
                    const { label, value } = getTime(
                        index,
                        'month',
                        DATE_FORMAT.MONTH_YEAR
                    );
                    return {
                        label,
                        value,
                    };
                }),
        },
        {
            label: messages('common.filterByYear'),
            options: Array(rangeYear)
                .fill('month')
                .map((_, index) => {
                    const { label, value } = getTime(
                        index,
                        'year',
                        DATE_FORMAT.YEAR
                    );
                    return {
                        label,
                        value,
                    };
                }),
        },
        {
            label: messages('gender.other'),
            options: [
                {
                    label: messages('common.custom'),
                    value: TYPE.RANGE,
                },
            ],
        },
    ];

    const onChange: SelectProps['onChange'] = (value, option) => {
        if (value === TYPE.RANGE) {
            setType(value);
        } else {
            props.onChange?.(value, option);
            const [startDate, endDate] = value?.split?.(',') ?? ['', ''];
            externalOnChange?.(startDate, endDate);
        }
    };

    useEffect(() => {
        const isValueSelect = options.some((item) =>
            item.options.some((child) => child.value === props?.value)
        );
        setType(isValueSelect ? TYPE.SELECT : TYPE.RANGE);
    }, [props?.value]);

    const [startDate, endDate] = props?.value?.split(',');

    return (
        <div className={rootClassName}>
            {type === TYPE.SELECT ? (
                <Select
                    className={cn(className, selectClassName)}
                    listHeight={350}
                    {...props}
                    allowClear={false}
                    onChange={onChange}
                    options={options}
                />
            ) : (
                <DateRangePicker
                    className={cn(className, rangeClassName)}
                    allowClear={false}
                    value={[
                        dayjs(startDate, DATE_FORMAT.MYSQL_TYPE_DATE),
                        dayjs(endDate, DATE_FORMAT.MYSQL_TYPE_DATE),
                    ]}
                    externalOnChange={externalOnChange as any}
                />
            )}
        </div>
    );
}

export default DateSelect;
