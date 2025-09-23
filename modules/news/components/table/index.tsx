import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import PopoverTags from '@/components/ui/tag/popover-tags';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { NEWS_STATUS, TYPE_MODAL_NEWS } from '../../enums';
import { NewsData, NewsDataFilter } from '../../types';

type Props = Omit<AppTableProps<NewsData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: NewsDataFilter;
};

export default function NewsTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

    const column: ColumnType<NewsData>[] = [
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
            title: `${messages('common.image')}`,
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            align: 'center',
            width: 100,
            render: (value, record) => {
                const src = record?.thumbnail;
                return (
                    <div className="flex items-center justify-center">
                        <ImageFallback
                            className="rounded-lg"
                            width={48}
                            height={48}
                            alt=""
                            src={src}
                        />
                    </div>
                );
            },
        },
        {
            title: `${messages('common.title')}`,
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 350,
            render: (value, record) => {
                const title = getNameByLocale(
                    record?.titleEn,
                    record?.titleVi,
                    locale
                );
                return (
                    <div className="flex cursor-pointer items-center gap-4">
                        <CustomTooltip title={title}>
                            <p className="truncate">{title}</p>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render: (_, record) => {
                const status =
                    record?.status === NEWS_STATUS.PUBLIC
                        ? messages('common.public')
                        : messages('common.private');
                const color =
                    record?.status === NEWS_STATUS.PUBLIC ? 'green' : 'blue';
                return <Tag color={color}> {status} </Tag>;
            },
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            align: 'left',
            width: 200,
            render: (_, record) => {
                return (
                    <PopoverTags tags={record?.keywords} maxVisibleTags={2} />
                );
            },
        },
        {
            title: messages('newsCategory.label'),
            key: 'newsCategory',
            dataIndex: 'newsCategory',
            align: 'left',
            width: 200,
            render: (_, record) => {
                const name =
                    locale === LOCALE?.VI
                        ? record?.newsCategory?.nameVi
                        : record?.newsCategory?.nameEn;
                return (
                    <CustomTooltip title={name}>
                        <span className="line-clamp-3 truncate whitespace-pre-line">
                            {name}
                        </span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: 'Slug',
            key: 'slug',
            dataIndex: 'slug',
            align: 'left',
            width: 250,
            ellipsis: true,
            render: (_, record) => {
                return (
                    <CustomTooltip title={record?.slug}>
                        <span className="truncate"> {record?.slug} </span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            align: 'left',
            width: 350,
            render: (_, record) => {
                const description =
                    locale === LOCALE?.VI
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
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 150,
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_NEWS.EDIT, record);
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_NEWS.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
}
