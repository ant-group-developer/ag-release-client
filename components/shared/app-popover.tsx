'use client';

import { cn, formattedNumber } from '@/helpers/common';
import { Input, InputProps, InputRef, Spin } from 'antd';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useEffect, useRef } from 'react';
import IconButton from '../ui/button/icon-button';

type Props = {
    className?: string;
    bodyClassName?: string;
    open?: boolean;
    children: ReactNode;
    title?: ReactNode;
    showFooter?: boolean;
    submitProps?: JSX.IntrinsicElements['button'];
    onCancel?: () => void;
    showInput?: boolean;
    inputProps?: InputProps;
    inputTitle?: ReactNode;
    loading?: boolean;
    total?: number;
};

function AppPopover({
    children,
    open,
    title,
    submitProps,
    showFooter,
    className,
    bodyClassName,
    showInput,
    inputProps,
    inputTitle,
    loading,
    total,
    onCancel,
}: Props) {
    const messages = useTranslations();
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus({
                cursor: 'end',
            });
        }
    }, [open]);

    if (!open) return null;

    return (
        <div
            className={cn(
                'absolute z-[9999] hidden min-w-52 rounded-xl bg-white',
                className,
                {
                    block: open,
                }
            )}
            style={{
                boxShadow:
                    '0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2)',
            }}
        >
            {title && (
                <div className="text-muted-foreground flex items-center justify-between border-b px-3 py-2">
                    <h3 className="font-semibold">
                        {title}
                        {Boolean(total) && ` (${formattedNumber(total)})`}
                    </h3>
                    <IconButton onClick={onCancel}>
                        <X />
                    </IconButton>
                </div>
            )}

            <div className={cn('overflow-auto px-3 py-2', bodyClassName)}>
                {showInput && (
                    <React.Fragment>
                        {inputTitle}
                        <Input
                            className="w-full"
                            {...inputProps}
                            ref={inputRef}
                        />
                    </React.Fragment>
                )}
                {loading ? (
                    <div className="grid h-20 place-content-center text-xl">
                        <Spin />
                    </div>
                ) : (
                    children
                )}
            </div>

            {showFooter && (
                <div className="border-t px-3 py-2 text-right">
                    <button
                        {...submitProps}
                        className={cn(
                            'rounded-lg bg-gray-100 px-4 py-1.5 hover:bg-gray-200',
                            submitProps?.className
                        )}
                    >
                        {messages('common.submit')}
                    </button>
                </div>
            )}
        </div>
    );
}

export { AppPopover };
