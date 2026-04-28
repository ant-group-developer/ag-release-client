'use client';

import { useTranslations } from 'next-intl';
import CheckboxFilterContent from './contents/checkbox-filter-content';
import DateRangeFilterContent from './contents/date-range-filter-content';
import InputFilterContent from './contents/input-filter-content';
import { FilterConfig } from './types';

type Props = {
    config: FilterConfig;
    dataFilter: Record<string, any>;
    onChangeFilter: (newValue: Record<string, any>) => void;
};

export default function FilterCategoryContent({
    config,
    dataFilter,
    onChangeFilter,
}: Props) {
    const messages = useTranslations();

    /**
     * Get current selected values for checkbox type
     */
    const getCheckboxValues = (): string[] => {
        const key = config.filterKey as string;
        const raw = dataFilter[key];
        if (!raw) return [];
        if (config.isCommaSeparated && typeof raw === 'string') {
            return raw.split(',').filter(Boolean);
        }
        if (Array.isArray(raw)) return raw;
        return [raw];
    };

    /**
     * Handle checkbox value change - apply immediately
     */
    const handleCheckboxChange = (values: string[]) => {
        const key = config.filterKey as string;
        if (config.isCommaSeparated) {
            onChangeFilter({
                [key]: values.length > 0 ? values.join(',') : undefined,
            });
        } else {
            onChangeFilter({
                [key]: values.length > 0 ? values : undefined,
            });
        }
    };

    /**
     * Handle date range change - apply immediately
     */
    const handleDateRangeChange = (
        startDate: string | undefined,
        endDate: string | undefined
    ) => {
        const [startKey, endKey] = config.filterKey as [string, string];
        onChangeFilter({
            [startKey]: startDate || undefined,
            [endKey]: endDate || undefined,
        });
    };

    /**
     * Handle input value change - apply on enter/blur
     */
    const handleInputChange = (value: string | undefined) => {
        const key = config.filterKey as string;
        onChangeFilter({ [key]: value });
    };

    /**
     * Handle clear for this specific category
     */
    const handleClear = () => {
        if (config.type === 'dateRange') {
            const [startKey, endKey] = config.filterKey as [string, string];
            onChangeFilter({
                [startKey]: undefined,
                [endKey]: undefined,
            });
        } else {
            const key = config.filterKey as string;
            onChangeFilter({ [key]: undefined });
        }
    };

    /**
     * Check if this filter has active values
     */
    const hasActiveValues = (): boolean => {
        if (config.type === 'dateRange') {
            const [startKey, endKey] = config.filterKey as [string, string];
            return !!(dataFilter[startKey] || dataFilter[endKey]);
        }
        const key = config.filterKey as string;
        return !!dataFilter[key];
    };

    return (
        <div className="flex h-full w-[450px] flex-col">
            {/* Header */}
            <div className="flex h-11 items-center justify-between border-b border-gray-100 px-4 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                    {config.icon && (
                        <span className="text-base text-gray-500 dark:text-gray-300">
                            {config.icon}
                        </span>
                    )}
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                        {config.label}
                    </h3>
                </div>
                {hasActiveValues() && (
                    <button
                        onClick={handleClear}
                        className="text-xs text-blue-500 hover:text-blue-700"
                    >
                        {messages('common.delete')}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden px-4 py-2">
                {config.type === 'checkbox' && (
                    <CheckboxFilterContent
                        options={config.options || []}
                        selectedValues={getCheckboxValues()}
                        onChange={handleCheckboxChange}
                        loading={config.loading}
                        placeholder={config.placeholder}
                        onSearch={config.onSearch}
                    />
                )}

                {config.type === 'dateRange' &&
                    (() => {
                        const [startKey, endKey] = config.filterKey as [
                            string,
                            string,
                        ];
                        return (
                            <DateRangeFilterContent
                                startDate={dataFilter[startKey]}
                                endDate={dataFilter[endKey]}
                                onChange={handleDateRangeChange}
                            />
                        );
                    })()}

                {config.type === 'input' && (
                    <InputFilterContent
                        value={dataFilter[config.filterKey as string]}
                        onChange={handleInputChange}
                        placeholder={config.placeholder}
                    />
                )}
            </div>
        </div>
    );
}
