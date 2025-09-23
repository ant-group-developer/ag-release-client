import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE } from '@/enums/common';
import { getIndex } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_NEWS_CATEGORY } from '../../enums';
import { useBulkUpdateNewsCategory } from '../../hooks/use-bulk-update';
import { NewsCategoryData, NewsCategoryDataFilter } from '../../types';

type Props = Omit<SortableTableProps<NewsCategoryData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: NewsCategoryDataFilter;
};

export default function NewsCategoryTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();
    const { bulkUpdateNewsCategory } = useBulkUpdateNewsCategory();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

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
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
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
                    <div className="flex items-center gap-4">
                        <CopyText
                            tooltipProps={{ placement: 'right' }}
                            text={name}
                        >
                            <p className="truncate">{name}</p>
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
        // {
        //     title: messages('common.createdAt'),
        //     key: 'createdAt',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 70,
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'createdAt'
        //     ),
        // },
        // {
        //     title: messages('common.updatedAt'),
        //     key: 'updatedAt',
        //     dataIndex: 'updatedAt',
        //     align: 'center',
        //     width: 70,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'updatedAt'
        //     ),
        //     render: (value) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        // },
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

    return (
        <div className="w-full">
            <SortableTable
                key="main"
                {...props}
                pagination={false}
                columns={column}
                rowClassName={'group'}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
}
