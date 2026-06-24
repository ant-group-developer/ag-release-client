import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE } from '@/enums/common';
import { getNameByLocale } from '@/helpers/string';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { Button, Card, Spin } from 'antd';
import { ColumnType } from 'antd/es/table';
import { RotateCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TYPE_MODAL_NEWS_CATEGORY } from '../../enums';
import { useBulkUpdateNewsCategory } from '../../hooks/use-bulk-update';
import { NewsCategoryData, NewsCategoryDataFilter } from '../../types';

type Props = Omit<SortableTableProps<NewsCategoryData>, 'columns'> & {
    headerTitle?: React.ReactNode;
    toolBarRender?: () => React.ReactNode[];
    options?:
        | {
              reload?: () => void;
              setting?: boolean;
              density?: boolean;
          }
        | boolean;
    dataFilter: NewsCategoryDataFilter;
    onChangeFilter?: OnChangeFilter<NewsCategoryDataFilter>;
    loading?: boolean;
};

const addIndexStr = (
    list: NewsCategoryData[],
    prefix = ''
): NewsCategoryData[] => {
    return list.map((item, index) => {
        const indexStr = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
        const newItem = {
            ...item,
            indexStr,
        };
        if (newItem.children && newItem.children.length > 0) {
            newItem.children = addIndexStr(newItem.children, indexStr);
        }
        return newItem;
    });
};

export default function NewsCategoryTable({
    headerTitle,
    toolBarRender,
    options,
    loading,
    dataFilter,
    onChangeFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { bulkUpdateNewsCategory } = useBulkUpdateNewsCategory();

    const dataWithIndex = useMemo(() => {
        return addIndexStr(props.dataSource || []);
    }, [props.dataSource]);

    const handleDragEnd: OnDragEnd<NewsCategoryData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        bulkUpdateNewsCategory({
            newsCategories: payload,
        });
    };

    const column: ColumnType<NewsCategoryData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
        },
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            render: (_, record) => (record as any).indexStr,
        },
        {
            title: `${messages('common.name')}`,
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 400,
            render: (value, record) => {
                const name = getNameByLocale(
                    record?.nameEn,
                    record?.nameVi,
                    locale
                );
                return (
                    <div className="flex items-center gap-2">
                        <CopyText
                            tooltipProps={{ placement: 'right' }}
                            text={name}
                        >
                            <p className="truncate font-medium text-gray-700">
                                {name}
                            </p>
                        </CopyText>
                    </div>
                );
            },
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            align: 'left',
            width: 600,
            ellipsis: true,
            render: (_, record) => {
                const description =
                    locale === LOCALE.VI
                        ? record?.descriptionVi
                        : record?.descriptionEn;
                return (
                    <CustomTooltip title={description}>
                        <span className="line-clamp-3 truncate whitespace-pre-line">
                            {description}
                        </span>
                    </CustomTooltip>
                );
            },
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_NEWS_CATEGORY.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_NEWS_CATEGORY.DELETE, record);
                    }}
                />
            ),
        },
    ];

    const expandedRowRender = (record: NewsCategoryData) => {
        if (!record.children || record.children.length === 0) return null;
        return (
            <div className="my-2 rounded-lg border border-gray-200">
                <SortableTable
                    dataSource={record.children}
                    columns={column}
                    pagination={false}
                    showHeader={false}
                    rowClassName={(rec) =>
                        rec.parentId ? 'group child-row' : 'group root-row'
                    }
                    onDragEnd={(newChildren) => {
                        const payload = newChildren.map((item, index) => ({
                            id: item.id,
                            order: index + 1,
                        }));
                        bulkUpdateNewsCategory({
                            newsCategories: payload,
                        });
                    }}
                    childrenColumnName="subCategories"
                    expandable={{
                        defaultExpandAllRows: true,
                        expandIconColumnIndex: 0,
                        columnWidth: 50,
                        rowExpandable: (rec) =>
                            !!rec.children && rec.children.length > 0,
                        expandedRowRender,
                    }}
                />
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
                <SortableTable
                    key="main"
                    {...props}
                    dataSource={dataWithIndex}
                    pagination={false}
                    columns={column}
                    rowClassName={(record) =>
                        record.parentId ? 'group child-row' : 'group root-row'
                    }
                    onDragEnd={handleDragEnd}
                    childrenColumnName="subCategories"
                    expandable={{
                        defaultExpandAllRows: true,
                        expandIconColumnIndex: 0,
                        columnWidth: 50,
                        rowExpandable: (record) =>
                            !!record.children && record.children.length > 0,
                        expandedRowRender,
                    }}
                />
            </Spin>
        </Card>
    );
}
