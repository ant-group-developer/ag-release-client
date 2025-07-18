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
            className={`grid grid-cols-6 rounded-lg bg-card-bg p-4 ${className}`}
        >
            <span className="col-span-2 font-medium">{label}</span>
            <div className="col-span-4 flex flex-col gap-2">{children}</div>
        </div>
    );
}
