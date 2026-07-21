import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import ReleaseVideoCoverImage from '@/modules/release-video/components/image/release-video-cover-image';
import ReleaseStatusTag from '@/modules/releases/components/tag/release-status-tag';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { Tag, Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import {
    RELEASE_VIDEO_VISIBILITY,
    TYPE_MODAL_RELEASE_VIDEO,
} from '../../enums';

type Props = Omit<AppTableProps<ReleasesData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ReleasesDataFilter;
};

export const ReleaseVideoTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();

    const columns: ColumnType<ReleasesData>[] = [
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
        {
            title: messages('releaseVideo.fields.videoTitle'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            width: 480,
            sorter: true,
            fixed: 'left',
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'title'
            ),
            render: (value, record) => {
                const detailUrl = `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`;
                const releaseArtists = record.releaseArtists || [];
                const isVariousArtist = record.isVariousArtist;

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
                    <div className="flex items-center gap-4 pr-2">
                        <Link href={detailUrl}>
                            <div className="aspect-[16/9] w-[140px]">
                                <ReleaseVideoCoverImage
                                    width={140}
                                    data={record}
                                />
                            </div>
                        </Link>
                        <div className="flex flex-col gap-1 truncate">
                            <div className="flex items-center gap-1">
                                <Tooltip title={fullTitle}>
                                    <Link href={detailUrl} className="truncate">
                                        <span className="cursor-pointer font-medium hover:underline">
                                            {fullTitle}
                                        </span>
                                    </Link>
                                </Tooltip>
                                <span
                                    className="inline-block align-middle"
                                    data-stop-row-click="true"
                                >
                                    <Typography.Text />
                                </span>
                            </div>
                            {record.video?.channel?.name && (
                                <div
                                    className="truncate text-xs"
                                    data-stop-row-click="true"
                                >
                                    <Tooltip
                                        title={messages('common.viewOnYoutube')}
                                    >
                                        <a
                                            href={`https://www.youtube.com/channel/${record.video.channel.youtubeChannelId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            <Typography.Text
                                                type="secondary"
                                                className="truncate"
                                            >
                                                {record.video.channel.name}
                                            </Typography.Text>
                                        </a>
                                    </Tooltip>
                                </div>
                            )}
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
            width: 200,
            ellipsis: true,
            render: (value, record) => {
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
            width: 200,
            render: (value: RELEASE_VIDEO_VISIBILITY) => {
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

                if (!value) return '-';

                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 200,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
            },
        },
        {
            title: messages('common.youtubeId'),
            key: 'youtubeId',
            dataIndex: ['video', 'externalId'],
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (value) => {
                if (!value) return '-';
                return (
                    <div className="flex items-center gap-1">
                        <Tooltip title={messages('common.viewOnYoutube')}>
                            <a
                                href={`https://www.youtube.com/watch?v=${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-blue-500 hover:underline"
                            >
                                {value}
                            </a>
                        </Tooltip>
                        <span
                            className="inline-block align-middle"
                            data-stop-row-click="true"
                        >
                            <Typography.Text
                                copyable={{
                                    text: value,
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
            ellipsis: true,
            render: (value) => value || '-',
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
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value) => <span>{formattedDate(value)}</span>,
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <PermissionGate permission={PERMISSION.RELEASE_VIDEO.UPDATE}>
                    <ActionButton
                        showDelete
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_RELEASE_VIDEO.DELETE, record)
                        }
                        showUpdate
                        onShowUpdate={() => {
                            nProgress.start();
                            router.push(
                                `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`
                            );
                        }}
                    />
                </PermissionGate>
            ),
        },
    ];

    return <AppTable {...props} pagination={false} columns={columns} />;
};
