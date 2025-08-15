import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateReleaseDialog from '@/components/filter-dialog/date-release-dialog';
import GenresDialog from '@/components/filter-dialog/genres-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import StatusReleaseDialog from '@/components/filter-dialog/status-releases-dialog';
import { PopoverRadioFilter } from '@/components/filter/popover-radio';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { useGetListReleaseTypes } from '@/modules/release-types/hooks/use-get-list-release-types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useGetListReleases } from '../../hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleasesHeaderDropdown from '../dropdown/releases-header-dropdown';

type Props = {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function ReleasesSuperFilter({
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

    const { artistsData } = useGetListArtist({ pageSize: 999 });

    const { releaseTypesData } = useGetListReleaseTypes({});

    const { releasesData } = useGetListReleases({ pageSize: 999 });

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

                <PopoverRadioFilter
                    open={typeFilter === TYPE_FILTER.ALBUM_FORMAT_ID}
                    title={messages('releases.type')}
                    options={releaseTypesData?.items?.map(
                        (item: ReleaseTypesData) => ({
                            name: item?.name,
                            value: item?.id,
                        })
                    )}
                    selectedValue={dataFilter?.albumFormatId}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.ALBUM_FORMAT_ID : undefined
                        );
                    }}
                    onConfirm={(val) => {
                        return onChangeFilter({
                            albumFormatId: val,
                        });
                    }}
                    onRemove={() =>
                        onChangeFilter({ albumFormatId: undefined })
                    }
                />

                <PopoverRadioFilter
                    open={typeFilter === TYPE_FILTER.ARTIST_ID}
                    title={messages('artist.label')}
                    options={artistsData?.items?.map((item: ArtistData) => ({
                        name: item?.name,
                        value: item?.id,
                    }))}
                    selectedValue={dataFilter.artistId}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.ARTIST_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            artistId: vals,
                        });
                    }}
                    onRemove={() => onChangeFilter({ artistId: undefined })}
                />

                <PopoverRadioFilter
                    open={typeFilter === TYPE_FILTER.RELEASE_ID}
                    title={messages('releases.label')}
                    options={releasesData?.items?.map((item: ReleasesData) => ({
                        name: item?.title,
                        value: item?.id,
                    }))}
                    selectedValue={dataFilter.releaseId}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.RELEASE_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            releaseId: vals,
                        });
                    }}
                    onRemove={() => onChangeFilter({ releaseId: undefined })}
                />

                <StatusReleaseDialog
                    title={messages('common.status')}
                    open={typeFilter === TYPE_FILTER.STATUS}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <GenresDialog
                    title={messages('common.genres')}
                    open={typeFilter === TYPE_FILTER.GENRES}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                {/* <SearchArtistIdDialog
                    title={messages('artist.label')}
                    open={typeFilter === TYPE_FILTER.ARTIST_ID}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

                <DateCreatedDialog
                    title={messages('common.createdAt')}
                    open={typeFilter === TYPE_FILTER.DATE_CREATED}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <DateReleaseDialog
                    title={messages('common.dateRelease')}
                    open={typeFilter === TYPE_FILTER.DATE_RELEASE}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <div className="grow">
                    <ReleasesHeaderDropdown
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
