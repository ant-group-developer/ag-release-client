import { AppPopover } from '@/components/shared/app-popover';
import { DropdownItem } from '@/components/ui/dropdown/drop-down-item';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { OnChangeFilter, UseFilterProps } from '@/hooks/use-filter';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TrackDataFilter } from '../../types';

interface Props
    extends Pick<
        UseFilterProps<TrackDataFilter>,
        'onChangeFilter' | 'dataFilter'
    > {
    open?: boolean;
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
}

export default function TracksHeaderDropdown({
    open,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props) {
    const [inputValue, setInputValue] = useState<string>('');
    const messages = useTranslations();

    const onClickSearch = () => {
        onChangeFilter({
            keyword: inputValue,
        });
        handleChangeTypeFilter(undefined);
        setInputValue('');
    };

    const dropdownItems = [
        {
            label: messages('common.search'),
            value: TYPE_FILTER.KEYWORD,
            visible: !dataFilter.keyword,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.KEYWORD),
        },
        // {
        //     label: messages('common.dateRelease'),
        //     value: TYPE_FILTER.DATE_RELEASE,
        //     visible: !dataFilter.startDateRelease && !dataFilter.endDateRelease,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_RELEASE),
        // },
        {
            label: messages('releases.label'),
            value: TYPE_FILTER.RELEASE_ID,
            visible: !dataFilter.releaseId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.RELEASE_ID),
        },
        {
            label: messages('artist.label'),
            value: TYPE_FILTER.ARTIST_ID,
            visible: !dataFilter.artistId,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.ARTIST_ID),
        },
        {
            label: messages('tracks.scan'),
            value: TYPE_FILTER.IS_SCANNED,
            visible: !dataFilter.isScanned,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.IS_SCANNED),
        },
        {
            label: messages('common.createdAt'),
            value: TYPE_FILTER.DATE_CREATED,
            visible: !dataFilter.startCreatedAt && !dataFilter.endCreatedAt,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
        },
        // {
        //     label: messages('common.type'),
        //     value: TYPE_FILTER.TYPE,
        //     visible: !dataFilter.type,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.TYPE),
        // },
        // {
        //     label: messages('common.genres'),
        //     value: TYPE_FILTER.GENRES,
        //     visible: !dataFilter.genres,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.GENRES),
        // },
    ];

    const options = dropdownItems.filter(
        (item) =>
            item.visible &&
            toNonAccentVietnamese(item.label)
                .toLowerCase()
                .includes(toNonAccentVietnamese(inputValue).toLowerCase())
    );

    const getDropdownContent = () => {
        if (dataFilter.keyword && options.length === 0) {
            return (
                <p className="px-3 py-1 text-gray-400">
                    {messages('filter.noMatchingFilter')}
                </p>
            );
        }

        return (
            <React.Fragment>
                {!dataFilter.keyword && inputValue && (
                    <DropdownItem onClick={onClickSearch}>
                        {messages('common.content')}
                        &nbsp;&apos;<b>{inputValue}</b>&apos;
                    </DropdownItem>
                )}
                {options.map((item, index) => (
                    <DropdownItem key={item.value} onClick={item.onClick}>
                        {item.label}
                    </DropdownItem>
                ))}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <AppPopover
                className="top-[45px]"
                open={open}
                bodyClassName="px-0"
                title={messages('common.filter')}
                onCancel={() => handleChangeTypeFilter()}
            >
                <ul>{getDropdownContent()}</ul>
            </AppPopover>

            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-10 w-full outline-0"
                placeholder={messages('common.filter')}
                variant="borderless"
                onPressEnter={onClickSearch}
            />
        </React.Fragment>
    );
}
