import React from 'react';

interface MetadataInfoItemProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function MetadataInfoItem({
    label,
    children,
    className = '',
}: MetadataInfoItemProps) {
    return (
        <div
            className={`rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900 ${className}`}
        >
            <p className="font-medium">{label}</p>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}
