import { AppPopover } from '@/components/shared/app-popover';
import { DropdownItem } from '@/components/ui/dropdown/drop-down-item';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useMemo } from 'react';

export type FilterOption = {
    label: ReactNode;
    visible?: boolean;
    onClick: () => void;
};

export type PopoverFilterDropdownProps = {
    /** Whether the popover is open */
    open: boolean;
    /** Popover title */
    title: ReactNode;
    /** Current filter state, used to hide some options */
    options: FilterOption[];
    /** Current input/search value */
    value: string;
    /** Called on input change */
    onInputChange: (val: string) => void;
    /** Called when user presses Enter or selects search */
    onSearch: () => void;
    /** Called to open/close the popover */
    onOpenChange: (open?: boolean) => void;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** CSS class for the popover */
    className?: string;
};

export const PopoverFilterDropdown: React.FC<PopoverFilterDropdownProps> = ({
    open,
    title,
    options,
    value,
    onInputChange,
    onSearch,
    onOpenChange,
    placeholder = 'Filter...',
    className = '',
}) => {
    const messages = useTranslations();

    // filter visible options matching input
    const filtered = useMemo(
        () =>
            options
                .filter((opt) => opt.visible !== false)
                .filter((opt) =>
                    String(opt.label)
                        .toLowerCase()
                        .includes(value.toLowerCase())
                ),
        [options, value]
    );

    const handleCancel = () => onOpenChange(false);

    const renderContent = () => {
        if (!filtered.length) {
            return (
                <p className="px-3 py-1 text-gray-400">
                    {messages('filter.noMatchingFilter')}
                </p>
            );
        }

        return (
            <>
                {/* {value && (
                    <DropdownItem onClick={onSearch}>
                        Search for “<b>{value}</b>”
                    </DropdownItem>
                )} */}
                {filtered.map((opt, idx) => (
                    <DropdownItem key={idx} onClick={opt.onClick}>
                        {opt.label}
                    </DropdownItem>
                ))}
            </>
        );
    };

    return (
        <div className={`relative ${className}`}>
            <AppPopover
                open={open}
                title={title}
                onCancel={handleCancel}
                bodyClassName="px-0"
                className="top-[45px]"
            >
                <ul>{renderContent()}</ul>
            </AppPopover>
            <Input
                value={value}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={placeholder}
                onPressEnter={onSearch}
                allowClear
                variant="borderless"
            />
        </div>
    );
};
