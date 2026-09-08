'use client';

import { cn } from '@/helpers/common';
import { Badge, Button, Grid, Popover, theme, Typography } from 'antd';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import ActiveFilterTags from './active-filter-tags';
import FilterCategoryContent from './filter-category-content';
import FilterCategoryList from './filter-category-list';
import MobileFilterDrawer from './mobile-filter-drawer';
import { FilterConfig, FilterPanelProps } from './types';

const { useBreakpoint } = Grid;

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
    const screens = useBreakpoint();
    // Áp dụng chế độ tinh gọn Drawer cho màn hình nhỏ và tablet (< 992px)
    const isMobileOrTablet = screens.lg === false;
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(
        configs[0]?.key || null
    );
    const [mobileSelectedCategory, setMobileSelectedCategory] = useState<
        string | null
    >(null);

    /**
     * Count active filter values for a given config
     */
    const getActiveCount = useCallback(
        (config: FilterConfig): number => {
            if (config.type === 'custom') {
                return (
                    config.customFilterKeys?.filter((key) => !!dataFilter[key])
                        .length ?? 0
                );
            }
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
            if (config.type === 'custom') {
                const nextValue = config.customFilterKeys?.reduce(
                    (result, key) => ({
                        ...result,
                        [key]: undefined,
                    }),
                    {}
                );
                onChangeFilter(nextValue as Partial<TFilter>);
                return;
            }
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
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 dark:border-zinc-700">
            {canClearFilter ? (
                <Button
                    type="link"
                    danger
                    size="small"
                    onClick={() => {
                        removeFilter();
                        setOpen(false);
                    }}
                    className="!p-0 !text-xs"
                >
                    {messages('common.clearFilter')}
                </Button>
            ) : (
                <div />
            )}
            <Typography.Text type="secondary" className="text-xs font-medium">
                {messages('filter.activeFilterCount', {
                    count: totalActiveCount,
                })}
            </Typography.Text>
        </div>
    );

    const filterButton = (
        <Badge
            count={totalActiveCount}
            size="small"
            offset={[-2, 2]}
            color="#1677ff"
        >
            <Button onClick={isMobileOrTablet ? () => setOpen(true) : undefined}>
                <Filter size={14} />
                <span className="font-medium">
                    {messages('common.filter')}
                </span>
            </Button>
        </Badge>
    );

    return (
        <div
            className={cn('flex flex-wrap items-center gap-2', className)}
            style={{
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadius,
            }}
        >
            {/* Filter trigger button */}
            {isMobileOrTablet ? (
                <>
                    {filterButton}
                    <MobileFilterDrawer
                        open={open}
                        onClose={() => {
                            setOpen(false);
                            setMobileSelectedCategory(null);
                        }}
                        configs={configs}
                        dataFilter={dataFilter}
                        onChangeFilter={(newValue) =>
                            onChangeFilter(newValue as Partial<TFilter>)
                        }
                        removeFilter={removeFilter}
                        canClearFilter={canClearFilter}
                        getActiveCount={getActiveCount}
                        totalActiveCount={totalActiveCount}
                        handleRemoveFilter={handleRemoveFilter}
                        selectedCategoryKey={mobileSelectedCategory}
                        onSelectCategory={setMobileSelectedCategory}
                    />
                </>
            ) : (
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                    trigger="click"
                    placement={placement}
                    arrow={false}
                    autoAdjustOverflow={false}
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
                    {filterButton}
                </Popover>
            )}

            {/* Active filter tags (chỉ hiển thị trên desktop >= 992px) */}
            {!isMobileOrTablet && (
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
            )}
        </div>
    );
}
