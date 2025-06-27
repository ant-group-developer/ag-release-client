import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import { DATE_FORMAT, TYPE_FILTER } from '@/enums/common';
import { formatDatesToUTC, formattedDate } from '@/helpers/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
dayjs.extend(utc);

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: any) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const DateReleaseDialog = <T extends Record<string, any>>({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
}: Props<T>) => {
    const [tempStartDate, setTempStartDate] = useState<string>('');
    const [tempEndDate, setTempEndDate] = useState<string>('');

    // Initialize temporary values when dialog opens
    useEffect(() => {
        if (open) {
            setTempStartDate(dataFilter.startDateRelease || '');
            setTempEndDate(dataFilter.endDateRelease || '');
        }
    }, [open, dataFilter.startDateRelease, dataFilter.endDateRelease]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        const [startDateRelease, endDateRelease] = formatDatesToUTC(
            tempStartDate,
            tempEndDate
        );
        onChangeFilter({
            startDateRelease,
            endDateRelease,
        });
        onCancel();
    };

    const handleDateChange = (
        startDateRelease: string | undefined,
        endDateRelease: string | undefined
    ) => {
        setTempStartDate(startDateRelease || '');
        setTempEndDate(endDateRelease || '');
    };

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const hasSelectedDates = tempStartDate && tempEndDate;

    if (!(dataFilter.startDateRelease || !dataFilter.endDateRelease) && !open)
        return null;

    return (
        <div className="relative">
            {dataFilter.startDateRelease && dataFilter.endDateRelease && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED)
                    }
                    onRemove={() =>
                        onChangeFilter({
                            startDateRelease: undefined,
                            endDateRelease: undefined,
                        })
                    }
                >
                    {title}:{' '}
                    {formattedDate(
                        dataFilter.startDateRelease,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                    -{' '}
                    {formattedDate(
                        dataFilter.endDateRelease,
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
                    className="z-50 flex w-[300px]"
                    onMouseDown={handleContainerMouseDown}
                >
                    <DateRangePicker
                        allowClear
                        value={
                            tempStartDate && tempEndDate
                                ? [dayjs(tempStartDate), dayjs(tempEndDate)]
                                : undefined
                        }
                        externalOnChange={handleDateChange}
                        placement="topLeft"
                        disabledDate={(current) =>
                            current && current > dayjs().endOf('day')
                        }
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default DateReleaseDialog;
