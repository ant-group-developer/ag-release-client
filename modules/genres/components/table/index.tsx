import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
// import { TYPE_MODAL_GENRES } from '../../enums';
import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { TYPE_MODAL_GENRES } from '../../enums';
import { GenresData, GenresDataFilter } from '../../types';

// Table cho Genres

type Props = Omit<AppTableProps<GenresData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: GenresDataFilter;
};

export const GenresTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<GenresData>[] = [
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
        // {
        //     title: '',
        //     key: 'picture',
        //     dataIndex: 'picture',
        //     align: 'center',
        //     width: 48,
        //     render: (value) => (
        //         <div className="flex justify-center">
        //             <ImageFallback
        //                 fallbackSrc={FALLBACK_IMAGE}
        //                 src={value ?? ''}
        //                 alt="genre"
        //                 width={48}
        //                 height={48}
        //                 className="aspect-square rounded-lg object-cover"
        //             />
        //         </div>
        //     ),
        // },
        {
            title: messages('genres.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={value}
                    >
                        <p className="truncate">{value}</p>
                    </CopyText>
                </div>
            ),
        },
        {
            title: messages('common.value'),
            key: 'value',
            dataIndex: 'value',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            align: 'left',
            width: 300,
            ellipsis: true,
            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
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
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_GENRES.DELETE, record)
                    }
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_GENRES.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
};
