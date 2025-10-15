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
        <div className="bg-main grid grid-cols-6 p-4">
            <span className="col-span-2 font-medium">{label}</span>
            <div className="col-span-4 flex flex-col gap-2">{children}</div>
        </div>
    );
};

export default MetadataInfoItem;
