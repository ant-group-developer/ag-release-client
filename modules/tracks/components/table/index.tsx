import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate } from '@/helpers/common';
import { getTrackDetailRoute } from '@/helpers/link';
import { Link } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import TrackActionButton from '@/modules/releases/components/release-detail/release-tracks/button/track-action';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TRACK_TABS, TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TrackData } from '../../types';
import TrackCoverArt from './trackCoverArt';

type Props = Omit<AppTableProps<TrackData>, 'columns'> & {
    visibleColumns: TRACKS_COLUMNS_DISPLAY[];
};

export default function TracksTable({ visibleColumns, ...props }: Props) {
    const messages = useTranslations();
    const column: ColumnType<TrackData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 30,
            align: 'center',
            render: (_, __, index) => index + 1,
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
                        item.artistRole?.value?.toLowerCase() ===
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
            title: messages('common.dateCreated'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            width: 100,
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
