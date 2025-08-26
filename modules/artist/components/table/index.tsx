import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getArtistDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { ARTIST_DETAIL_TABS, TYPE_MODAL_ARTIST } from '../../enum';
import { ArtistData, ArtistDataFilter } from '../../types';

type Props = Omit<AppTableProps<ArtistData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ArtistDataFilter;
};

export const ArtistsTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const column: ColumnType<ArtistData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        // {
        //     key: 'picture',
        //     dataIndex: 'picture',
        //     align: 'center',
        //     width: 30,
        //     fixed: 'left',
        //     render: (value, record) => (
        //         <div
        //             className="flex items-center justify-center"
        //             onClick={() => {
        //                 router.push(`/artists/detail/${record.id}/overview`);
        //             }}
        //         >
        //             <ImageFallback
        //                 fallbackSrc={FALLBACK_IMAGE}
        //                 src={value ?? ''}
        //                 alt="genre"
        //                 width={48}
        //                 height={48}
        //                 className="aspect-square rounded-full object-cover"
        //             />
        //         </div>
        //     ),
        // },
        {
            title: messages('artist.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 300,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div
                        className="flex-shrink-0"
                        // onClick={() => {
                        //     router.push(
                        //         `/artists/detail/${record.id}/overview`
                        //     );
                        // }}
                    >
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-full object-cover"
                        />
                    </div>
                    <CustomTooltip
                        placement="right"
                        title={messages('common.viewDetail')}
                    >
                        <Link
                            href={getArtistDetailRoute(
                                record?.id,
                                ARTIST_DETAIL_TABS.OVERVIEW
                            )}
                        >
                            <p className="truncate hover:text-blue-500">
                                {value}
                            </p>
                        </Link>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('artist.id'),
            key: 'id',
            dataIndex: 'id',
            align: 'center',
            width: 120,
            render: (value) => (
                <div className="flex justify-center">
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
            title: messages('artist.profiles'),
            key: 'artistProfiles',
            dataIndex: 'artistProfiles',
            width: 200,
            render: (_, record) => (
                <div>
                    <Avatar.Group
                        max={{
                            count: 5,
                            style: { backgroundColor: '#ccc' },
                        }}
                    >
                        {record?.artistProfiles?.map((item) => (
                            <Avatar key={item.id} src={item?.dsp?.picture} />
                        ))}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: messages('releases.count'),
            key: 'releaseCount',
            dataIndex: 'releaseCount',
            align: 'center',
            width: 120,
            render: (value) => <p className="truncate">{value}</p>,
        },
        {
            title: messages('tracks.count'),
            key: 'trackCount',
            dataIndex: 'trackCount',
            align: 'center',
            width: 100,
            render: (value) => <p className="truncate">{value}</p>,
        },
        {
            title: messages('common.biography'),
            key: 'biography',
            dataIndex: 'biography',
            align: 'left',
            width: 300,
            render: (value, record) => {
                return (
                    <span className="line-clamp-3 whitespace-pre-line">
                        {value}
                    </span>
                );
            },
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
                    {' '}
                    {formattedDate(value)}{' '}
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
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDetail
                    // showDelete
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_ARTIST.UPDATE, record);
                    }}
                    // onShowDelete={() => {
                    //     openModal(TYPE_MODAL_ARTIST.DELETE, record);
                    // }}
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
