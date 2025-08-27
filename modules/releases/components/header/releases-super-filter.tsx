import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateReleaseDialog from '@/components/filter-dialog/date-release-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import StatusReleaseDialog from '@/components/filter-dialog/status-releases-dialog';
import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import IconButton from '@/components/ui/button/icon-button';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { useGetListReleaseTypes } from '@/modules/release-types/hooks/use-get-list-release-types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { GENRES } from '@/modules/tracks/enums';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ReleasesDataFilter } from '../../types';
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

    const { artistsData, isFetching: isArtistsLoading } = useGetListArtist(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        {
            enabled:
                typeFilter === TYPE_FILTER.ARTIST_ID || !!dataFilter.artistId,
        }
    );

    const { releaseTypesData, isFetching: isReleaseTypesLoading } =
        useGetListReleaseTypes(
            { pageSize: PAGE_SIZE_EXTRA_LARGE },
            {
                enabled:
                    typeFilter === TYPE_FILTER.ALBUM_FORMAT_ID ||
                    !!dataFilter?.albumFormatId,
            }
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

                {(typeFilter === TYPE_FILTER.IS_VARIOUS_ARTIST ||
                    dataFilter?.isVariousArtist) && (
                    <Chip
                        onRemove={() => {
                            setTypeFilter(undefined);
                            onChangeFilter({
                                isVariousArtist: '',
                            });
                        }}
                    >
                        {messages('artist.variousArtists')}
                    </Chip>
                )}

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.ALBUM_FORMAT_ID}
                    title={messages('release.type')}
                    loading={isReleaseTypesLoading}
                    options={releaseTypesData?.items?.map(
                        (item: ReleaseTypesData) => ({
                            name: item?.name,
                            value: item?.id,
                        })
                    )}
                    selectedValues={arrayFromString(dataFilter?.albumFormatId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.ALBUM_FORMAT_ID : undefined
                        );
                    }}
                    onConfirm={(val) => {
                        return onChangeFilter({
                            albumFormatId: arrayToString(val),
                        });
                    }}
                    onRemove={() =>
                        onChangeFilter({ albumFormatId: undefined })
                    }
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.ARTIST_ID}
                    title={messages('artist.label')}
                    loading={isArtistsLoading}
                    options={artistsData?.items?.map((item: ArtistData) => ({
                        name: item?.name,
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.artistId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.ARTIST_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            artistId: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ artistId: undefined })}
                />

                <StatusReleaseDialog
                    title={messages('common.status')}
                    open={typeFilter === TYPE_FILTER.STATUS}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.GENRES}
                    title={messages('common.genres')}
                    options={Object.values(GENRES)?.map((item) => ({
                        name: item.charAt(0).toUpperCase() + item.slice(1),
                        value: item,
                    }))}
                    selectedValues={arrayFromString(dataFilter.genres)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.GENRES : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            genres: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ genres: undefined })}
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
