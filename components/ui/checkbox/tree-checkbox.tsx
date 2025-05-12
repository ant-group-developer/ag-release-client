// TopicTreeRadio.tsx
import { toNonAccentVietnamese } from '@/helpers/string';
import { TopicData } from '@/modules/topic/types';
import type { TreeProps } from 'antd';
import { Empty, Tree } from 'antd';
import { useMemo } from 'react';
import Highlighter from 'react-highlight-words';

type Props = {
    data: TopicData[];
    showChildren?: boolean;
    expandedKeys?: string[];
    onExpand?: (keys: React.Key[]) => void;
    searchKeyword?: string;
} & TreeProps;

const TopicTreeCheckbox = ({
    showChildren,
    data,
    expandedKeys,
    onExpand,
    searchKeyword,
    ...props
}: Props) => {
    // Tạo mảng từ khóa tìm kiếm đã được xử lý dấu
    const searchWords = useMemo(() => {
        if (!searchKeyword) return [];
        return [toNonAccentVietnamese(searchKeyword).toLowerCase()];
    }, [searchKeyword]);

    const generateTreeData = (topics: TopicData[]): any[] => {
        return topics.map((topic) => ({
            title: (
                <div className="flex w-[200px] items-center justify-between">
                    <span className="truncate">
                        {searchKeyword ? (
                            <Highlighter
                                highlightClassName="bg-yellow-200 font-medium"
                                searchWords={searchWords}
                                autoEscape={true}
                                textToHighlight={topic.code}
                                caseSensitive={false}
                                unhighlightStyle={{ padding: 0 }}
                            />
                        ) : (
                            topic.code
                        )}
                    </span>
                </div>
            ),
            value: topic.id,
            key: topic.id,
            children:
                showChildren && topic.children
                    ? generateTreeData(topic.children)
                    : undefined,
        }));
    };

    // Memoize treeData for performance optimization
    const treeData = useMemo(() => generateTreeData(data), [data, searchWords]);

    if (treeData.length === 0) return <Empty />;
    return (
        <Tree
            className="overflow-y-hidden"
            selectable
            showLine
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            {...props}
        />
    );
};

export default TopicTreeCheckbox;
