import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { Link, useRouter } from '@/i18n/routing';
import { getArtistDetailRoute } from '@/modules/artist/helpers/link';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import {
    ARTIST_DETAIL_TABS,
    ARTIST_TABLE_KEY,
    TYPE_MODAL_ARTIST,
} from '../../enum';
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

    const { hasPermission } = usePermission();
    const canDelete = hasPermission(PERMISSION.ARTIST.DELETE);

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
        {
            title: messages('common.name'),
            key: 'name',
            dataIndex: ARTIST_TABLE_KEY.NAME,
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 280,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                ARTIST_TABLE_KEY.NAME
            ),
            render: (value, record) => (
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <CustomTooltip title={record?.name}>
                            <Link
                                href={getArtistDetailRoute(
                                    record?.id,
                                    ARTIST_DETAIL_TABS.OVERVIEW
                                )}
                                className="block min-w-0"
                            >
                                <Typography.Text className="block truncate hover:underline hover:underline-offset-2">
                                    {record?.name}
                                </Typography.Text>
                            </Link>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },

        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: ARTIST_TABLE_KEY.CODE,
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
            dataIndex: ARTIST_TABLE_KEY.ARTIST_PROFILES,
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
                            <CustomTooltip
                                key={item.id}
                                title={item?.dsp?.name}
                            >
                                <a href={item?.url} target="_blank">
                                    <Avatar
                                        src={item?.dsp?.picture}
                                        size={32}
                                    />
                                </a>
                            </CustomTooltip>
                        ))}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: messages('country.label'),
            key: 'country',
            dataIndex: ARTIST_TABLE_KEY.COUNTRY,
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
            dataIndex: ARTIST_TABLE_KEY.GENRE,
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
            dataIndex: ARTIST_TABLE_KEY.RELEASE_COUNT,
            align: 'center',
            width: 120,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                ARTIST_TABLE_KEY.RELEASE_COUNT
            ),
            render: (value, record) => (
                <p className="truncate">{record?.releaseCount}</p>
            ),
        },
        {
            title: messages('track.label'),
            key: 'trackCount',
            dataIndex: ARTIST_TABLE_KEY.TRACK_COUNT,
            align: 'center',
            width: 100,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                ARTIST_TABLE_KEY.TRACK_COUNT
            ),
            render: (value, record) => (
                <p className="truncate">{record?.trackCount}</p>
            ),
        },
        {
            title: messages('common.biography'),
            key: 'biography',
            dataIndex: ARTIST_TABLE_KEY.BIOGRAPHY,
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
                    showDelete={canDelete}
                    onShowUpdate={() => {
                        openModal(TYPE_MODAL_ARTIST.UPDATE, record);
                    }}
                    onShowDetail={() => {
                        nProgress.start();
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
            className={`rounded-t-lg ${props?.className}`}
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
