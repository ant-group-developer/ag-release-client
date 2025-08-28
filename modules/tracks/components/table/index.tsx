import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { getTrackDetailRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { Link, useRouter } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import TrackActionButton from '@/modules/releases/components/release-detail/release-tracks/button/track-action';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { TrackArtistData } from '@/modules/track-artist/types';
import {
    SCAN_COPYRIGHT_STATUS,
    TRACK_TABS,
    TRACKS_COLUMNS_DISPLAY,
} from '@/modules/tracks/enums';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TrackData, TrackDataFilter } from '../../types';
import TagScanCopyright from '../tags/tag-scan-coppyright';
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
            title: messages('track.name'),
            key: 'title',
            dataIndex: 'title',
            ellipsis: true,
            align: 'left',
            fixed: 'left',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'title'
            ),
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
            title: messages('release.version'),
            key: 'version',
            dataIndex: 'version',
            align: 'left',
            width: 50,
            render: (value, record) => {
                return <span className="truncate"> {record.version} </span>;
            },
        },
        {
            title: messages('track.id'),
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
            title: messages('release.name'),
            key: TRACKS_COLUMNS_DISPLAY.RELEASE_TITLE,
            dataIndex: 'releaseTitle',
            align: 'left',
            width: 80,
            ellipsis: true,
            render: (_, record) => (
                <CopyText text={record?.release?.title}>
                    <span className="truncate"> {record?.release?.title} </span>
                </CopyText>
            ),
        },
        {
            title: messages('label.name'),
            key: TRACKS_COLUMNS_DISPLAY.LABEL_NAME,
            dataIndex: 'labelName',
            align: 'left',
            width: 80,
            ellipsis: true,
            render: (_, record) => (
                <CopyText text={record?.release?.label?.name}>
                    <span className="truncate">
                        {' '}
                        {record?.release?.label?.name}{' '}
                    </span>
                </CopyText>
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
            title: 'ACRCloud',
            key: 'acrCloud',
            dataIndex: 'acrCloud',
            align: 'center',
            width: 80,
            render: (value, record) => {
                const isUnScanned =
                    record?.scanCopyrightStatus ==
                    SCAN_COPYRIGHT_STATUS.UN_SCANNED;
                return (
                    <div>
                        {/* <Tag
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
                        </Tag> */}
                        <TagScanCopyright
                            className="!border-0 hover:cursor-pointer hover:!border hover:opacity-80"
                            onClick={() => {
                                if (isUnScanned) {
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
                            status={record?.scanCopyrightStatus}
                        />
                    </div>
                );
            },
        },

        // {
        //     title: messages('release.duration'),
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
        //     title: messages('release.releaseDate'),
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
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 60,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
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
