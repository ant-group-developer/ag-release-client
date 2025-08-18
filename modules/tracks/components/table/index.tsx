import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getTrackDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import TrackActionButton from '@/modules/releases/components/release-detail/release-tracks/button/track-action';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TRACK_TABS, TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { SearchCheck, SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TrackData, TrackDataFilter } from '../../types';
import TrackCoverArt from './trackCoverArt';

type Props = Omit<AppTableProps<TrackData>, 'columns'> & {
    dataFilter: TrackDataFilter;
    visibleColumns: TRACKS_COLUMNS_DISPLAY[];
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function TracksTable({
    dataFilter,
    visibleColumns,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();
    const column: ColumnType<TrackData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('tracks.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 150,
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <TrackCoverArt trackData={record} />
                    <CustomTooltip
                        title={messages('common.viewDetail')}
                        placement="right"
                    >
                        <Link
                            href={getTrackDetailRoute(
                                record?.id,
                                TRACK_TABS.METADATA
                            )}
                        >
                            <p className="truncate hover:cursor-pointer hover:text-blue-500 hover:underline">
                                {record?.title}
                            </p>
                        </Link>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('releases.version'),
            key: 'version',
            dataIndex: 'version',
            align: 'left',
            width: 50,
            render: (value, record) => {
                return <span className="truncate"> {record.version} </span>;
            },
        },
        {
            title: messages('tracks.id'),
            key: 'id',
            dataIndex: 'id',
            align: 'center',
            width: 60,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'trackArtists',
            dataIndex: 'trackArtists',
            align: 'left',
            ellipsis: true,
            width: 100,
            render: (value, record) => {
                const trackArtist = record?.trackArtists ?? [];
                const mainArtist = trackArtist?.find(
                    (item: TrackArtistData) =>
                        item.artistRole?.code?.toLowerCase() ===
                        MAIN_ARTIST_ROLE
                );
                return (
                    // <CustomTooltip size="small" title={value}>
                    <span className="truncate">
                        {mainArtist && mainArtist?.artist?.name}
                    </span>
                    // </CustomTooltip>
                );
            },
        },

        {
            title: 'ISRC',
            key: 'isrc',
            dataIndex: 'isrc',
            align: 'left',
            width: 60,
            render: (value) => (
                // <CustomTooltip size="small" title={value}>
                <span className="truncate"> {value} </span>
                // </CustomTooltip>
            ),
        },
        {
            title: 'ACR Cloud',
            key: 'acrCloud',
            dataIndex: 'acrCloud',
            align: 'center',
            width: 80,
            render: (value, record) => {
                const isScanned = !!record?.isScanned;
                return (
                    <div>
                        {/* <Button
                            onClick={() => {
                                if (!isScanned) return;
                                openModal(
                                    TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT,
                                    record
                                );
                            }}
                            icon={
                                <div>
                                    {isScanned ? (
                                        <SearchCheck size={SIZE_ICON} />
                                    ) : (
                                        <SearchX size={SIZE_ICON} />
                                    )}
                                </div>
                            }
                            className={cn(
                                '!rounded-2xl !text-yellow-500 hover:!border-yellow-500',
                                {
                                    '!text-green-500 hover:!border-green-500':
                                        isScanned,
                                }
                            )}
                        >
                            {isScanned
                                ? messages('common.scanned')
                                : messages('common.notScanned')}
                        </Button> */}
                        <Tag
                            onClick={() => {
                                if (!isScanned) {
                                    return openModal(
                                        TYPE_MODAL_TRACK.ACR_CLOUD_SCAN,
                                        record
                                    );
                                }
                                openModal(
                                    TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT,
                                    record
                                );
                            }}
                            color={isScanned ? 'green' : 'blue'}
                            className="!border-0 hover:cursor-pointer hover:!border hover:opacity-80"
                        >
                            {isScanned ? (
                                <div className="flex items-center gap-1">
                                    {' '}
                                    <SearchCheck size={SIZE_ICON} />{' '}
                                    {messages('common.scanned')}
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <SearchX size={SIZE_ICON} />{' '}
                                    {messages('common.notScanned')}
                                </div>
                            )}
                        </Tag>
                    </div>
                );
            },
        },

        // {
        //     title: messages('releases.duration'),
        //     key: 'duration',
        //     dataIndex: 'duration',
        //     align: 'center',
        //     width: 100,
        //     render: (value) => {
        //         const duration = convertSecondsToHoursMinutes(Number(value));
        //         return <span className="truncate">{duration}</span>;
        //     },
        // },
        // {
        //     title: messages('releases.releaseDate'),
        //     key: 'releaseDate',
        //     dataIndex: 'releaseDate',
        //     align: 'center',
        //     width: 100,
        //     render: (value,record) => (
        //         <span className="truncate text-wrap">
        //             {' '}
        //             {formattedDate(value)}{' '}
        //         </span>
        //     ),
        // },
        {
            title: messages('common.createdAt'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            width: 60,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'tracks_count'
            ),
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(record?.createdAt)}{' '}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 30,
            fixed: 'right',
            render: (_, record) => (
                <TrackActionButton
                    showDownload
                    showDetail
                    onShowDetail={() => {
                        router.push(
                            getTrackDetailRoute(record?.id, TRACK_TABS.METADATA)
                        );
                    }}
                    onShowDownload={async () => {
                        const response = await bucketApi.getLinkDownloadFile(
                            record?.audioFile?.fileId as string
                        );
                        window.open(response?.data?.data);
                    }}
                />
            ),
        },
    ];

    const newColumns = column.map((column) => ({
        ...column,
        hidden: !visibleColumns?.includes(column.key as TRACKS_COLUMNS_DISPLAY),
    }));

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={newColumns}
            rowClassName={'group'}
        />
    );
}
