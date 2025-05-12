import IsActiveDialog from '@/components/shared/is-active-dialog';
import SearchDialog from '@/components/shared/search-dialog';
import IconButton from '@/components/ui/button/icon-button';
import { TYPE_FILTER } from '@/enums/common';
import { RemoveFilter } from '@/hooks/use-filter';
import { Tooltip } from 'antd';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { DataFilterTopic } from '../../types';
import { TopicHeaderDropdown } from '../dropdown/topic-header-dropdown';

type Props = {
    onChangeFilter: (value?: any) => void;
    dataFilter: DataFilterTopic;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function TopicSuperFilter({
    onChangeFilter,
    dataFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();
    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();

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

            <SearchDialog
                title={messages('form.searchPlaceholder')}
                open={typeFilter === TYPE_FILTER.KEYWORD}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <IsActiveDialog
                title={messages('status.active')}
                open={typeFilter === TYPE_FILTER.IS_ACTIVE}
                handleChangeTypeFilter={handleChangeTypeFilter}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <div className="grow">
                <TopicHeaderDropdown
                    open={typeFilter === TYPE_FILTER.DROPDOWN}
                    onChangeFilter={onChangeFilter}
                    dataFilter={dataFilter}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                />
            </div>
            {canClearFilter && (
                <Tooltip title={messages('common.removeFilter')}>
                    <IconButton
                        className="clear-filter-btn"
                        onClick={removeFilter}
                    >
                        <X />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    );
}
