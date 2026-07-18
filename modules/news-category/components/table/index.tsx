import { LOCALE } from '@/enums/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { Button, Card, Space, Spin, Tooltip, Tree, theme } from 'antd';
import { Pencil, Plus, RotateCw, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TYPE_MODAL_NEWS_CATEGORY } from '../../enums';
import { useBulkUpdateNewsCategory } from '../../hooks/use-bulk-update';
import { NewsCategoryData, NewsCategoryDataFilter } from '../../types';

type Props = {
    headerTitle?: React.ReactNode;
    toolBarRender?: () => React.ReactNode[];
    options?:
        | {
              reload?: () => void;
              setting?: boolean;
              density?: boolean;
          }
        | boolean;
    dataSource: NewsCategoryData[];
    loading?: boolean;
    dataFilter: NewsCategoryDataFilter;
    onChangeFilter?: (filter: NewsCategoryDataFilter) => void;
};

export default function NewsCategoryTable({
    headerTitle,
    toolBarRender,
    options,
    loading,
    dataSource,
    dataFilter,
    onChangeFilter,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { bulkUpdateNewsCategory } = useBulkUpdateNewsCategory();

    const formatTreeData = (list: NewsCategoryData[], depth = 0): any[] => {
        return list.map((item) => {
            const formattedItem: any = {
                ...item,
                key: item.id,
                depth,
                title: getNameByLocale(item.nameEn, item.nameVi, locale),
            };
            if (item.children && item.children.length > 0) {
                formattedItem.children = formatTreeData(
                    item.children,
                    depth + 1
                );
            }
            return formattedItem;
        });
    };

    const treeData = useMemo(() => {
        return formatTreeData(dataSource || []);
    }, [dataSource, locale]);

    const handleDrop: TreeProps['onDrop'] = (info) => {
        const dropKey = info.node.key as string;
        const dragKey = info.dragNode.key as string;
        const dropPos = info.node.pos.split('-');
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const data = JSON.parse(JSON.stringify(dataSource || []));

        let dragObj: NewsCategoryData | undefined;
        const removeNode = (list: NewsCategoryData[], id: string): boolean => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    dragObj = list[i];
                    list.splice(i, 1);
                    return true;
                }
                if (list[i].children) {
                    if (removeNode(list[i].children!, id)) {
                        return true;
                    }
                }
            }
            return false;
        };
        removeNode(data, dragKey);

        if (!dragObj) return;

        if (!info.dropToGap) {
            const insertAsChild = (
                list: NewsCategoryData[],
                id: string
            ): boolean => {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === id) {
                        list[i].children = list[i].children || [];
                        list[i].children!.unshift(dragObj!);
                        return true;
                    }
                    if (list[i].children) {
                        if (insertAsChild(list[i].children!, id)) {
                            return true;
                        }
                    }
                }
                return false;
            };
            insertAsChild(data, dropKey);
        } else {
            const insertInGap = (
                list: NewsCategoryData[],
                id: string
            ): boolean => {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === id) {
                        if (dropPosition === -1) {
                            list.splice(i, 0, dragObj!);
                        } else {
                            list.splice(i + 1, 0, dragObj!);
                        }
                        return true;
                    }
                    if (list[i].children) {
                        if (insertInGap(list[i].children!, id)) {
                            return true;
                        }
                    }
                }
                return false;
            };
            insertInGap(data, dropKey);
        }

        const payload: {
            id: string;
            order: number;
            parentId: string | null;
        }[] = [];
        const traverse = (
            list: NewsCategoryData[],
            parentId: string | null
        ) => {
            list.forEach((item, index) => {
                payload.push({
                    id: item.id,
                    order: index + 1,
                    parentId: parentId,
                });
                if (item.children && item.children.length > 0) {
                    traverse(item.children, item.id);
                }
            });
        };
        traverse(data, null);

        bulkUpdateNewsCategory({
            newsCategories: payload,
        });
    };

    const titleRender = (node: any) => {
        const name = getNameByLocale(node.nameEn, node.nameVi, locale);
        const description =
            locale === LOCALE.VI ? node.descriptionVi : node.descriptionEn;

        return (
            <div className="flex h-8 w-full items-center justify-between">
                <div className="flex h-full min-w-0 flex-grow items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap pl-2">
                    <span className="text-sm font-medium text-gray-700">
                        {name}
                    </span>
                </div>

                <div className="flex h-full w-[300px] min-w-0 flex-shrink-0 items-center overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-sm">
                    {description || '-'}
                </div>

                <Space
                    align="center"
                    className="h-full w-[156px] flex-shrink-0 justify-end pr-2"
                >
                    <Tooltip title={messages('common.create')}>
                        <Button
                            type="text"
                            size="small"
                            icon={<Plus size={14} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal(TYPE_MODAL_NEWS_CATEGORY.CREATE, {
                                    parentId: node.id,
                                });
                            }}
                            className="flex items-center justify-center text-gray-500 hover:text-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title={messages('common.update')}>
                        <Button
                            type="text"
                            size="small"
                            icon={<Pencil size={14} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal(TYPE_MODAL_NEWS_CATEGORY.EDIT, node);
                            }}
                            className="flex items-center justify-center text-gray-500 hover:text-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title={messages('common.delete')}>
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<Trash2 size={14} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal(
                                    TYPE_MODAL_NEWS_CATEGORY.DELETE,
                                    node
                                );
                            }}
                            className="flex items-center justify-center"
                        />
                    </Tooltip>
                </Space>
            </div>
        );
    };

    return (
        <Card
            bordered={false}
            bodyStyle={{ padding: 0 }}
            className="rounded-md shadow-sm [&_.ant-card-head]:!px-4 [&_.ant-card-head]:!py-2"
            title={headerTitle}
            extra={
                <div className="flex items-center gap-3">
                    {toolBarRender && toolBarRender()}
                    {options &&
                        typeof options === 'object' &&
                        options.reload && (
                            <Button
                                type="text"
                                icon={<RotateCw size={16} />}
                                onClick={options.reload}
                                className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
                            />
                        )}
                </div>
            }
        >
            <Spin spinning={loading}>
                <div className="flex flex-col">
                    <div className="p-4">
                        <div
                            style={{
                                backgroundColor: token.colorFillAlter,
                                borderBottomColor: token.colorBorderSecondary,
                            }}
                            className="mb-2 flex h-10 w-full items-center rounded-t-md border-b px-4 font-semibold"
                        >
                            {/* Column 1: Name */}
                            <div className="flex-grow pl-[48px]">
                                {messages('newsCategory.name')}
                            </div>
                            {/* Column 2: Description */}
                            <div className="w-[300px] flex-shrink-0 pl-2">
                                {messages('common.description')}
                            </div>
                            {/* Column 3: Action */}
                            <div className="w-[156px] flex-shrink-0 pr-6 text-right">
                                {messages('common.action')}
                            </div>
                        </div>

                        <Tree
                            className="news-category-tree w-full"
                            key={
                                dataSource?.length
                                    ? `tree-${dataSource.length}`
                                    : 'tree-empty'
                            }
                            draggable
                            blockNode
                            showLine={{ showLeafIcon: false }}
                            treeData={treeData}
                            onDrop={handleDrop}
                            titleRender={titleRender}
                            defaultExpandAll
                            switcherIcon={(nodeProps: any) => {
                                if (nodeProps.isLeaf) return null;
                                return nodeProps.expanded ? (
                                    <DownOutlined style={{ fontSize: 10 }} />
                                ) : (
                                    <RightOutlined style={{ fontSize: 10 }} />
                                );
                            }}
                        />
                    </div>
                </div>
            </Spin>
        </Card>
    );
}
