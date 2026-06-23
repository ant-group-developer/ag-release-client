import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import PopoverTags from '@/components/ui/tag/popover-tags';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import ReleaseStatusTag from '@/modules/releases/components/tag/release-status-tag';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_RELEASE_VIDEO } from '../../enums';

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
    const { Text } = Typography;

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
            width: 320,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'title'
            ),
            render: (value, record) => {
                const detailUrl = `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`;
                return (
                    <div className="flex items-center gap-4">
                        <Link href={detailUrl}>
                            <div className="h-14 min-w-14">
                                <ReleaseCoverImage data={record} />
                            </div>
                        </Link>
                        <div className="flex flex-col truncate">
                            <div className="flex items-center gap-1">
                                <Link href={detailUrl} className="truncate">
                                    <span className="cursor-pointer font-medium hover:underline">
                                        {value}
                                    </span>
                                </Link>
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
                            {record.video?.channel && (
                                <span className="truncate text-xs text-gray-500">
                                    {record.video.channel}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: messages('releaseVideo.fields.primaryArtists'),
            key: 'releaseArtists',
            dataIndex: 'releaseArtists',
            width: 220,
            render: (value: ReleasesData['releaseArtists']) => {
                const artists =
                    value
                        ?.map((artist) => artist.artist?.name)
                        .filter((name): name is string => !!name) || [];

                return artists.length ? <PopoverTags tags={artists} /> : '-';
            },
        },
        {
            title: messages('releaseVideo.fields.genre'),
            key: 'primaryGenre',
            dataIndex: 'primaryGenre',
            width: 160,
            render: (_, record) => {
                const genre = record.primaryGenre?.name;
                // return genre ? <PopoverTags tags={[genre]} /> : '-';
                return <span>{genre}</span>;
            },
        },
        {
            title: 'ISRC',
            key: 'ISRC',
            dataIndex: 'ISRC',
            align: 'center',
            width: 180,
            ellipsis: true,
            render: (value, record) => {
                if (!record?.isrc) return '-';
                return (
                    <Typography.Text copyable={{ tooltips: false }}>
                        {record?.isrc}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
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
            align: 'center',
            width: 140,
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
            render: (_, record) => (
                <PermissionGate permission={PERMISSION.RELEASE_VIDEO.UPDATE}>
                    <ActionButton
                        showDelete
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_RELEASE_VIDEO.DELETE, record)
                        }
                        showUpdate
                        onShowUpdate={() =>
                            router.push(
                                `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`
                            )
                        }
                    />
                </PermissionGate>
            ),
        },
    ];

    return <AppTable {...props} pagination={false} columns={columns} />;
};
