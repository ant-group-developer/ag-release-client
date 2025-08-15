import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import { PopoverFilterDropdown } from '@/components/filter/popover-dropdown';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { RolesDataDataFilter } from '../../types';

type Props = {
    dataFilter: RolesDataDataFilter;
    onChangeFilter: OnChangeFilter<RolesDataDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function RolesSuperFilter({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();
    const [inputValue, setInputValue] = useState<string>('');

    const dropdownItems = [
        {
            label: messages('form.searchPlaceholder'),
            visible: !dataFilter.keyword,
            onClick: () => setTypeFilter(TYPE_FILTER.KEYWORD),
        },
        {
            label: messages('common.createdAt'),
            value: TYPE_FILTER.DATE_CREATED,
            visible: !dataFilter.startDateCreated && !dataFilter.endDateCreated,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
        },
    ];

    const handleChangeTypeFilter = (value?: TYPE_FILTER) => {
        setTypeFilter(value);
    };

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
        <div ref={ref} className="relative flex w-full">
            <button
                className="h-10 px-2 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <ListFilter />
            </button>

            <div className="flex flex-1 flex-wrap items-center gap-1">
                <SearchDialog
                    title={messages('form.searchPlaceholder')}
                    open={typeFilter === TYPE_FILTER.KEYWORD}
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
                {/* <DateUpdateDialog
                    open={typeFilter === TYPE_FILTER.DATE_UPDATED}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    title={messages('common.updatedAt')}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

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
    );
}
