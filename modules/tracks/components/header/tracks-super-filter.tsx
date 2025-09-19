import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateReleaseDialog from '@/components/filter-dialog/date-release-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import TypeReleaseDialog from '@/components/filter-dialog/type-releases-dialog';
import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { getIntlCodeByScanCopyrightStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData } from '@/modules/releases/types';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { GENRES, SCAN_COPYRIGHT_STATUS } from '../../enums';
import { TrackDataFilter } from '../../types';
import TracksHeaderDropdown from '../dropdown/tracks-header-dropdown';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function TracksSuperFilter({
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

    const { releasesData, isFetching: isReleaseLoading } = useGetListReleases(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        {
            enabled:
                typeFilter == TYPE_FILTER.RELEASE_ID || !!dataFilter?.releaseId,
        }
    );

    const { artistsData, isFetching: isArtistsLoading } = useGetListArtist(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        {
            enabled:
                typeFilter == TYPE_FILTER.ARTIST_ID || !!dataFilter?.artistId,
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
                    open={typeFilter === TYPE_FILTER.RELEASE_ID}
                    title={messages('release.label')}
                    loading={isReleaseLoading}
                    options={releasesData?.items?.map((item: ReleasesData) => ({
                        name: item?.title,
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.releaseId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.RELEASE_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            releaseId: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ releaseId: undefined })}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.SCAN_COPYRIGHT_STATUS}
                    title={messages('common.scan')}
                    loading={isReleaseLoading}
                    options={Object.values(SCAN_COPYRIGHT_STATUS).map(
                        (item) => ({
                            name: messages(
                                getIntlCodeByScanCopyrightStatus(item) as any
                            ),
                            value: item,
                        })
                    )}
                    selectedValues={arrayFromString(
                        dataFilter.scanCopyrightStatus
                    )}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.SCAN_COPYRIGHT_STATUS : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            scanCopyrightStatus: arrayToString(vals),
                        });
                    }}
                    onRemove={() =>
                        onChangeFilter({ scanCopyrightStatus: undefined })
                    }
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

                {/* <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.IS_SCANNED}
                    title={messages('common.scan')}
                    options={[
                        { name: messages('common.scanned'), value: 'true' },
                        { name: messages('common.notScanned'), value: 'false' },
                    ]}
                    selectedValues={arrayFromString(dataFilter?.isScanned)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.IS_SCANNED : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            isScanned: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ isScanned: undefined })}
                /> */}

                <TypeReleaseDialog
                    title={messages('common.type')}
                    open={typeFilter === TYPE_FILTER.TYPE}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

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
                    <TracksHeaderDropdown
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
