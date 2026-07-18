import { getNameByLocale } from '@/helpers/string';
import { useGetTreeNewsCategory } from '@/modules/news-category/hooks/use-get-tree';
import { NewsCategoryData } from '@/modules/news-category/types';
import { Button, TreeSelect, TreeSelectProps } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import NewsCategoryFormModal from '@/modules/news-category/components/modal/news-category-form';

type Props = Omit<TreeSelectProps, 'treeData'> & {
    excludeId?: string;
    showCreate?: boolean;
    onCreateSuccess?: (data: NewsCategoryData) => void;
};

export default function NewsCategoryTreeSelect({
    excludeId,
    showCreate = true,
    onCreateSuccess,
    ...props
}: Props) {
    const { newsCategoryTreeData } = useGetTreeNewsCategory();
    const locale = useLocale();
    const messages = useTranslations();
    const [openCreate, setOpenCreate] = useState(false);

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

    const handleCreateSuccess = (data: NewsCategoryData) => {
        setOpenCreate(false);
        if (onCreateSuccess) {
            onCreateSuccess(data);
        } else if (props.onChange) {
            props.onChange(data.id, null as any, null as any);
        }
    };

    return (
        <>
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
                dropdownRender={(menu) => (
                    <div>
                        {menu}
                        {showCreate && (
                            <div className="p-2 border-t border-gray-100">
                                <Button
                                    type="primary"
                                    className="w-full"
                                    onClick={() => setOpenCreate(true)}
                                >
                                    {messages('common.create')} {messages('newsCategory.label').toLowerCase()}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                {...props}
            />
            {showCreate && (
                <NewsCategoryFormModal
                    open={openCreate}
                    onCancel={() => setOpenCreate(false)}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}
        </>
    );
}
