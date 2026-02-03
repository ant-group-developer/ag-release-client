import { AppPopover } from '@/components/shared/app-popover';
import { DropdownItem } from '@/components/ui/dropdown/drop-down-item';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { OnChangeFilter, UseFilterProps } from '@/hooks/use-filter';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TrackOriginTypeDataFilter } from '../../types';

interface Props
    extends Pick<
        UseFilterProps<TrackOriginTypeDataFilter>,
        'onChangeFilter' | 'dataFilter'
    > {
    open?: boolean;
    dataFilter: TrackOriginTypeDataFilter;
    onChangeFilter: OnChangeFilter<TrackOriginTypeDataFilter>;
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
}

export default function TrackOriginTypeHeaderDropdown({
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
        {
            label: messages('common.createdAt'),
            value: TYPE_FILTER.DATE_CREATED,
            visible: !dataFilter.startCreatedAt,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
        },
        {
            label: messages('common.updatedAt'),
            value: TYPE_FILTER.DATE_UPDATED,
            visible: !dataFilter.startUpdatedAt,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_UPDATED),
        },
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
