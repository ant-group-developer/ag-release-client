'use client';

import { toNonAccentVietnamese } from '@/helpers/string';
import { Checkbox, Empty, Input } from 'antd';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterOption } from '../types';

type Props = {
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    loading?: boolean;
    placeholder?: string;
    onSearch?: (keyword: string) => void;
};

export default function CheckboxFilterContent({
    options,
    selectedValues: externalValues,
    onChange,
    loading = false,
    placeholder,
    onSearch,
}: Props) {
    const messages = useTranslations();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [internalValues, setInternalValues] =
        useState<string[]>(externalValues);

    // Debounce search
    const debouncedSearch = useCallback(
        debounce((keyword: string) => {
            onSearch?.(keyword);
        }, 500),
        [onSearch]
    );

    // Xử lý khi gõ tìm kiếm
    const handleSearchChange = (val: string) => {
        setSearchKeyword(val);
        if (onSearch) {
            debouncedSearch(val);
        }
    };

    // Đồng bộ ngược lại nếu externalValues thay đổi
    useEffect(() => {
        setInternalValues(externalValues);
    }, [JSON.stringify(externalValues)]);

    const filteredOptions = useMemo(() => {
        // Nếu có onSearch thì coi như Options đã được lọc từ Server/Parent
        if (onSearch || !searchKeyword.trim()) return options;

        const normalizedKeyword = toNonAccentVietnamese(
            searchKeyword.trim()
        ).toLowerCase();
        return options.filter((opt) =>
            toNonAccentVietnamese(opt.label)
                .toLowerCase()
                .includes(normalizedKeyword)
        );
    }, [options, searchKeyword, onSearch]);

    const handleCheckboxChange = (checkedValues: string[]) => {
        // Cập nhật local state ngay lập tức để UI mượt mà
        setInternalValues(checkedValues);
        // Sau đó mới đẩy lên URL
        onChange(checkedValues);
    };

    return (
        <div className="flex h-full flex-col gap-2">
            {/* Search input inside options */}
            <Input
                prefix={<Search size={14} className="text-gray-400" />}
                placeholder={placeholder || messages('common.search')}
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                allowClear
                size="small"
                className="mb-1"
            />

            {/* Checkbox list */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="text-gray-400">Loading...</div>
                    </div>
                ) : filteredOptions.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={messages('common.noDataAvailable')}
                    />
                ) : (
                    <Checkbox.Group
                        value={internalValues}
                        onChange={(vals) =>
                            handleCheckboxChange(vals as string[])
                        }
                        className="flex w-full flex-col gap-0.5"
                    >
                        {filteredOptions.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex cursor-pointer items-center rounded-md px-1 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700"
                            >
                                <Checkbox value={opt.value}>
                                    {opt.label}
                                </Checkbox>
                            </label>
                        ))}
                    </Checkbox.Group>
                )}
            </div>
        </div>
    );
}
