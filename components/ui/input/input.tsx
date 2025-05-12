import { cn } from '@/helpers/tailwind';
import React, { ChangeEvent } from 'react';

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    htmlRef?: React.LegacyRef<HTMLTextAreaElement>;
}

export default function Input({
    name,
    type,
    placeholder,
    className,
    htmlRef,
    ...props
}: InputProps) {
    return (
        <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            className={cn(
                `bg-bg text-text-color mt-2 block w-full appearance-none rounded-md px-3 py-1.5 shadow-sm ring-1 ring-slate-300 placeholder:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400`,
                className
            )}
            {...props}
        />
    );
}
