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

const DateCreatedDialog = <T extends Record<string, any>>({
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
            setTempStartDate(dataFilter.startDate || '');
            setTempEndDate(dataFilter.endDate || '');
        }
    }, [open, dataFilter.startDate, dataFilter.endDate]);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        // Xóa bộ lọc deadline nếu đã có khi áp dụng bộ lọc date created
        onChangeFilter({
            startDate: tempStartDate,
            endDate: tempEndDate,
            dateCreated: tempStartDate && tempEndDate ? true : undefined,
            // Xóa các giá trị của deadline
            deadlineStartDate: undefined,
            deadlineEndDate: undefined,
            deadline: undefined,
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
            {dataFilter.dateCreated && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED)
                    }
                    onRemove={() =>
                        onChangeFilter({
                            dateCreated: undefined,
                            startDate: undefined,
                            endDate: undefined,
                        })
                    }
                >
                    {title}:{' '}
                    {formattedDate(dataFilter.startDate, DATE_FORMAT.DATE_ONLY)}{' '}
                    - {formattedDate(dataFilter.endDate, DATE_FORMAT.DATE_ONLY)}
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

export default DateCreatedDialog;
