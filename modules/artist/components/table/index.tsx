import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { getIndex, getSortOrder } from '@/helpers/common';
import { getArtistDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { ARTIST_DETAIL_TABS, TYPE_MODAL_ARTIST } from '../../enum';
import { ArtistData, ArtistDataFilter } from '../../types';

type Props = Omit<AppProTableProps<ArtistData>, 'columns'> & {
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
    const { token } = theme.useToken();

    const { isSystemTenant } = useAuth();
    const { hasPermission } = usePermission();

    const column: ProColumns<ArtistData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            fixed: 'left',
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
            width: 280,
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
                                {record?.name}
                            </p>
                        </Link>
                    </CustomTooltip>
                </div>
            ),
        },
        // {
        //     title: messages('artist.id'),
        //     key: 'id',
        //     dataIndex: 'id',
        //     align: 'center',
        //     width: 120,
        //     render: (value) => (
        //         <div className="flex justify-center">
        //             <CopyText
        //                 tooltipProps={{ placement: 'right' }}
        //                 text={value}
        //             >
        //                 <p className="truncate">{value}</p>
        //             </CopyText>
        //         </div>
        //     ),
        // },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            render: (value, record) => (
                <CopyText
                    tooltipProps={{ placement: 'right' }}
                    text={record?.code}
                >
                    <p className="truncate">{record?.code}</p>
                </CopyText>
            ),
        },
        {
            title: messages('artist.profiles'),
            key: 'artistProfiles',
            dataIndex: 'artistProfiles',
            width: 180,
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
            title: messages('country.label'),
            key: 'country',
            dataIndex: 'country',
            align: 'left',
            width: 180,
            ellipsis: true,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'country'
            // ),
            render: (value, record) => (
                <p className="truncate">{record?.country?.name}</p>
            ),
        },
        {
            title: messages('genre.label'),
            key: 'genre',
            dataIndex: 'genre',
            align: 'left',
            width: 180,
            ellipsis: true,
            // sorter: true,
            // sortOrder: getSortOrder(
            //     dataFilter.orderBy,
            //     dataFilter.fieldOrder,
            //     'genre'
            // ),
            render: (value, record) => (
                <p className="truncate">{record?.genre?.name}</p>
            ),
        },
        {
            title: messages('release.label'),
            key: 'releaseCount',
            dataIndex: 'release_count',
            align: 'center',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'release_count'
            ),
            render: (value, record) => (
                <p className="truncate">{record?.releaseCount}</p>
            ),
        },
        {
            title: messages('track.label'),
            key: 'trackCount',
            dataIndex: 'track_count',
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'track_count'
            ),
            render: (value, record) => (
                <p className="truncate">{record?.trackCount}</p>
            ),
        },
        {
            title: messages('common.biography'),
            key: 'biography',
            dataIndex: 'biography',
            align: 'left',
            width: 210,
            render: (value, record) => {
                return (
                    <span className="line-clamp-3 whitespace-pre-line">
                        {record?.biography}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate={hasPermission(PERMISSION.ARTIST.UPDATE)}
                    showDetail
                    showDelete={isSystemTenant}
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_ARTIST.UPDATE, record);
                    }}
                    onShowDetail={() => {
                        router.push(
                            getArtistDetailRoute(
                                record?.id,
                                ARTIST_DETAIL_TABS.OVERVIEW
                            )
                        );
                    }}
                    onShowDelete={() => {
                        openModal(TYPE_MODAL_ARTIST.DELETE, record);
                    }}
                />
            ),
        },
    ];

    return (
        <AppProTable
            {...props}
            className={`rounded-t-lg px-4 ${props?.className}`}
            style={{
                backgroundColor: token.colorBgContainer,
                ...props?.style,
            }}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
            search={false}
        />
    );
};
