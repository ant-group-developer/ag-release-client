import React from 'react';

interface MetadataInfoItemProps {
    label: React.ReactNode;
    children: React.ReactNode;
}

const MetadataInfoItem: React.FC<MetadataInfoItemProps> = ({
    label,
    children,
}) => {
    return (
        <div className="grid grid-cols-6 bg-main p-4 dark:!bg-zinc-900">
            <span className="col-span-2 font-medium">{label}</span>
            <div className="col-span-4 flex flex-col gap-2">{children}</div>
        </div>
    );
};

export default MetadataInfoItem;
