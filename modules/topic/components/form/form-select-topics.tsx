import { toNonAccentVietnamese } from '@/helpers/string';
import { cn } from '@/helpers/tailwind';
import { TopicData } from '@/modules/topic/types';
import { TreeSelect, TreeSelectProps } from 'antd';
import { useMemo } from 'react';

type Props = {
    dataParentCode: TopicData[];
    showChildren?: boolean;
} & TreeSelectProps;

export function SelectTopics({
    showChildren = true,
    dataParentCode,
    className,
    ...props
}: Props) {
    const generateTreeData = (topics: TopicData[]): any[] => {
        return topics.map((topic) => ({
            title: topic.code,
            value: topic.id,
            key: topic.id,
            children:
                showChildren && topic.children
                    ? generateTreeData(topic.children)
                    : undefined,
        }));
    };

    // Memoize treeData for performance optimization
    const treeData = useMemo(
        () => generateTreeData(dataParentCode),
        [dataParentCode]
    );

    return (
        <TreeSelect
            allowClear
            showSearch
            className={cn('w-full', className)}
            treeDefaultExpandAll
            filterTreeNode={(inputValue, treeNode) => {
                const title = treeNode.title as string;
                return toNonAccentVietnamese(title)
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(inputValue).toLowerCase());
            }}
            {...props}
            treeData={treeData}
        />
    );
}
