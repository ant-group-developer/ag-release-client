import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import React, { ReactNode, useEffect, useState } from 'react';

export type PopoverInputDialogProps = {
    /** Whether the popover is open */
    open: boolean;
    /** Popover title and label for Chip */
    title: ReactNode;
    /** Current input value (e.g. filter keyword) */
    initialValue?: string;
    /** Called when popover visibility should change (e.g. open/close) */
    onOpenChange: (open?: boolean) => void;
    /** Called when user confirms (submit) */
    onConfirm: (value: string) => void;
    /** Optional: when chip remove icon is clicked */
    onRemove?: () => void;
    /** CSS classes to apply to root container */
    className?: string;
};

export const PopoverInputFilter: React.FC<PopoverInputDialogProps> = ({
    open,
    title,
    initialValue = '',
    onOpenChange,
    onConfirm,
    onRemove,
    className = '',
}) => {
    const [value, setValue] = useState(initialValue);

    // Sync with external value changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSubmit = () => {
        onConfirm(value.trim());
        handleCancel();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Show chip when there is a value */}
            {initialValue && (
                <Chip onClick={() => onOpenChange(true)} onRemove={onRemove}>
                    {title}: {initialValue}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                onCancel={handleCancel}
                submitProps={{
                    className: value ? '' : 'opacity-50 cursor-not-allowed',
                    disabled: !value,
                    onClick: handleSubmit,
                }}
                inputProps={{
                    value,
                    onChange: (e) => setValue(e.target.value),
                    onKeyPress: (e) => e.key === 'Enter' && handleSubmit(),
                }}
                showInput
            >
                <div className="w-full max-w-80" />
            </AppPopover>
        </div>
    );
};
