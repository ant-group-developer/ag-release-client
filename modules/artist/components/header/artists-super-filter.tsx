import SearchArtistIdDialog from '@/components/filter-dialog/artist-id-dialog';
import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateUpdateDialog from '@/components/filter-dialog/date-update-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ArtistDataFilter } from '../../types';
import ArtistsHeaderDropdown from '../dropdown/artists-header-dropdown';

type Props = {
    dataFilter: ArtistDataFilter;
    onChangeFilter: OnChangeFilter<ArtistDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function ArtistsSuperFilter({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();

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
        // <div className="flex grow items-center gap-1">
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

                <SearchArtistIdDialog
                    title={messages('artist.id')}
                    open={typeFilter === TYPE_FILTER.ID}
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
                    <ArtistsHeaderDropdown
                        open={typeFilter === TYPE_FILTER.DROPDOWN}
                        dataFilter={dataFilter}
                        onChangeFilter={onChangeFilter}
                        handleChangeTypeFilter={handleChangeTypeFilter}
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
