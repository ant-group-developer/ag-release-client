import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import { Checkbox } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

export type PopoverCheckboxFilterProps<T extends string | number> = {
    /** Whether the popover is open */
    open: boolean;
    /** Title shown in Popover and Chip */
    title: ReactNode;
    /** Options list to display as checkboxes; optional `count` will display next to label */
    options: { name: string; value: T; count?: number }[];
    /** Currently selected values */
    selectedValues?: T[];
    /** Called to open/close the popover */
    onOpenChange: (open?: boolean) => void;
    /** Called when user confirms selection */
    onConfirm: (values: T[]) => void;
    /** Optional remove handler for the chip */
    onRemove?: () => void;
    /** Optional CSS class for container */
    className?: string;
};

export function PopoverCheckboxFilter<T extends string | number>({
    open,
    title,
    options,
    selectedValues = [],
    onOpenChange,
    onConfirm,
    onRemove,
    className = '',
}: PopoverCheckboxFilterProps<T>) {
    const [value, setValue] = useState<any[]>(selectedValues);

    // Compute labels for selected values
    const selectedLabels = options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((opt) => opt.name)
        .join(', ');

    // Sync internal state with external selected values
    useEffect(() => {
        setValue(selectedValues as any[]);
    }, [JSON.stringify(selectedValues)]);

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSubmit = () => {
        // cast back to T[]
        onConfirm(value as T[]);
        handleCancel();
    };

    // Only render when needed
    if ((!selectedValues || selectedValues.length === 0) && !open) return null;

    return (
        <div className={`relative ${className}`}>
            {selectedValues && selectedValues.length > 0 && (
                <Chip onClick={() => onOpenChange(true)} onRemove={onRemove}>
                    {title}: {selectedLabels}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                onCancel={handleCancel}
                submitProps={{
                    className: value.length
                        ? ''
                        : 'opacity-50 cursor-not-allowed',
                    disabled: !value.length,
                    onClick: handleSubmit,
                }}
            >
                <div className="max-h-60 overflow-auto">
                    <Checkbox.Group
                        value={value}
                        onChange={setValue}
                        className="flex flex-col gap-2"
                    >
                        {options.map((opt) => (
                            <div
                                key={String(opt.value)}
                                className="flex items-center justify-between"
                            >
                                <Checkbox value={opt.value}>
                                    {opt.name}
                                </Checkbox>
                                {opt.count !== undefined && (
                                    <span className="ml-2 text-gray-500">
                                        {opt.count}
                                    </span>
                                )}
                            </div>
                        ))}
                    </Checkbox.Group>
                </div>
            </AppPopover>
        </div>
    );
}
