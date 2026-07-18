'use client';

import DateRangePicker from '@/components/ui/input/date-range-picker';
import dayjs from 'dayjs';

type Props = {
    startDate?: string;
    endDate?: string;
    onChange: (startDate: string | undefined, endDate: string | undefined) => void;
};

export default function DateRangeFilterContent({
    startDate,
    endDate,
    onChange,
}: Props) {
    return (
        <div className="flex flex-col gap-2 py-2">
            <DateRangePicker
                className="w-full"
                allowClear
                value={
                    startDate && endDate
                        ? [dayjs(startDate), dayjs(endDate)]
                        : undefined
                }
                externalOnChange={(fromDate, toDate) => {
                    onChange(fromDate, toDate);
                }}
                placement="bottomLeft"
            />
        </div>
    );
}
