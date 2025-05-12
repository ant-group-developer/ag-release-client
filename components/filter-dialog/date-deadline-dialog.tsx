import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import { DATE_FORMAT, TYPE_FILTER } from '@/enums/common';
import { formatDatesToUTC, formattedDate } from '@/helpers/common';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: any) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    showRemove?: boolean;
    onChangeFilter: (value?: any) => void;
};

const DateDeadlineDialog = <T extends Record<string, any>>({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
    showRemove = true,
}: Props<T>) => {
    const [tempStartDate, setTempStartDate] = useState<string>('');
    const [tempEndDate, setTempEndDate] = useState<string>('');
    const selectContainerRef = useRef<HTMLDivElement>(null);

    // Initialize temporary values when dialog opens
    useEffect(() => {
        if (open) {
            setTempStartDate(dataFilter.startDateDeadline || '');
            setTempEndDate(dataFilter.endDateDeadline || '');
        }
    }, [open, dataFilter.startDateDeadline, dataFilter.endDateDeadline]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        const value = formatDatesToUTC(tempStartDate, tempEndDate);

        const [startDateDeadline, endDateDeadline] = value;
        onChangeFilter({
            startDateDeadline,
            endDateDeadline,
        });
        onCancel();
    };

    const handleDateChange = (
        startDateDeadline: string | undefined,
        endDateDeadline: string | undefined
    ) => {
        setTempStartDate(startDateDeadline || '');
        setTempEndDate(endDateDeadline || '');
    };

    const hasSelectedDates = tempStartDate && tempEndDate;

    const valueDateRange =
        tempStartDate && tempEndDate
            ? [dayjs(tempStartDate), dayjs(tempEndDate)]
            : undefined;
    // console.log('🚀 ~ valueDateRange:', valueDateRange);

    if (!(dataFilter.startDateDeadline || !dataFilter.endDateDeadline) && !open)
        return null;

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative">
            {dataFilter.startDateDeadline && dataFilter.endDateDeadline && (
                <Chip
                    className="h-[34px]"
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.DEADLINE)}
                    onRemove={
                        showRemove
                            ? () =>
                                  onChangeFilter({
                                      startDateDeadline: undefined,
                                      endDateDeadline: undefined,
                                  })
                            : undefined
                    }
                >
                    {title}:{' '}
                    {formattedDate(
                        dataFilter.startDateDeadline,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                    -{' '}
                    {formattedDate(
                        dataFilter.endDateDeadline,
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
                <div
                    ref={selectContainerRef}
                    className="flex w-[304px] overflow-visible"
                    onMouseDown={handleContainerMouseDown}
                >
                    <DateRangePicker
                        allowClear
                        value={valueDateRange as [Dayjs | null, Dayjs | null]}
                        externalOnChange={handleDateChange}
                        placement="topLeft"
                        popupClassName="z-[100]"
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default DateDeadlineDialog;
