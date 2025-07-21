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
        <div className={`mb-1 rounded-lg bg-card-bg p-4 ${className}`}>
            <p className="font-medium">{label}</p>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}
