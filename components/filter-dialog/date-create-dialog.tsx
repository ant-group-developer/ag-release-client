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

const DateCreatedDialog = <T extends Record<string, any>>({
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
            setTempStartDate(dataFilter.startDateCreated || '');
            setTempEndDate(dataFilter.endDateCreated || '');
        }
    }, [open, dataFilter.startDateCreated, dataFilter.endDateCreated]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        const [startDateCreated, endDateCreated] = formatDatesToUTC(
            tempStartDate,
            tempEndDate
        );
        onChangeFilter({
            startDateCreated,
            endDateCreated,
        });
        onCancel();
    };

    const handleDateChange = (
        startDateCreated: string | undefined,
        endDateCreated: string | undefined
    ) => {
        setTempStartDate(startDateCreated || '');
        setTempEndDate(endDateCreated || '');
    };

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const hasSelectedDates = tempStartDate && tempEndDate;

    if (!(dataFilter.startDateCreated || !dataFilter.endDateCreated) && !open)
        return null;

    return (
        <div className="relative">
            {dataFilter.startDateCreated && dataFilter.endDateCreated && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED)
                    }
                    onRemove={() =>
                        onChangeFilter({
                            startDateCreated: undefined,
                            endDateCreated: undefined,
                        })
                    }
                >
                    {title}:{' '}
                    {formattedDate(
                        dataFilter.startDateCreated,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                    -{' '}
                    {formattedDate(
                        dataFilter.endDateCreated,
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

export default DateCreatedDialog;
