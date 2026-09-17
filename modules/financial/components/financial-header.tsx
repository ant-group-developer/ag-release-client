'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { DatePicker, theme, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;

interface FinancialHeaderProps {
    dateRange?: [Dayjs, Dayjs];
    onDateRangeChange?: (dates: [Dayjs, Dayjs] | null) => void;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({
    dateRange: controlledDateRange,
    onDateRangeChange,
}) => {
    const t = useTranslations('financial');
    const { token } = theme.useToken();

    const [internalRange, setInternalRange] = useState<[Dayjs, Dayjs]>([
        dayjs('2026-04-01'),
        dayjs('2026-09-30'),
    ]);

    const range = controlledDateRange || internalRange;

    const handleRangeChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            setInternalRange([dates[0], dates[1]]);
            onDateRangeChange?.([dates[0], dates[1]]);
        } else {
            onDateRangeChange?.(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
            <div className="flex flex-col gap-1">
                <Typography.Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    {t('title')}
                </Typography.Title>
                <Typography.Text type="secondary">
                    {t('subtitle')}
                </Typography.Text>
            </div>

            <div className="flex items-center">
                <RangePicker
                    picker="month"
                    value={range}
                    onChange={handleRangeChange}
                    format="MMM YYYY"
                    allowClear={false}
                    className="rounded-xl px-4 py-2 border"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderColor: token.colorBorderSecondary,
                    }}
                    suffixIcon={<ChevronDown className="w-4 h-4 opacity-70" />}
                    prevIcon={<Calendar className="w-4 h-4" />}
                />
            </div>
        </div>
    );
};
