import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import { DATE_FORMAT, SCREEN } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Link } from '@/i18n/routing';
import ReleaseVideoCoverImage from '@/modules/release-video/components/image/release-video-cover-image';
import ReleaseStatusTag from '@/modules/releases/components/tag/release-status-tag';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Tag, Tooltip, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { RELEASE_VIDEO_VISIBILITY } from '../../enums';
import { ReleaseVideoChannelActions } from './release-video-channel-actions';

type Props = Omit<AppProTableProps<ReleasesData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ReleasesDataFilter;
};

export const ReleaseVideoTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const isMobile = useIsMobile();

    const columns: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: isMobile ? 50 : 60,
            align: 'center',
            fixed: isMobile ? undefined : 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('releaseVideo.fields.videoTitle'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: isMobile ? 300 : 360,
            sorter: true,
            fixed: isMobile ? undefined : 'left',
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'title'
            ),
            render: (_, record) => {
                const detailUrl = `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`;
                const releaseArtists = record.releaseArtists || [];
                const isVariousArtist = record.isVariousArtist;
                const value = record.title;

                const artistName = releaseArtists
                    .map((item) => item?.artist?.name)
                    .filter(Boolean)
                    .join(', ');

                const displayName = isVariousArtist
                    ? messages('common.variousArtists')
                    : artistName;

                const fullTitle = displayName
                    ? `${displayName} - ${value}`
                    : value;

                return (
                    <div className="flex min-w-0 items-center gap-3">
                        <Link href={detailUrl} className="shrink-0">
                            <div className="aspect-[16/9] w-[140px] shrink-0">
                                <ReleaseVideoCoverImage
                                    width={140}
                                    data={record}
                                />
                            </div>
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
                            <div className="max-w-[130px] truncate sm:max-w-[190px]">
                                <Tooltip title={fullTitle}>
                                    <Link href={detailUrl}>
                                        <Typography.Text
                                            ellipsis
                                            className="cursor-pointer font-medium hover:underline"
                                        >
                                            {fullTitle}
                                        </Typography.Text>
                                    </Link>
                                </Tooltip>
                            </div>
                            <div className="max-w-[130px] truncate sm:max-w-[190px]">
                                <ReleaseVideoChannelActions record={record} />
                            </div>
                        </div>
                    </div>
                );
            },
        },
        // {
        //     title: messages('releaseVideo.fields.genre'),
        //     key: 'primaryGenre',
        //     dataIndex: 'primaryGenre',
        //     width: 160,
        //     render: (_, record) => {
        //         const genre = record.primaryGenre?.name;
        //         // return genre ? <PopoverTags tags={[genre]} /> : '-';
        //         return <span>{genre}</span>;
        //     },
        // },
        {
            title: 'ISRC',
            key: 'ISRC',
            dataIndex: ['video', 'isrc'],
            align: 'left',
            width: 150,
            render: (_, record) => {
                const value = record.video?.isrc;
                if (!value) return '-';
                return (
                    <Typography.Text copyable={{ tooltips: false }}>
                        {value}
                    </Typography.Text>
                );
            },
        },

        {
            title: messages('releaseVideo.fields.visibility'),
            key: 'visibility',
            dataIndex: ['video', 'visibility'],
            align: 'left',
            width: 150,
            render: (_, record) => {
                const value = record.video
                    ?.visibility as RELEASE_VIDEO_VISIBILITY;
                if (!value) return '-';

                const config = {
                    [RELEASE_VIDEO_VISIBILITY.DEFAULT]: {
                        label: messages(
                            'releaseVideo.fields.visibilityDefault'
                        ),
                        color: 'default',
                    },
                    [RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_YOUTUBE]: {
                        label: messages(
                            'releaseVideo.fields.unlistedOnYoutube'
                        ),
                        color: 'blue',
                    },
                    [RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_VEVO]: {
                        label: messages('releaseVideo.fields.unlistedOnVevo'),
                        color: 'green',
                    },
                    [RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_YOUTUBE_VEVO]: {
                        label: messages(
                            'releaseVideo.fields.unlistedOnYoutubeVevo'
                        ),
                        color: 'purple',
                    },
                }[value] || {
                    label: value,
                    color: 'default',
                };

                return (
                    <Tooltip title={config.label}>
                        <Tag
                            color={config.color}
                            className="m-0 inline-flex max-w-[120px] items-center truncate align-middle"
                        >
                            <span className="truncate">{config.label}</span>
                        </Tag>
                    </Tooltip>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 150,
            render: (_, record) => {
                return (
                    <ReleaseStatusTag
                        status={record?.status}
                        className="m-0 align-middle"
                    />
                );
            },
        },
        {
            title: messages('common.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'left',
            width: 160,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'releaseDate'
            ),
            render: (_, record) => {
                if (!record?.releaseDate) return '-';
                const dateStr = formattedDate(
                    record.releaseDate,
                    DATE_FORMAT.DATE_ONLY
                );
                return (
                    <span className="truncate">
                        {record?.releaseTime
                            ? `${record.releaseTime} ${dateStr}`
                            : dateStr}
                    </span>
                );
            },
        },
        {
            title: messages('common.youtubeId'),
            key: 'youtubeId',
            dataIndex: ['video', 'externalId'],
            align: 'left',
            width: 200,
            render: (_, record) => {
                const value = record.video?.externalId;
                if (!value) return '-';
                return (
                    <div className="flex items-center gap-1">
                        <Tooltip title={messages('common.viewOnYoutube')}>
                            <Typography.Link
                                href={`https://www.youtube.com/watch?v=${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate"
                            >
                                {value}
                            </Typography.Link>
                        </Tooltip>
                        <span
                            className="inline-block align-middle"
                            data-stop-row-click="true"
                        >
                            <Typography.Text
                                copyable={{
                                    text: String(value),
                                    tooltips: false,
                                }}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            dataIndex: ['tenant', 'name'],
            align: 'left',
            width: 200,
            render: (_, record) => {
                const tenantName = record.tenant?.name;
                if (!tenantName) return '-';

                return (
                    <div className="flex items-center gap-2">
                        <span className="min-w-0 break-words">
                            {tenantName}
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('common.creator'),
            key: 'creator',
            dataIndex: 'creator',
            align: 'left',
            width: 200,
            render: (_, record) => {
                const creatorName =
                    record.creator?.name || record.creator?.email;

                if (!creatorName) return '-';

                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            className="shrink-0"
                            src={record.creator?.avatar}
                        />
                        <span className="min-w-0 break-words">
                            {creatorName}
                        </span>
                    </div>
                );
            },
        },

        // {
        //     title: messages('common.createdAt'),
        //     key: 'createdAt',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 140,
        //     sorter: true,
        //     sortOrder: getSortOrder(
        //         dataFilter.orderBy,
        //         dataFilter.fieldOrder,
        //         'createdAt'
        //     ),
        //     render: (value) => <span>{formattedDate(value)}</span>,
        // },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'left',
            width: 200,
            sorter: true,
            fixed: isMobile ? undefined : 'right',
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (_, record) => (
                <span>{formattedDate(record.updatedAt)}</span>
            ),
        },
        // {
        //     title: '',
        //     key: 'action',
        //     dataIndex: '',
        //     width: 80,
        //     align: 'center',
        //     fixed: 'right',
        //     render: (_, record) => (
        //         <PermissionGate permission={PERMISSION.RELEASE_VIDEO.UPDATE}>
        //             <ActionButton
        //                 showDelete
        //                 onShowDelete={() =>
        //                     openModal(TYPE_MODAL_RELEASE_VIDEO.DELETE, record)
        //                 }
        //                 showUpdate
        //                 onShowUpdate={() => {
        //                     nProgress.start();
        //                     router.push(
        //                         `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`
        //                     );
        //                 }}
        //             />
        //         </PermissionGate>
        //     ),
        // },
    ];

    return (
        <AppProTable
            columnsState={{
                persistenceKey: 'release-video-table-columns',
                persistenceType: 'sessionStorage',
                defaultValue: {
                    workspace: { show: false },
                },
                ...props.columnsState,
            }}
            {...props}
            scroll={{
                x: isMobile ? 'max-content' : SCREEN.XL,
                ...props.scroll,
            }}
            pagination={false}
            columns={columns}
            rowClassName={'group cursor-pointer'}
            search={false}
        />
    );
};
