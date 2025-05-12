import { AppPopover } from '@/components/shared/app-popover';
import { TYPE_FILTER } from '@/enums/common';
import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { UseFilterProps } from '@/hooks/use-filter';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { DataFilterTopic } from '../../types';

interface Props
    extends Pick<
        UseFilterProps<DataFilterTopic>,
        'onChangeFilter' | 'dataFilter'
    > {
    dataFilter: DataFilterTopic;
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open?: boolean;
}

interface DropdownItemProps
    extends React.DetailedHTMLProps<
        React.LiHTMLAttributes<HTMLLIElement>,
        HTMLLIElement
    > {}

function DropdownItem({ children, className, ...props }: DropdownItemProps) {
    return (
        <li
            {...props}
            className={cn(
                'cursor-pointer px-6 py-1.5 hover:bg-gray-100',
                className
            )}
        >
            {children}
        </li>
    );
}

export const TopicHeaderDropdown = ({
    dataFilter,
    handleChangeTypeFilter,
    onChangeFilter,
    open,
}: Props) => {
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
            key: '0',
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.KEYWORD),
            visible: !dataFilter.keyword,
        },
        {
            label: messages('status.active'),
            key: '1',
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.IS_ACTIVE),
            visible: !dataFilter.isActive,
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
};
