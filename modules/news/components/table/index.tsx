import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
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
            width: 50,
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
            width: 300,
            render: (value, record) => {
                const title = getNameByLocale(
                    record?.titleEn,
                    record?.titleVi,
                    locale
                );
                return (
                    <CustomTooltip title={title}>
                        <Link href={`news/${record?.slug}`}>
                            <span className="truncate hover:text-blue-500 hover:underline">
                                {title}
                            </span>
                        </Link>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 50,
            render: (_, record) => {
                const status =
                    record?.status === NEWS_STATUS.PUBLIC
                        ? messages('common.public')
                        : messages('common.private');
                return <span> {status} </span>;
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
                        <span className="truncate">{name}</span>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.creator'),
            key: 'creator',
            dataIndex: 'creator',
            align: 'left',
            width: 150,
            render: (value, record) => (
                <CustomTooltip title={record?.creator?.email}>
                    <span className="truncate">{record?.creator?.email}</span>
                </CustomTooltip>
            ),
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
