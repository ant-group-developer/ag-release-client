import ActionButton from '@/components/ui/button/action-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate } from '@/helpers/common';
import { RELEASE_MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TrackData } from '../../types';

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
                    <div className="flex-shrink-0 cursor-pointer">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={`https://picsum.photos/seed/${record?.title}/300/300`}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>

                    <p className="truncate">{record?.title}</p>
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
                        item.artistRole?.name?.toLowerCase() ===
                        RELEASE_MAIN_ARTIST_ROLE?.toLowerCase()
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
            render: () => <ActionButton showDelete />,
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
