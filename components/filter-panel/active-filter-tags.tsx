'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Button, Tag, Typography } from 'antd';
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
            if (config.type === 'custom') {
                const hasActive =
                    config.customFilterKeys?.some((key) => !!dataFilter[key]) ??
                    false;
                if (!hasActive) continue;

                active.push({
                    config,
                    displayValue:
                        config.getDisplayValue?.(dataFilter) ??
                        messages('filter.activeFilterCount', {
                            count:
                                config.customFilterKeys?.filter(
                                    (key) => !!dataFilter[key]
                                ).length ?? 0,
                        }),
                    isDefault: false,
                });
                continue;
            }
            if (config.type === 'dateRange') {
                const [startKey, endKey] = config.filterKey as [string, string];
                const startVal = dataFilter[startKey];
                const endVal = dataFilter[endKey];
                if (startVal && endVal) {
                    const isDefault =
                        defaultFilter &&
                        String(dataFilter[startKey]) ===
                            String(defaultFilter[startKey]) &&
                        String(dataFilter[endKey]) ===
                            String(defaultFilter[endKey]);
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

                if (
                    (config.type === 'checkbox' || config.type === 'radio') &&
                    config.options
                ) {
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

                const isDefault =
                    defaultFilter && String(raw) === String(defaultFilter[key]);
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
        <div className="flex w-full flex-wrap items-center gap-1.5 md:w-auto">
            <Typography.Text type="secondary" className="mr-1 text-xs">
                {messages('filter.filterBy')}:
            </Typography.Text>
            {activeFilters.map(({ config, displayValue, isDefault }) => (
                <Tag
                    key={config.key}
                    closable={!isDefault}
                    onClose={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveFilter(config);
                    }}
                    className="m-0 max-w-[200px] cursor-pointer transition-colors hover:border-blue-300 sm:max-w-[300px]"
                    onClick={() => onClickTag?.(config.key)}
                >
                    <span
                        className="inline-block max-w-[150px] truncate align-middle sm:max-w-[240px]"
                        title={`${config.label}: ${displayValue}`}
                    >
                        <span className="font-medium">{config.label}</span>:{' '}
                        {displayValue}
                    </span>
                </Tag>
            ))}
            {canClearFilter && (
                <Button
                    type="link"
                    danger
                    size="small"
                    onClick={onRemoveAll}
                    className="!p-0 !text-xs"
                >
                    {messages('common.clearFilter')}
                </Button>
            )}
        </div>
    );
}
