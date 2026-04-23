'use client';

import { toNonAccentVietnamese } from '@/helpers/string';
import { Badge, Input } from 'antd';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { FilterConfig } from './types';

type Props = {
    configs: FilterConfig[];
    activeKey: string | null;
    onSelect: (key: string) => void;
    getActiveCount: (config: FilterConfig) => number;
};

export default function FilterCategoryList({
    configs,
    activeKey,
    onSelect,
    getActiveCount,
}: Props) {
    const messages = useTranslations();
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

    return (
        <div className="flex h-full w-[250px] flex-shrink-0 flex-col border-r border-gray-100">
            {/* Search categories */}
            <div className="border-b border-gray-100 p-2">
                <Input
                    prefix={<Search size={14} className="text-gray-400" />}
                    placeholder={messages('filter.searchFilter')}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    allowClear
                    size="small"
                    variant="filled"
                />
            </div>

            {/* Category list */}
            <div className="flex-1 overflow-y-auto py-1">
                {filteredConfigs.map((config) => {
                    const isActive = activeKey === config.key;
                    const count = getActiveCount(config);

                    return (
                        <div
                            key={config.key}
                            onClick={() => onSelect(config.key)}
                            className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                isActive
                                    ? 'bg-blue-50 font-semibold text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {config.icon && (
                                <span className="flex-shrink-0 text-base">
                                    {config.icon}
                                </span>
                            )}
                            <span className="flex-1 truncate">
                                {config.label}
                            </span>
                            {count > 0 && (
                                <Badge
                                    count={count}
                                    size="small"
                                    color={isActive ? '#1677ff' : '#8c8c8c'}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
