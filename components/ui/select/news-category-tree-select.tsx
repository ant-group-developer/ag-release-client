import { getNameByLocale } from '@/helpers/string';
import { useGetTreeNewsCategory } from '@/modules/news-category/hooks/use-get-tree';
import { NewsCategoryData } from '@/modules/news-category/types';
import { TreeSelect, TreeSelectProps } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';

type Props = Omit<TreeSelectProps, 'treeData'> & {
    excludeId?: string;
};

export default function NewsCategoryTreeSelect({ excludeId, ...props }: Props) {
    const { newsCategoryTreeData } = useGetTreeNewsCategory();
    const locale = useLocale();

    const formatTreeData = (list: NewsCategoryData[]): any[] => {
        return list
            .filter((item) => item.id !== excludeId)
            .map((item) => {
                const formattedItem: any = {
                    title: getNameByLocale(item.nameEn, item.nameVi, locale),
                    value: item.id,
                    key: item.id,
                };
                if (item.children && item.children.length > 0) {
                    const formattedChildren = formatTreeData(item.children);
                    if (formattedChildren.length > 0) {
                        formattedItem.children = formattedChildren;
                    }
                }
                return formattedItem;
            });
    };

    const treeData = useMemo(() => {
        return formatTreeData(newsCategoryTreeData);
    }, [newsCategoryTreeData, excludeId, locale]);

    return (
        <TreeSelect
            showSearch
            allowClear
            treeLine={true}
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            treeData={treeData}
            switcherIcon={(nodeProps: any) => {
                if (nodeProps.isLeaf) return null;
                return nodeProps.expanded ? (
                    <DownOutlined style={{ fontSize: 10 }} className="text-gray-400" />
                ) : (
                    <RightOutlined style={{ fontSize: 10 }} className="text-gray-400" />
                );
            }}
            {...props}
        />
    );
}
