'use client';

import { cn } from '@/helpers/common';
import { Badge, Button, Popover, theme } from 'antd';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import ActiveFilterTags from './active-filter-tags';
import FilterCategoryContent from './filter-category-content';
import FilterCategoryList from './filter-category-list';
import { FilterConfig, FilterPanelProps } from './types';

export default function FilterPanel<TFilter extends Record<string, any>>({
    configs,
    dataFilter,
    defaultFilter,
    onChangeFilter,
    removeFilter,
    canClearFilter,
    className,
    placement = 'bottomLeft',
    popoverHeight = 450,
}: FilterPanelProps<TFilter>) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(
        configs[0]?.key || null
    );

    /**
     * Count active filter values for a given config
     */
    const getActiveCount = useCallback(
        (config: FilterConfig): number => {
            if (config.type === 'dateRange') {
                const [startKey, endKey] = config.filterKey as [string, string];
                return dataFilter[startKey] && dataFilter[endKey] ? 1 : 0;
            }
            const key = config.filterKey as string;
            const raw = dataFilter[key];
            if (!raw) return 0;
            if (config.type === 'checkbox') {
                if (config.isCommaSeparated && typeof raw === 'string') {
                    return raw.split(',').filter(Boolean).length;
                }
                if (Array.isArray(raw)) return raw.length;
            }
            return 1;
        },
        [dataFilter]
    );

    /**
     * Total active filter count across all configs
     */
    const totalActiveCount = useMemo(
        () => configs.reduce((sum, cfg) => sum + getActiveCount(cfg), 0),
        [configs, getActiveCount]
    );

    /**
     * Remove a specific filter category
     */
    const handleRemoveFilter = useCallback(
        (config: FilterConfig) => {
            if (config.type === 'dateRange') {
                const [startKey, endKey] = config.filterKey as [string, string];
                onChangeFilter({
                    [startKey]: undefined,
                    [endKey]: undefined,
                } as Partial<TFilter>);
            } else {
                const key = config.filterKey as string;
                onChangeFilter({ [key]: undefined } as Partial<TFilter>);
            }
        },
        [onChangeFilter]
    );

    /**
     * Get the active config object
     */
    const activeCategoryConfig = useMemo(
        () => configs.find((cfg) => cfg.key === activeCategory),
        [configs, activeCategory]
    );

    const popoverContent = (
        <div className="flex" style={{ height: popoverHeight }}>
            {/* Left sidebar */}
            <FilterCategoryList
                configs={configs}
                activeKey={activeCategory}
                onSelect={setActiveCategory}
                getActiveCount={getActiveCount}
            />

            {/* Right content */}
            {activeCategoryConfig && (
                <FilterCategoryContent
                    config={activeCategoryConfig}
                    dataFilter={dataFilter}
                    onChangeFilter={(newValue) =>
                        onChangeFilter(newValue as Partial<TFilter>)
                    }
                />
            )}
        </div>
    );

    const popoverFooter = totalActiveCount > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
            {canClearFilter ? (
                <button
                    onClick={() => {
                        removeFilter();
                        setOpen(false);
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                    {messages('common.clearFilter')}
                </button>
            ) : (
                <div />
            )}
            <div className="text-xs font-medium text-blue-500">
                {messages('filter.activeFilterCount', {
                    count: totalActiveCount,
                })}
            </div>
        </div>
    );

    return (
        <div
            className={cn('flex items-center gap-3', className)}
            style={{
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadius,
                // padding: '8px 12px',
            }}
        >
            {/* Filter trigger button */}
            <Popover
                open={open}
                onOpenChange={setOpen}
                trigger="click"
                placement={placement}
                arrow={false}
                autoAdjustOverflow={false}
                // overlayInnerStyle={{ padding: 0, overflow: 'hidden' }}
                styles={{
                    body: {
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
                content={
                    <div>
                        {popoverContent}
                        {popoverFooter}
                    </div>
                }
            >
                <Badge
                    count={totalActiveCount}
                    size="small"
                    offset={[-2, 2]}
                    color="#1677ff"
                >
                    <Button>
                        <Filter size={14} />
                        <span className="font-medium">
                            {messages('common.filter')}
                        </span>
                    </Button>
                </Badge>
            </Popover>

            {/* Active filter tags */}
            <ActiveFilterTags
                configs={configs}
                dataFilter={dataFilter}
                defaultFilter={defaultFilter}
                canClearFilter={canClearFilter}
                onRemoveFilter={handleRemoveFilter}
                onRemoveAll={removeFilter}
                onClickTag={(key) => {
                    setActiveCategory(key);
                    setOpen(true);
                }}
            />
        </div>
    );
}
