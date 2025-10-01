import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import NewsCategorySelect from '@/components/ui/select/news-category-select';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Link } from '@/i18n/routing';
import { ProColumns } from '@ant-design/pro-components';
import { Select, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { NEWS_STATUS, TYPE_MODAL_NEWS } from '../../enums';
import { NewsData, NewsDataFilter } from '../../types';

type Props = Omit<AppProTableProps<NewsData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: NewsDataFilter;
};

export default function NewsTablePro({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const locale = useLocale();

    // const { isSystemTenant } = useAuth();
    // const { hasPermission } = usePermission();

    const column: ProColumns<NewsData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            search: false,
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        // {
        //     title: `${messages('common.image')}`,
        //     key: 'thumbnail',
        //     dataIndex: 'thumbnail',
        //     align: 'center',
        //     width: 50,

        //     render: (value, record) => {
        //         const src = record?.thumbnail;
        //         return (
        //             <div className="flex items-center justify-center">
        //                 <ImageFallback
        //                     className="rounded-lg"
        //                     width={48}
        //                     height={48}
        //                     alt=""
        //                     src={src}
        //                 />
        //             </div>
        //         );
        //     },
        // },
        {
            title: `${messages('common.title')}`,
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 700,
            fieldProps: {
                placeholder: '',
            },
            render: (value, record) => {
                const src = record?.thumbnail;
                return (
                    // <CustomTooltip title={title}>
                    //     <Link href={`news/${record?.slug}`}>
                    //         <span className="truncate hover:text-blue-500 hover:underline">
                    //             {title}
                    //         </span>
                    //     </Link>
                    // </CustomTooltip>
                    <div className="flex gap-2">
                        <ImageFallback
                            className="rounded-lg"
                            width={80}
                            height={80}
                            alt=""
                            src={src}
                        />
                        <div className="flex max-w-[650px] flex-1 flex-col">
                            <Link href={`news/${record?.slug}`}>
                                <Typography.Text
                                    className="font-semibold hover:text-blue-500 hover:underline"
                                    ellipsis={{ tooltip: true }}
                                >
                                    {record?.title}
                                </Typography.Text>
                            </Link>
                            <Typography.Text ellipsis>
                                {record?.description}
                            </Typography.Text>
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 150,
            fieldProps: {
                placeholder: '',
            },
            renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
                const options = [
                    {
                        label: messages('common.public'),
                        value: NEWS_STATUS.PUBLIC,
                    },
                    {
                        label: messages('common.private'),
                        value: NEWS_STATUS.PRIVATE,
                    },
                ];
                return <Select options={options} {...rest} />;
            },
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
            width: 150,
            valueType: 'select',
            valueEnum: {},
            fieldProps: {
                placeholder: '',
            },
            renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
                return <NewsCategorySelect {...rest} />;
            },
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
            fieldProps: {
                placeholder: '',
            },
            search: false,
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
            width: 200,
            fieldProps: {
                placeholder: '',
            },
            search: false,
            render: (value, record) => {
                return (
                    <span className="truncate text-wrap">
                        {' '}
                        {formattedDate(record?.createdAt)}{' '}
                    </span>
                );
            },
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
            width: 100,
            fixed: 'right',
            search: false,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    // showAddTranslate
                    showTranslation
                    onShowTranslation={() =>
                        openModal(TYPE_MODAL_NEWS.TRANSLATE_LIST, record)
                    }
                    // onShowAddTranslate={() =>
                    //     openModal(TYPE_MODAL_NEWS.ADD_TRANSLATE, record)
                    // }
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
        <AppProTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group'}
        />
    );
}
