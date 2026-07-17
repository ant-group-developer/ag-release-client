import { Popover, Tag, TagProps } from 'antd';
import React from 'react';

type PopoverTagsV2Props<T> = Omit<TagProps, 'children'> & {
    items?: T[];
    maxVisibleTags?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    renderPopoverItem?: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => string | number;
};

export default function PopoverTagsV2<T>({
    items,
    maxVisibleTags = 1,
    renderItem,
    renderPopoverItem,
    getKey,
    ...props
}: PopoverTagsV2Props<T>) {
    if (!items || items.length === 0) {
        return null;
    }

    const visibleItems = items.slice(0, maxVisibleTags);
    const hiddenItems = items.slice(maxVisibleTags);

    const getPopoverContent = () => {
        const renderer = renderPopoverItem || renderItem;
        return (
            <div className="flex items-center justify-center gap-1">
                {hiddenItems.map((item, index) => {
                    const originalIndex = index + maxVisibleTags;
                    const key = getKey ? getKey(item, originalIndex) : originalIndex;
                    return (
                        <React.Fragment key={key}>
                            {renderer(item, originalIndex)}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-wrap gap-1 items-center">
            {visibleItems.map((item, index) => {
                const key = getKey ? getKey(item, index) : index;
                return (
                    <React.Fragment key={key}>
                        {renderItem(item, index)}
                    </React.Fragment>
                );
            })}
            {hiddenItems.length > 0 && (
                <Popover content={getPopoverContent()} trigger="hover">
                    <Tag {...props} className="cursor-pointer !mr-0">
                        +{hiddenItems.length}
                    </Tag>
                </Popover>
            )}
        </div>
    );
}
