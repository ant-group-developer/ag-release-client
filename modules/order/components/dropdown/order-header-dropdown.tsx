import { AppPopover } from '@/components/shared/app-popover';
import { TYPE_FILTER } from '@/enums/common';
import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { UseFilterProps } from '@/hooks/use-filter';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { DataFilterOrder } from '../../types';

interface Props
    extends Pick<
        UseFilterProps<DataFilterOrder>,
        'onChangeFilter' | 'dataFilter'
    > {
    dataFilter: DataFilterOrder;
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

export const OrderHeaderDropdown = ({
    dataFilter,
    handleChangeTypeFilter,
    onChangeFilter,
    open,
}: Props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const messages = useTranslations();

    const onClickSearch = () => {
        onChangeFilter({
            keyword: inputValue.trim(),
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
            label: messages('common.dateCreated'),
            key: TYPE_FILTER.DATE_CREATED,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DATE_CREATED),
            visible: !dataFilter.startDateCreated || !dataFilter.endDateCreated,
        },
        {
            label: messages('common.userCreator'),
            key: TYPE_FILTER.CREATOR,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.CREATOR),
            visible: !dataFilter.creatorId,
        },
        {
            label: messages('common.assignee'),
            key: TYPE_FILTER.ASSIGNEE,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.ASSIGNEE),
            visible: !dataFilter.assigneeId,
        },
        {
            label: messages('order.groupCreator'),
            key: TYPE_FILTER.GROUP,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.GROUP),
            visible: !dataFilter.groupIds,
        },
        {
            label: messages('priority.label'),
            key: TYPE_FILTER.PRIORITY,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.PRIORITY),
            visible: !dataFilter.priorityId,
        },
        // {
        //     label: messages('order.type.label'),
        //     key: TYPE_FILTER.TYPE,
        //     onClick: () => handleChangeTypeFilter(TYPE_FILTER.TYPE),
        //     visible: !dataFilter.type,
        // },
        {
            label: messages('productType.label'),
            key: TYPE_FILTER.TYPE,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.PRODUCT_TYPE),
            visible: !dataFilter.productTypeId,
        },
        {
            label: messages('common.use'),
            key: TYPE_FILTER.USE_STATUS,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.USE_STATUS),
            visible: !dataFilter.usedStatus,
        },
        {
            label: messages('common.deadline'),
            key: TYPE_FILTER.DEADLINE,
            onClick: () => handleChangeTypeFilter(TYPE_FILTER.DEADLINE),
            visible:
                !dataFilter.startDateDeadline || !dataFilter.endDateDeadline,
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
