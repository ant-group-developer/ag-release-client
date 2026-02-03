import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import { DATE_FORMAT, TYPE_FILTER } from '@/enums/common';
import { formatDatesToUTC, formattedDate } from '@/helpers/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
dayjs.extend(utc);

type Props = {
    handleChangeTypeFilter: (value?: any) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: any;
    onChangeFilter: (value?: any) => void;
};

const DateUpdateDialog = ({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
}: Props) => {
    const [tempStartDate, setTempStartDate] = useState<string>('');
    const [tempEndDate, setTempEndDate] = useState<string>('');

    useEffect(() => {
        if (open) {
            setTempStartDate(dataFilter.startUpdatedAt || '');
            setTempEndDate(dataFilter.endUpdatedAt || '');
        }
    }, [open, dataFilter.startUpdatedAt, dataFilter.endUpdatedAt]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        const [startDateUpdated, endDateUpdated] = formatDatesToUTC(
            tempStartDate,
            tempEndDate
        );

        onChangeFilter({
            startUpdatedAt: startDateUpdated,
            endUpdatedAt: endDateUpdated,
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

    if (!(dataFilter.startUpdatedAt || !dataFilter.endUpdatedAt) && !open)
        return null;

    return (
        <div className="relative">
            {dataFilter.startUpdatedAt && dataFilter.endUpdatedAt && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.DATE_UPDATED)
                    }
                    onRemove={() =>
                        onChangeFilter({
                            startUpdatedAt: undefined,
                            endUpdatedAt: undefined,
                        })
                    }
                >
                    {title}:{' '}
                    {formattedDate(
                        dataFilter.startUpdatedAt,
                        DATE_FORMAT.DATE_ONLY
                    )}{' '}
                    -{' '}
                    {formattedDate(
                        dataFilter.endUpdatedAt,
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

export default DateUpdateDialog;
