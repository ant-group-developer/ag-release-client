import React from 'react';

interface MetadataInfoItemProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function MetadataInfoItem({
    label,
    children,
    className = '',
    style,
}: MetadataInfoItemProps) {
    return (
        <div
            className={`rounded-lg bg-[#f5f5f5] p-4 dark:bg-zinc-900 ${className}`}
            style={style}
        >
            <p className="font-bold">{label}</p>
            <div className="flex flex-col">{children ? children : '_'}</div>
        </div>
    );
}
