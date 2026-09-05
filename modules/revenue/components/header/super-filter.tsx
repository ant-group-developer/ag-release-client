import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateReleaseDialog from '@/components/filter-dialog/date-release-dialog';
import SearchDialog from '@/components/filter-dialog/search-dialog';
import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import { PopoverFilterDropdown } from '@/components/filter/popover-dropdown';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListDspSimple } from '@/modules/dsp/hooks/use-get-list-simple-dsp';
import { DspData } from '@/modules/dsp/types';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { LabelSimpleData } from '@/modules/labels/types';
import { useGetReleaseSimpleList } from '@/modules/releases/hooks/use-get-release-simple-list';
import { ReleasesDataSimple, TrackData } from '@/modules/releases/types';
import { useGetTrackSimpleList } from '@/modules/tracks/hooks/use-get-tracks-simple-list';
import { debounce } from 'lodash';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RevenueDataFilter } from '../../types';

type Props = {
    dataFilter: RevenueDataFilter;
    onChangeFilter: OnChangeFilter<RevenueDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function RevenueSuperFilter({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();
    const [inputValue, setInputValue] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [idInclude, setIdInclude] = useState<string[]>([]);

    const handleChangeTypeFilter = (value?: TYPE_FILTER) => {
        setTypeFilter(value);
    };

    const {
        releasesData,
        isFetching: isReleaseLoading,
        fetchNextPage: releaseFetchNextPage,
        hasNextPage: releaseHasNextPage,
        isFetchingNextPage: isReleaseFetchingNextPage,
    } = useGetReleaseSimpleList(
        {
            pageSize: PAGE_SIZE,
            keyword: keyword,
            idInclude: idInclude.join(','),
        },
        { enabled: typeFilter === TYPE_FILTER.RELEASE_ID }
    );

    const {
        tracksData,
        isFetching: isTracksFetching,
        fetchNextPage: tracksFetchNextPage,
        hasNextPage: isTracksHasNextPage,
        isFetchingNextPage: isTracksFetchingNextPage,
    } = useGetTrackSimpleList(
        {
            pageSize: PAGE_SIZE,
            keyword: keyword,
            idInclude: idInclude.join(','),
        },
        { enabled: typeFilter === TYPE_FILTER.TRACK_ID }
    );

    const { labelsData, isFetching: isLabelFetching } = useGetListLabelsSimple(
        undefined,
        {
            enabled: typeFilter === TYPE_FILTER.LABEL_ID,
        }
    );

    const { dspData, isFetching: isDspFetching } = useGetListDspSimple({
        enabled: typeFilter === TYPE_FILTER.DSP_ID,
    });

    const dropdownItems = [
        {
            label: messages('form.searchPlaceholder'),
            visible: !dataFilter.keyword,
            onClick: () => setTypeFilter(TYPE_FILTER.KEYWORD),
        },
        {
            label: messages('release.label'),
            value: TYPE_FILTER.RELEASE_ID,
            visible: !dataFilter.releaseId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.RELEASE_ID),
        },
        {
            label: messages('track.label'),
            value: TYPE_FILTER.TRACK_ID,
            visible: !dataFilter.trackId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.TRACK_ID),
        },
        {
            label: messages('label.label'),
            value: TYPE_FILTER.LABEL_ID,
            visible: !dataFilter.labelId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.LABEL_ID),
        },
        // {
        //     label: messages('artist.label'),
        //     value: TYPE_FILTER.ARTIST_ID,
        //     visible: !dataFilter.artistId,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.ARTIST_ID),
        // },
        {
            label: messages('dsp.label'),
            value: TYPE_FILTER.DSP_ID,
            visible: !dataFilter.dspId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DSP_ID),
        },
        // {
        //     label: messages('tenant.label'),
        //     value: TYPE_FILTER.TENANT_ID,
        //     visible: !dataFilter.tenantId,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.TENANT_ID),
        // },
    ];

    const debouncedSearch = useMemo(
        () =>
            debounce((keyword: string, selectedValues?: string[]) => {
                setKeyword(keyword);
                setIdInclude(selectedValues ?? []);
            }, 800),
        []
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

    useEffect(() => {
        return () => {
            debouncedSearch.cancel(); // cleanup khi unmount
        };
    }, [debouncedSearch]);

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
                    loading={isReleaseLoading || isReleaseFetchingNextPage}
                    options={releasesData?.map((item: ReleasesDataSimple) => ({
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
                    onSearch={(keyword, selectedValues) => {
                        debouncedSearch(keyword, selectedValues);
                    }}
                    onPopupScroll={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                            target.scrollTop + target.offsetHeight >=
                            target.scrollHeight - 50
                        ) {
                            if (
                                releaseHasNextPage &&
                                !isReleaseFetchingNextPage
                            ) {
                                releaseFetchNextPage();
                            }
                        }
                    }}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.TRACK_ID}
                    title={messages('track.label')}
                    loading={isTracksFetching || isTracksFetchingNextPage}
                    options={tracksData?.map((item: TrackData) => ({
                        name: item?.title,
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.trackId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.TRACK_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            trackId: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ trackId: undefined })}
                    onSearch={(keyword, selectedValues) => {
                        debouncedSearch(keyword, selectedValues);
                    }}
                    onPopupScroll={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                            target.scrollTop + target.offsetHeight >=
                            target.scrollHeight - 50
                        ) {
                            if (
                                isTracksHasNextPage &&
                                !isTracksFetchingNextPage
                            ) {
                                tracksFetchNextPage();
                            }
                        }
                    }}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.LABEL_ID}
                    title={messages('label.label')}
                    loading={isLabelFetching}
                    options={labelsData?.map((item: LabelSimpleData) => ({
                        name: item?.name,
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.labelId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.LABEL_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            labelId: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ labelId: undefined })}
                />

                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.DSP_ID}
                    title={messages('dsp.label')}
                    loading={isDspFetching}
                    options={dspData?.map((item: DspData) => ({
                        name: item?.name,
                        value: item?.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.dspId)}
                    onOpenChange={(val) => {
                        return setTypeFilter(
                            val ? TYPE_FILTER.DSP_ID : undefined
                        );
                    }}
                    onConfirm={(vals) => {
                        return onChangeFilter({
                            dspId: arrayToString(vals),
                        });
                    }}
                    onRemove={() => onChangeFilter({ dspId: undefined })}
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
