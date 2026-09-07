'use client';

import { toNonAccentVietnamese } from '@/helpers/string';
import {
    ArrowLeftOutlined,
    CloseOutlined,
    RightOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Badge, Button, Drawer, Grid, Input, List, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import FilterCategoryContent from './filter-category-content';
import { FilterConfig } from './types';

export type MobileFilterDrawerProps = {
    open: boolean;
    onClose: () => void;
    configs: FilterConfig[];
    dataFilter: Record<string, any>;
    onChangeFilter: (newValue: Record<string, any>) => void;
    removeFilter: () => void;
    canClearFilter: boolean;
    getActiveCount: (config: FilterConfig) => number;
    totalActiveCount: number;
    handleRemoveFilter: (config: FilterConfig) => void;
    selectedCategoryKey: string | null;
    onSelectCategory: (key: string | null) => void;
};

const { useBreakpoint } = Grid;

export default function MobileFilterDrawer({
    open,
    onClose,
    configs,
    dataFilter,
    onChangeFilter,
    removeFilter,
    canClearFilter,
    getActiveCount,
    totalActiveCount,
    handleRemoveFilter,
    selectedCategoryKey,
    onSelectCategory,
}: MobileFilterDrawerProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const [searchKeyword, setSearchKeyword] = useState('');

    const filteredConfigs = useMemo(() => {
        if (!searchKeyword.trim()) return configs;
        const normalizedKeyword = toNonAccentVietnamese(
            searchKeyword.trim()
        ).toLowerCase();
        return configs.filter((cfg) =>
            toNonAccentVietnamese(cfg.label)
                .toLowerCase()
                .includes(normalizedKeyword)
        );
    }, [configs, searchKeyword]);

    const activeConfig = useMemo(
        () => configs.find((cfg) => cfg.key === selectedCategoryKey),
        [configs, selectedCategoryKey]
    );

    const hasActiveValuesForConfig = (config: FilterConfig): boolean => {
        return getActiveCount(config) > 0;
    };

    const handleCloseDrawer = () => {
        onClose();
        onSelectCategory(null);
    };

    return (
        <Drawer
            open={open}
            onClose={handleCloseDrawer}
            placement="right"
            width={screens.md ? 420 : '100%'}
            styles={{
                header: {
                    padding: '12px 16px',
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                },
                body: {
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: token.colorBgContainer,
                },
                footer: {
                    padding: '12px 16px',
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                },
            }}
            closeIcon={null}
            title={
                selectedCategoryKey && activeConfig ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                type="text"
                                size="small"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => onSelectCategory(null)}
                            />
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {activeConfig.label}
                            </Typography.Title>
                        </div>
                        {hasActiveValuesForConfig(activeConfig) && (
                            <Button
                                type="link"
                                danger
                                size="small"
                                onClick={() => handleRemoveFilter(activeConfig)}
                            >
                                {messages('common.delete')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {messages('common.filter')}
                            </Typography.Title>
                            {totalActiveCount > 0 && (
                                <Badge
                                    count={totalActiveCount}
                                    color="#1677ff"
                                    size="small"
                                />
                            )}
                        </div>
                        <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCloseDrawer}
                        />
                    </div>
                )
            }
            footer={
                selectedCategoryKey ? (
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            onClick={() => onSelectCategory(null)}
                            className="flex-1"
                        >
                            {messages('common.back')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => onSelectCategory(null)}
                            className="flex-1"
                        >
                            {messages('common.save')}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-3">
                        {canClearFilter ? (
                            <Button
                                danger
                                onClick={() => {
                                    removeFilter();
                                    handleCloseDrawer();
                                }}
                                className="flex-1"
                            >
                                {messages('common.clearFilter')}
                            </Button>
                        ) : null}
                        <Button
                            type="primary"
                            onClick={handleCloseDrawer}
                            className="flex-1"
                        >
                            {messages('common.apply')}
                        </Button>
                    </div>
                )
            }
        >
            {selectedCategoryKey && activeConfig ? (
                /* Màn hình 2: Chọn chi tiết tiêu chí */
                <div className="flex-1 overflow-y-auto p-4">
                    <FilterCategoryContent
                        config={activeConfig}
                        dataFilter={dataFilter}
                        onChangeFilter={onChangeFilter}
                    />
                </div>
            ) : (
                /* Màn hình 1: Danh sách các danh mục */
                <div className="flex h-full flex-col">
                    <div className="border-b p-3" style={{ borderColor: token.colorBorderSecondary }}>
                        <Input
                            prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                            placeholder={messages('filter.searchFilter')}
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            allowClear
                            variant="filled"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <List
                            dataSource={filteredConfigs}
                            renderItem={(config) => {
                                const count = getActiveCount(config);
                                return (
                                    <List.Item
                                        onClick={() => onSelectCategory(config.key)}
                                        className="cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        style={{
                                            padding: '14px 16px',
                                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                        }}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {config.icon && (
                                                    <span className="text-lg">
                                                        {config.icon}
                                                    </span>
                                                )}
                                                <Typography.Text strong={count > 0}>
                                                    {config.label}
                                                </Typography.Text>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {count > 0 && (
                                                    <Badge
                                                        count={count}
                                                        size="small"
                                                        color="#1677ff"
                                                    />
                                                )}
                                                <RightOutlined
                                                    style={{
                                                        fontSize: 12,
                                                        color: token.colorTextSecondary,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </Drawer>
    );
}
