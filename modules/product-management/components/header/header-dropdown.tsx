import { AppPopover } from '@/components/shared/app-popover';
import { DropdownItem } from '@/components/ui/dropdown/drop-down-item';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { FilterProductManagement } from '../../types';

type Props = {
    dataFilter: FilterProductManagement;
    onChangeFilter: OnChangeFilter<FilterProductManagement>;
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
};

export default function HeaderDropDown({
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
    open,
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
            label: messages('form.searchPlaceholder'),
            key: TYPE_FILTER.KEYWORD,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.KEYWORD),
            visible: !dataFilter.keyword,
        },
        {
            label: messages('common.type'),
            key: TYPE_FILTER.PRODUCT_TYPE,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.PRODUCT_TYPE),
            visible: !dataFilter.productTypeId,
        },
        {
            label: messages('common.status'),
            key: TYPE_FILTER.STATUS,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.STATUS),
            visible: !dataFilter.status,
        },
        {
            label: messages('topic.label'),
            key: TYPE_FILTER.TOPIC,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.TOPIC),
            visible: !dataFilter.topicId,
        },
        {
            label: messages('common.deadline'),
            key: TYPE_FILTER.DEADLINE,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DEADLINE),
            visible:
                !dataFilter.startDateDeadline && !dataFilter.endDateDeadline,
        },
        {
            label: messages('common.dateCreated'),
            key: TYPE_FILTER.DATE_CREATED,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
            visible: !dataFilter.startDateCreated && !dataFilter.endDateCreated,
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
                    <DropdownItem key={index} onClick={item.onClick}>
                        {item.label}
                    </DropdownItem>
                ))}
            </React.Fragment>
        );
    };

    return (
        <>
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
        </>
    );
}
