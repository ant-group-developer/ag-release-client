import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import { DATE_FORMAT, TYPE_FILTER } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const DateDeadlineDialog = <T extends Record<string, any>>({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [tempStartDate, setTempStartDate] = useState<string>('');
    const [tempEndDate, setTempEndDate] = useState<string>('');
    const selectContainerRef = useRef<HTMLDivElement>(null);

    // Initialize temporary values when dialog opens
    useEffect(() => {
        if (open) {
            setTempStartDate(dataFilter.deadlineStartDate || '');
            setTempEndDate(dataFilter.deadlineEndDate || '');
        }
    }, [open, dataFilter.deadlineStartDate, dataFilter.deadlineEndDate]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            deadlineStartDate: dayjs(tempStartDate).utc(),
            deadlineEndDate: dayjs(tempEndDate).utc(),
        });
        onCancel();
    };

    const handleDateChange = (
        startDate: string | undefined,
        endDate: string | undefined
    ) => {
        setTempStartDate(startDate || '');
        setTempEndDate(endDate || '');
    };

    const hasSelectedDates = tempStartDate && tempEndDate;

    return (
        <div className="relative">
            {dataFilter.deadline && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.DEADLINE)}
                    onRemove={() =>
                        onChangeFilter({
                            deadline: undefined,
                            deadlineStartDate: undefined,
                            deadlineEndDate: undefined,
                        })
                    }
                >
                    {title}:{' '}
                    {formattedDate(
                        dataFilter.deadlineStartDate,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                    -{' '}
                    {formattedDate(
                        dataFilter.deadlineEndDate,
                        DATE_FORMAT.DATE_ONLY
                    )}
                </Chip>
            )}

            <AppPopover
                className="top-[41px] z-50"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className: hasSelectedDates
                        ? ''
                        : 'opacity-50 cursor-not-allowed',
                    disabled: !hasSelectedDates,
                    onClick: onSubmit,
                }}
                onCancel={onCancel}
            >
                <div ref={selectContainerRef} className="flex w-[304px]">
                    <DateRangePicker
                        allowClear
                        value={
                            tempStartDate && tempEndDate
                                ? [
                                      dayjs(
                                          tempStartDate,
                                          DATE_FORMAT.MYSQL_TYPE_DATE
                                      ),
                                      dayjs(
                                          tempEndDate,
                                          DATE_FORMAT.MYSQL_TYPE_DATE
                                      ),
                                  ]
                                : undefined
                        }
                        externalOnChange={handleDateChange}
                        getPopupContainer={() =>
                            selectContainerRef.current || document.body
                        }
                        placement="topLeft"
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default DateDeadlineDialog;
