import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    convertSecondsToHoursMinutes,
    formattedDate,
    getIntlCodeByGenres,
} from '@/helpers/common';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            // title: messages('common.thumbnail'),
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            align: 'center',
            width: 60,
            fixed: 'left',
            render: (value) => (
                <div className="flex items-center justify-center">
                    <Image
                        src={value}
                        alt="thumbnail"
                        width={200}
                        height={200}
                        className="h-12 w-12 cursor-pointer rounded-lg object-cover"
                    />
                </div>
            ),
        },
        {
            title: messages('tracks.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 200,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('tracks.id'),
            key: 'trackId',
            dataIndex: 'trackId',
            align: 'left',
            width: 200,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: 'ISRC',
            key: 'isrc',
            dataIndex: 'isrc',
            align: 'left',
            width: 200,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="truncate"> {value} </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.artist'),
            key: 'artist',
            dataIndex: 'artist',
            align: 'left',
            ellipsis: true,
            width: 200,
            render: (value) => (
                <CustomTooltip size="small" title={value}>
                    <span className="cursor-pointer truncate hover:text-blue-500 group-hover:underline">
                        {' '}
                        {value}{' '}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.type'),
            key: 'genres',
            dataIndex: 'genres',
            align: 'left',
            width: 120,
            render: (value) => {
                const genresName = messages(getIntlCodeByGenres(value));
                return <span className="truncate"> {genresName} </span>;
            },
        },

        {
            title: messages('releases.duration'),
            key: 'duration',
            dataIndex: 'duration',
            align: 'center',
            width: 100,
            render: (value) => {
                const duration = convertSecondsToHoursMinutes(Number(value));
                return <span className="truncate">{duration}</span>;
            },
        },
        {
            title: messages('releases.releaseDate'),
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
            width: 100,
            render: (value) => (
                <span className="truncate text-wrap">
                    {' '}
                    {formattedDate(value)}{' '}
                </span>
            ),
        },
        {
            title: messages('common.dateCreated'),
            key: 'creationDate',
            dataIndex: 'creationDate',
            align: 'center',
            width: 100,
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
            width: 50,
            fixed: 'right',
            render: () => <ActionButton showUpdate showDetail showDelete />,
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
