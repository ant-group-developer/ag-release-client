'use client';

import AppSearch from '@/components/ui/input/search';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import { CommonParams } from '@/types/api';
import { ConfigProvider, Select, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { ChangeEventHandler, useMemo } from 'react';
interface NewsFiltersProps {
    dataFilter: CommonParams;
    onChangeFilter: OnChangeFilter<any>;
    onSearch: ChangeEventHandler<HTMLInputElement>;
}

export default function NewsFilters({
    dataFilter,
    onChangeFilter,
    onSearch,
}: NewsFiltersProps) {
    const messages = useTranslations();
    const locale = useLocale();

    // Fetch categories internally, mirroring other header filters in the codebase
    const { newsCategoryData } = useGetListNewsCategory({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        page: 1,
    });

    const categoryOptions = useMemo(() => {
        const items = newsCategoryData?.items ?? [];
        return items.map((item) => ({
            label: getNameByLocale(item.nameEn, item.nameVi, locale),
            value: item.id,
        }));
    }, [newsCategoryData?.items, locale]);

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#71717a',
                    colorBgContainer: '#18181b',
                    colorBorder: '#27272a',
                },
            }}
        >
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 sm:flex-row">
                <AppSearch
                    placeholder={messages('common.search')}
                    defaultValue={dataFilter.keyword}
                    onChange={onSearch}
                    wrapperClassName="w-full sm:max-w-[320px]"
                    size="large"
                />
                <Select
                    placeholder={messages('placeholder.select', {
                        value: messages('common.category').toLowerCase(),
                    })}
                    onChange={(value) => {
                        onChangeFilter({ newsCategoryId: value || undefined });
                    }}
                    options={categoryOptions}
                    allowClear
                    size="large"
                    className="w-full sm:max-w-[260px]"
                    popupClassName="!bg-zinc-900 !text-white [&_.ant-select-item-option]:!text-zinc-300 [&_.ant-select-item-option-active]:!text-white [&_.ant-select-item-option-selected]:!text-white"
                />
            </div>
        </ConfigProvider>
    );
}
