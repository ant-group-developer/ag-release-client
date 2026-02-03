import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import { Empty, Radio } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

export type PopoverRadioFilterProps<T extends string | number> = {
    /** Whether the popover is open */
    open: boolean;
    /** Title shown in Popover and Chip */
    title: ReactNode;
    /** Options list to display as radio buttons; optional `count` will display next to label */
    options: { name: string; value: T; count?: number }[];
    /** Currently selected value */
    selectedValue?: T;
    /** Called to open/close the popover */
    onOpenChange: (open?: boolean) => void;
    /** Called when user confirms selection */
    onConfirm: (value: T | undefined) => void;
    /** Optional remove handler for the chip */
    onRemove?: () => void;
    /** Optional CSS class for container */
    className?: string;
    /** Allow clearing the selection */
    allowClear?: boolean;
    loading?: boolean;
};

export function PopoverRadioFilter<T extends string | number>({
    open,
    title,
    options,
    selectedValue,
    onOpenChange,
    onConfirm,
    onRemove,
    className = '',
    allowClear = true,
    loading = false,
}: PopoverRadioFilterProps<T>) {
    const [value, setValue] = useState<T | undefined>(selectedValue);

    // Compute label for selected value
    const selectedLabel = options.find(
        (opt) => opt.value === selectedValue
    )?.name;

    // Sync internal state with external selected value
    useEffect(() => {
        setValue(selectedValue);
    }, [selectedValue]);

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSubmit = () => {
        onConfirm(value);
        handleCancel();
    };

    const handleClear = () => {
        setValue(undefined);
    };

    // Only render when needed
    if (!selectedValue && !open) return null;

    return (
        <div className={`relative ${className}`}>
            {selectedValue && (
                <Chip onClick={() => onOpenChange(true)} onRemove={onRemove}>
                    {title}: {selectedLabel}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                loading={loading}
                open={open}
                title={title}
                showFooter
                onCancel={handleCancel}
                submitProps={{
                    onClick: handleSubmit,
                }}
            >
                <div className="max-h-60 overflow-auto">
                    <Radio.Group
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex w-full flex-col gap-2"
                    >
                        {options.map((opt) => (
                            <div
                                key={String(opt.value)}
                                className="flex items-center justify-between"
                            >
                                <Radio value={opt.value} className="flex-1">
                                    {opt.name}
                                </Radio>
                                {opt.count !== undefined && (
                                    <span className="ml-2 text-gray-500">
                                        {opt.count}
                                    </span>
                                )}
                            </div>
                        ))}
                    </Radio.Group>
                    {options?.length < 1 && <Empty />}
                </div>
            </AppPopover>
        </div>
    );
}
