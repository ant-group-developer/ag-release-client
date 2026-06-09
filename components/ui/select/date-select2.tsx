import { DATE_FORMAT } from '@/enums/common';
import {
    Button,
    DatePicker,
    Select,
    SelectProps,
    Space,
    Typography,
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

type Props = {
    externalOnChange?: (startDate: string, endDate: string) => void;
} & SelectProps;

type DateRangeOption = {
    label: React.ReactNode;
    value: string;
    dateRangeLabel: string;
    isCustom?: boolean;
};

const DAY_RANGES = [7, 14, 30, 90, 180, 365];
const CUSTOM_RANGE_VALUE = 'CUSTOM_RANGE';

enum TYPE {
    SELECT = 'SELECT',
    RANGE = 'RANGE',
}

const getDateRangeOptions = (
    getLabel: (days: number) => string,
    formatDisplayDate: (date: Dayjs) => string,
    baseDate: Dayjs = dayjs()
): DateRangeOption[] => {
    const endDate = baseDate;

    return DAY_RANGES.map((days) => {
        const startDate = endDate.subtract(days - 1, 'day');

        return {
            label: getLabel(days),
            value: `${startDate.format(DATE_FORMAT.MYSQL_TYPE_DATE)},${endDate.format(
                DATE_FORMAT.MYSQL_TYPE_DATE
            )}`,
            dateRangeLabel: `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`,
        };
    });
};

export default function DateSelect2({ externalOnChange, ...props }: Props) {
    const messages = useTranslations();
    const [type, setType] = useState<TYPE>(TYPE.SELECT);
    const [selectOpen, setSelectOpen] = useState(false);
    const [rangeOpen, setRangeOpen] = useState(false);
    const { style: selectStyle, ...selectProps } = props;

    const formatDisplayDate = (date: Dayjs) =>
        date.format(DATE_FORMAT.DATE_MONTH);

    const formatCustomRangeDate = (date: Dayjs) =>
        date.format(DATE_FORMAT.DATE_ONLY);

    const options = useMemo(
        () => [
            ...getDateRangeOptions(
                (days) => messages('date.lastDays', { days }),
                formatDisplayDate
            ),
            {
                label: messages('date.customRange'),
                value: CUSTOM_RANGE_VALUE,
                dateRangeLabel: '',
                isCustom: true,
            },
        ],
        [messages]
    );

    const handleSelectChange: SelectProps['onChange'] = (value, option) => {
        if (value === CUSTOM_RANGE_VALUE) {
            setType(TYPE.RANGE);
            setSelectOpen(false);
            setRangeOpen(true);
            return;
        }

        setType(TYPE.SELECT);
        setSelectOpen(false);
        selectProps.onChange?.(value, option);

        const [startDate, endDate] = value?.split?.(',') ?? ['', ''];
        externalOnChange?.(startDate, endDate);
    };

    const handleSelect: SelectProps['onSelect'] = (value) => {
        if (value === CUSTOM_RANGE_VALUE) {
            setType(TYPE.RANGE);
            setSelectOpen(false);
            setRangeOpen(true);
        }
    };

    const handleRangeChange: RangePickerProps['onChange'] = (values) => {
        const startDate = values?.[0]?.format(DATE_FORMAT.MYSQL_TYPE_DATE);
        const endDate = values?.[1]?.format(DATE_FORMAT.MYSQL_TYPE_DATE);

        if (!startDate || !endDate) {
            return;
        }

        selectProps.onChange?.(`${startDate},${endDate}`, undefined as any);
        externalOnChange?.(startDate, endDate);
    };

    const showPresetSelect = () => {
        setType(TYPE.SELECT);
        setSelectOpen(true);
        setRangeOpen(false);
    };

    const isPresetValue = useMemo(
        () =>
            options.some(
                (option) => !option.isCustom && option.value === props.value
            ),
        [options, props.value]
    );

    const selectValue = props.value
        ? isPresetValue
            ? props.value
            : CUSTOM_RANGE_VALUE
        : undefined;

    const [startDate, endDate] = props.value?.toString().split(',') ?? [];
    const customRangeLabel =
        startDate && endDate
            ? `${formatCustomRangeDate(dayjs(startDate, DATE_FORMAT.MYSQL_TYPE_DATE))} - ${formatCustomRangeDate(
                  dayjs(endDate, DATE_FORMAT.MYSQL_TYPE_DATE)
              )}`
            : messages('date.customRange');

    useEffect(() => {
        setType(isPresetValue || !props.value ? TYPE.SELECT : TYPE.RANGE);
    }, [isPresetValue, props.value]);

    const rangeValue: RangePickerProps['value'] =
        startDate && endDate
            ? [
                  dayjs(startDate, DATE_FORMAT.MYSQL_TYPE_DATE),
                  dayjs(endDate, DATE_FORMAT.MYSQL_TYPE_DATE),
              ]
            : undefined;

    return (
        <>
            {type === TYPE.SELECT ? (
                <Select
                    popupMatchSelectWidth={280}
                    listHeight={320}
                    {...selectProps}
                    allowClear={false}
                    open={selectOpen}
                    onChange={handleSelectChange}
                    onOpenChange={setSelectOpen}
                    onSelect={handleSelect}
                    options={options}
                    style={selectStyle}
                    value={selectValue}
                    labelRender={({ label, value }) =>
                        value === CUSTOM_RANGE_VALUE ? customRangeLabel : label
                    }
                    optionRender={(option) => {
                        const data = option.data as DateRangeOption;

                        if (data.isCustom) {
                            return (
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        alignItems: 'center',
                                        padding: '4px 0',
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        className="!w-full"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {data.label}
                                    </Button>
                                    {!isPresetValue && (
                                        <Typography.Text
                                            style={{ fontSize: 11 }}
                                            type="secondary"
                                        >
                                            {customRangeLabel}
                                        </Typography.Text>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    gap: 8,
                                    justifyContent: 'space-between',
                                    minWidth: 248,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Typography.Text strong>
                                    {data.label}
                                </Typography.Text>
                                <Typography.Text
                                    style={{ flexShrink: 0 }}
                                    type="secondary"
                                >
                                    {data.dateRangeLabel}
                                </Typography.Text>
                            </div>
                        );
                    }}
                />
            ) : (
                <Space.Compact>
                    <RangePicker
                        open={rangeOpen}
                        onOpenChange={setRangeOpen}
                        allowClear={false}
                        format={DATE_FORMAT.DATE_ONLY}
                        onChange={handleRangeChange}
                        separator={
                            <span
                                style={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    width: 12,
                                }}
                            >
                                -
                            </span>
                        }
                        style={{ width: 220 }}
                        suffixIcon={<span />}
                        value={rangeValue}
                    />
                    <Button
                        aria-label={messages('date.selectDate')}
                        icon={<ChevronDown size={16} />}
                        onClick={showPresetSelect}
                    />
                </Space.Compact>
            )}
        </>
    );
}
