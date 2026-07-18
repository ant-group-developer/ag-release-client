import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import {
    BarsOutlined,
    CalendarOutlined,
    FolderOpenOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { NEWS_STATUS } from '../../enums';
import { useGetListKeywords } from '../../hooks/use-get-keywords';
import { NewsDataFilter } from '../../types';

type Props = {
    dataFilter: NewsDataFilter;
    defaultFilter?: NewsDataFilter;
    onChangeFilter: OnChangeFilter<NewsDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export const NewsHeaderV2 = ({
    dataFilter,
    defaultFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) => {
    const messages = useTranslations();
    const locale = useLocale();

    const { newsCategoryData } = useGetListNewsCategory({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const { keywordsData } = useGetListKeywords();

    const categoryOptions = useMemo(
        () =>
            newsCategoryData?.items?.map((item) => ({
                label: getNameByLocale(item?.nameEn, item?.nameVi, locale),
                value: item.id,
            })) || [],
        [newsCategoryData, locale]
    );

    const statusOptions = useMemo(
        () => [
            {
                label: messages('common.public'),
                value: NEWS_STATUS.PUBLIC,
            },
            {
                label: messages('common.private'),
                value: NEWS_STATUS.PRIVATE,
            },
        ],
        [messages]
    );

    const keywordOptions = useMemo(
        () =>
            keywordsData?.map((item) => ({
                label: item,
                value: item,
            })) || [],
        [keywordsData]
    );

    const filterConfigs: FilterConfig[] = useMemo(() => {
        return [
            {
                key: 'newsCategoryId',
                label: messages('newsCategory.label'),
                icon: <FolderOpenOutlined />,
                type: 'checkbox',
                filterKey: 'newsCategoryId',
                options: categoryOptions,
                isCommaSeparated: true,
            },
            {
                key: 'status',
                label: messages('common.status'),
                icon: <BarsOutlined />,
                type: 'checkbox',
                filterKey: 'status',
                options: statusOptions,
                isCommaSeparated: true,
            },
            {
                key: 'keywords',
                label: messages('common.keyword'),
                icon: <TagOutlined />,
                type: 'checkbox',
                filterKey: 'keywords',
                options: keywordOptions,
                isCommaSeparated: true,
            },
            {
                key: 'dateCreated',
                label: messages('common.dateCreated'),
                icon: <CalendarOutlined />,
                type: 'dateRange',
                filterKey: ['startCreatedAt', 'endCreatedAt'],
            },
            {
                key: 'dateUpdated',
                label: messages('common.dateUpdated'),
                icon: <CalendarOutlined />,
                type: 'dateRange',
                filterKey: ['startCreatedAt', 'endCreatedAt'],
            },
        ];
    }, [messages, categoryOptions, statusOptions, keywordOptions]);

    return (
        <div className="app-header">
            <Space>
                <AppSearch
                    defaultValue={dataFilter?.keyword}
                    style={{
                        width: 200,
                    }}
                    onChange={(e) =>
                        onChangeFilter({ keyword: e.target.value })
                    }
                />
                <FilterPanel
                    configs={filterConfigs}
                    dataFilter={dataFilter}
                    defaultFilter={defaultFilter}
                    onChangeFilter={onChangeFilter}
                    removeFilter={removeFilter}
                    canClearFilter={canClearFilter}
                />
            </Space>
        </div>
    );
};
