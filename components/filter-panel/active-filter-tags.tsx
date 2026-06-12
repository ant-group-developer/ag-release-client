'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { FilterConfig } from './types';

type ActiveFilter = {
    config: FilterConfig;
    displayValue: string;
    isDefault: boolean;
};

type Props = {
    configs: FilterConfig[];
    dataFilter: Record<string, any>;
    defaultFilter?: Record<string, any>;
    canClearFilter?: boolean;
    onRemoveFilter: (config: FilterConfig) => void;
    onRemoveAll: () => void;
    onClickTag?: (key: string) => void;
};

export default function ActiveFilterTags({
    configs,
    dataFilter,
    defaultFilter,
    canClearFilter = false,
    onRemoveFilter,
    onRemoveAll,
    onClickTag,
}: Props) {
    const messages = useTranslations();

    /**
     * Build list of active filters with their display values
     */
    const getActiveFilters = (): ActiveFilter[] => {
        const active: ActiveFilter[] = [];

        for (const config of configs) {
            if (config.type === 'dateRange') {
                const [startKey, endKey] = config.filterKey as [string, string];
                const startVal = dataFilter[startKey];
                const endVal = dataFilter[endKey];
                if (startVal && endVal) {
                    const isDefault = defaultFilter &&
                        String(dataFilter[startKey]) === String(defaultFilter[startKey]) &&
                        String(dataFilter[endKey]) === String(defaultFilter[endKey]);
                    active.push({
                        config,
                        displayValue: `${formattedDate(startVal, DATE_FORMAT.DATE_ONLY)} - ${formattedDate(endVal, DATE_FORMAT.DATE_ONLY)}`,
                        isDefault: !!isDefault,
                    });
                }
            } else {
                const key = config.filterKey as string;
                const raw = dataFilter[key];
                if (!raw) continue;

                let displayValue: string;

                if (config.type === 'checkbox' && config.options) {
                    // Resolve checkbox labels
                    const values = config.isCommaSeparated
                        ? String(raw).split(',')
                        : Array.isArray(raw)
                            ? raw
                            : [raw];
                    const labels = values
                        .map(
                            (v: string) =>
                                config.options?.find((o) => o.value === v)
                                    ?.label || v
                        )
                        .filter(Boolean);
                    displayValue = labels.join(' | ');
                } else {
                    displayValue = String(raw);
                }

                const isDefault = defaultFilter && String(raw) === String(defaultFilter[key]);
                active.push({
                    config,
                    displayValue,
                    isDefault: !!isDefault,
                });
            }
        }

        return active;
    };

    const activeFilters = getActiveFilters();

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-1 flex-wrap items-center gap-1">
            <span className="mr-1 text-xs text-gray-500">
                {messages('filter.filterBy')}:
            </span>
            {activeFilters.map(({ config, displayValue, isDefault }) => (
                <Tag
                    key={config.key}
                    closable={!isDefault}
                    onClose={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveFilter(config);
                    }}
                    className="m-0 max-w-[300px] cursor-pointer transition-colors hover:border-blue-300"
                    onClick={() => onClickTag?.(config.key)}
                >
                    <span
                        className="inline-block max-w-[250px] align-middle truncate"
                        title={`${config.label}: ${displayValue}`}
                    >
                        <span className="font-medium">{config.label}</span>:{' '}
                        {displayValue}
                    </span>
                </Tag>
            ))}
            {canClearFilter && (
                <button
                    onClick={onRemoveAll}
                    className="ml-1 text-xs text-red-500 hover:text-red-700"
                >
                    {messages('common.clearFilter')}
                </button>
            )}
        </div>
    );
}
