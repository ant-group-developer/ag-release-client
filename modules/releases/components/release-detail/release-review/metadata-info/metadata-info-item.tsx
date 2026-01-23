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
        <div className={`rounded-lg border p-4 ${className}`} style={style}>
            <p className="font-semibold">{label}</p>
            <div className="flex flex-col">{children ? children : '_'}</div>
        </div>
    );
}
