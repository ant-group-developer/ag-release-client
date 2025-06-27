import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export interface FlatListProps<T> {
    data: T[];
    renderItem: ({
        item,
        index,
    }: {
        item: T;
        index: number;
    }) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    ListEmptyComponent?: React.ReactNode;
    ListHeaderComponent?: React.ReactNode;
    ListFooterComponent?: React.ReactNode;
    horizontal?: boolean;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    refreshing?: boolean;
    onRefresh?: () => void;
    ItemSeparatorComponent?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    loading?: boolean;
}

export default function FlatList<T>({
    data,
    renderItem,
    keyExtractor,
    ListEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent,
    horizontal = false,
    onEndReached,
    onEndReachedThreshold = 0.5,
    refreshing = false,
    onRefresh,
    ItemSeparatorComponent,
    style,
    className = '',
    loading = false,
}: FlatListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRefreshing, setIsRefreshing] = useState(refreshing);

    useEffect(() => {
        setIsRefreshing(refreshing);
    }, [refreshing]);

    useEffect(() => {
        // Xử lý sự kiện scroll để gọi onEndReached khi cuộn đến cuối
        const handleScroll = () => {
            if (!containerRef.current || !onEndReached) return;

            // Lấy phần tử cha có overflow scroll
            let scrollParent = containerRef.current.parentElement;
            while (scrollParent) {
                const style = window.getComputedStyle(scrollParent);
                const overflow =
                    style.getPropertyValue('overflow') ||
                    style.getPropertyValue('overflow-y') ||
                    style.getPropertyValue('overflow-x');

                if (overflow.includes('auto') || overflow.includes('scroll')) {
                    break;
                }
                scrollParent = scrollParent.parentElement;
            }

            if (!scrollParent) return;

            const { scrollTop, scrollHeight, clientHeight } = scrollParent;
            const scrollPosition = scrollTop + clientHeight;
            const threshold = scrollHeight * onEndReachedThreshold;

            if (scrollHeight - scrollPosition <= threshold) {
                onEndReached();
            }
        };

        // Tìm phần tử cha có overflow scroll
        let scrollParent = containerRef.current?.parentElement;
        while (scrollParent) {
            const style = window.getComputedStyle(scrollParent);
            const overflow =
                style.getPropertyValue('overflow') ||
                style.getPropertyValue('overflow-y') ||
                style.getPropertyValue('overflow-x');

            if (overflow.includes('auto') || overflow.includes('scroll')) {
                break;
            }
            scrollParent = scrollParent.parentElement;
        }

        if (scrollParent && onEndReached) {
            scrollParent.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollParent && onEndReached) {
                scrollParent.removeEventListener('scroll', handleScroll);
            }
        };
    }, [onEndReached, onEndReachedThreshold, data]);

    const handleRefresh = () => {
        if (onRefresh) {
            setIsRefreshing(true);
            onRefresh();
        }
    };

    return (
        <div className={className} style={style} ref={containerRef}>
            {loading && (
                <div className="flex items-center justify-center py-2">
                    <Spin size="small" />
                </div>
            )}

            {isRefreshing && onRefresh && (
                <div className="flex items-center justify-center py-2">
                    <Spin size="small" />
                </div>
            )}

            {ListHeaderComponent && (
                <div className="mb-4 w-full">{ListHeaderComponent}</div>
            )}

            {data.length === 0 && ListEmptyComponent ? (
                <div className="flex w-full items-center justify-center py-8">
                    {ListEmptyComponent}
                </div>
            ) : (
                <>
                    {data.map((item, index) => (
                        <React.Fragment
                            key={
                                keyExtractor ? keyExtractor(item, index) : index
                            }
                        >
                            {renderItem({ item, index })}
                            {ItemSeparatorComponent &&
                                index < data.length - 1 && (
                                    <div
                                        className={`${horizontal ? 'mx-2' : 'my-2'}`}
                                    >
                                        {ItemSeparatorComponent}
                                    </div>
                                )}
                        </React.Fragment>
                    ))}
                </>
            )}

            {ListFooterComponent && (
                <div className="mt-4 w-full">{ListFooterComponent}</div>
            )}
        </div>
    );
}
