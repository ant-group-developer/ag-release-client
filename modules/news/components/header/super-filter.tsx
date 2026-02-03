import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateUpdateDialog from '@/components/filter-dialog/date-update-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import { PopoverFilterDropdown } from '@/components/filter/popover-dropdown';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import { ListFilter, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { NEWS_STATUS } from '../../enums';
import { NewsDataFilter } from '../../types';
import SearchKeywordsDialog from './search-keywords-dialog';

type Props = {
    dataFilter: NewsDataFilter;
    onChangeFilter: OnChangeFilter<NewsDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function NewsSuperFilter({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();
    const [inputValue, setInputValue] = useState<string>('');

    const handleChangeTypeFilter = (value?: TYPE_FILTER) => {
        setTypeFilter(value);
    };

    const dropdownItems = [
        {
            label: messages('form.searchPlaceholder'),
            visible: !dataFilter.keyword,
            onClick: () => setTypeFilter(TYPE_FILTER.KEYWORD),
        },
        {
            label: messages('common.status'),
            visible: !dataFilter.status,
            onClick: () => setTypeFilter(TYPE_FILTER.STATUS),
        },
        {
            label: messages('common.keyword'),
            visible: !dataFilter.keywords,
            onClick: () => setTypeFilter(TYPE_FILTER.KEYWORDS),
        },
        {
            label: messages('newsCategory.label'),
            visible: !dataFilter.newsCategoryId,
            onClick: () => setTypeFilter(TYPE_FILTER.NEWS_CATEGORY),
        },
        {
            label: messages('common.createdAt'),
            value: TYPE_FILTER.DATE_CREATED,
            visible: !dataFilter.startCreatedAt && !dataFilter.endCreatedAt,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
        },
        {
            label: messages('common.updatedAt'),
            value: TYPE_FILTER.DATE_UPDATED,
            visible: !dataFilter.startUpdatedAt && !dataFilter.endUpdatedAt,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_UPDATED),
        },
    ];

    const locale = useLocale();
    const { newsCategoryData } = useGetListNewsCategory(
        {
            pageSize: PAGE_SIZE_EXTRA_LARGE,
        },
        { enabled: typeFilter === TYPE_FILTER.NEWS_CATEGORY }
    );

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const isClickOnClearButton =
                event.target.closest('.clear-filter-btn') !== null;

            if (ref.current?.contains(event.target)) {
                if (isClickOnClearButton) {
                    return;
                }

                const chipList = document.getElementsByClassName('chip-filter');
                if (
                    !typeFilter &&
                    !Array.from(chipList).some((chip) =>
                        chip.contains(event.target)
                    )
                ) {
                    setTypeFilter(TYPE_FILTER.DROPDOWN);
                }
            } else {
                setTypeFilter(undefined);
            }
        };
        window.addEventListener('mousedown', handleOutSideClick);
        return () => {
            window.removeEventListener('mousedown', handleOutSideClick);
        };
    }, [ref, typeFilter]);

    return (
        // <div className="flex grow items-center gap-1">
        <div ref={ref} className="relative flex w-full">
            <button
                className="h-10 px-2 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <CustomTooltip title={messages('common.filter')}>
                    <ListFilter />
                </CustomTooltip>
            </button>

            <div className="flex flex-1 flex-wrap items-center gap-1">
                <SearchDialog
                    title={messages('form.searchPlaceholder')}
                    open={typeFilter === TYPE_FILTER.KEYWORD}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.STATUS}
                    title={messages('common.status')}
                    options={[
                        {
                            name: messages('common.public'),
                            value: NEWS_STATUS.PUBLIC,
                        },
                        {
                            name: messages('common.private'),
                            value: NEWS_STATUS.PRIVATE,
                        },
                    ]}
                    selectedValues={arrayFromString(dataFilter.status)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.STATUS : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            status: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ status: undefined })}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.NEWS_CATEGORY}
                    title={messages('newsCategory.label')}
                    options={newsCategoryData?.items?.map((item) => ({
                        name: getNameByLocale(
                            item?.nameEn,
                            item?.nameVi,
                            locale
                        ),
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.newsCategoryId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.NEWS_CATEGORY : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            newsCategoryId: arrayToString(vals),
                        });
                    }}
                    onRemove={() =>
                        onChangeFilter({ newsCategoryId: undefined })
                    }
                />

                <SearchKeywordsDialog
                    title={messages('common.keyword')}
                    open={typeFilter === TYPE_FILTER.KEYWORDS}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <DateCreatedDialog
                    open={typeFilter === TYPE_FILTER.DATE_CREATED}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    title={messages('common.createdAt')}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <DateUpdateDialog
                    open={typeFilter === TYPE_FILTER.DATE_UPDATED}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    title={messages('common.updatedAt')}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <div className="grow">
                    <PopoverFilterDropdown
                        open={typeFilter === TYPE_FILTER.DROPDOWN}
                        title={messages('common.filter')}
                        options={dropdownItems}
                        value={inputValue}
                        onInputChange={setInputValue}
                        onSearch={() => onChangeFilter({ keyword: inputValue })}
                        onOpenChange={() => setTypeFilter(undefined)}
                        placeholder={messages('common.filter')}
                    />
                </div>
            </div>
            {canClearFilter && (
                <div className="flex items-center">
                    <CustomTooltip title={messages('common.removeFilter')}>
                        <IconButton
                            className="clear-filter-btn"
                            onClick={removeFilter}
                        >
                            <X size={SIZE_ICON} />
                        </IconButton>
                    </CustomTooltip>
                </div>
            )}
        </div>
        // </div>
    );
}
