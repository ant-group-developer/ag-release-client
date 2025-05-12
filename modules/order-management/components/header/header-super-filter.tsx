import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateDeadlineDialog from '@/components/filter-dialog/date-deadline-dialog';
import ProductTypeDialog from '@/components/filter-dialog/product-type-dialog';
import StatusDialog from '@/components/filter-dialog/status-dialog';
import TopicDialog from '@/components/filter-dialog/topic-dialog';
import SearchDialog from '@/components/shared/search-dialog';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { OnChangeFilter, RemoveFilter, TOnSearch } from '@/hooks/use-filter';
import { Tooltip } from 'antd';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { FilterOrderManagement } from '../../types';
import HeaderDropDown from './header-dropdown';

type Props = {
    dataFilter: FilterOrderManagement;
    onChangeFilter: OnChangeFilter<FilterOrderManagement>;
    onSearch: TOnSearch;
    removeFilter: RemoveFilter;
    canClearFilter: boolean;
};

export default function OrderManagementSuperFilter({
    dataFilter,
    onChangeFilter,
    onSearch,
    removeFilter,
    canClearFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();
    const messages = useTranslations();

    const handleChangeTypeFilter = (value?: TYPE_FILTER) =>
        setTypeFilter(value);

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
        <div ref={ref} className="relative flex w-full items-center gap-1">
            <button
                className="h-10 px-2 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <ListFilter />
            </button>

            <DateDeadlineDialog
                title={messages('common.deadline')}
                showRemove={false}
                open={typeFilter === TYPE_FILTER.DEADLINE}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <SearchDialog
                title={messages('form.searchPlaceholder')}
                open={typeFilter === TYPE_FILTER.KEYWORD}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <TopicDialog
                title={messages('topic.label')}
                open={typeFilter === TYPE_FILTER.TOPIC}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <StatusDialog
                title={messages('common.status')}
                open={typeFilter === TYPE_FILTER.STATUS}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <ProductTypeDialog
                title={messages('common.type')}
                open={typeFilter === TYPE_FILTER.TYPE}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <DateCreatedDialog
                title={messages('common.dateCreated')}
                open={typeFilter === TYPE_FILTER.DATE_CREATED}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <div className="grow">
                <HeaderDropDown
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    open={typeFilter === TYPE_FILTER.DROPDOWN}
                />
            </div>

            {canClearFilter && (
                <Tooltip title={messages('common.removeFilter')}>
                    <IconButton
                        className="clear-filter-btn"
                        onClick={removeFilter}
                    >
                        <X size={SIZE_ICON} />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    );
}
