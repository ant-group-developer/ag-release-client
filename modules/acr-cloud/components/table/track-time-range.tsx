import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { convertSecondsToTime } from '@/helpers/common';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { ResultScan } from '../../types';

type Props = AppTableProps<ResultScan> & {};
enum EXTERNAL_PLATFORM {
    YOUTUBE = 'youtube',
    SPOTIFY = 'spotify',
    DEEZER = 'deezer',
}
export default function TableTrackTimeRange({ ...props }: Props) {
    const messages = useTranslations();
    const columns: ColumnType<ResultScan>[] = [
        {
            title: 'Time range',
            dataIndex: 'timeRange',
            key: 'timeRange',
            render: (_, record) => {
                return (
                    <span className="group-hover:text-blue-500">
                        {`${convertSecondsToTime(record?.key?.startSecond)} - ${convertSecondsToTime(record?.key?.endSecond)}`}
                    </span>
                );
            },
            width: 100,
        },
        {
            title: messages('track.count'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            align: 'center',
            render: (_, record) => {
                const matches =
                    record?.content?.music ?? record?.content?.humming ?? [];
                return (
                    <span className="group-hover:text-blue-500">
                        {matches?.length}
                    </span>
                );
            },
            width: 60,
        },
        {
            title: messages('track.label'),
            dataIndex: 'track',
            key: 'track',
            ellipsis: true,
            width: 600,
            render: (value, record) => {
                let matches =
                    record?.content?.music ?? record?.content?.humming;
                if (!matches) return <p>{messages('track.noResultMatches')}</p>;

                if (!record?.content?.music && record?.content?.humming) {
                    matches = matches?.map((matches) => ({
                        ...matches,
                        score: Math.round(matches.score * 100),
                    }));
                }
                return (
                    <div className="flex flex-wrap gap-2">
                        {matches?.map((item, index) => {
                            return (
                                <Tag
                                    key={index}
                                    className="!mr-0 group-hover:text-blue-500"
                                >
                                    {item?.title} ({item?.score})
                                </Tag>
                            );
                        })}
                    </div>
                );
            },
        },
    ];

    // const expandedRowRender = (record: ResultScan) => {
    //     const matches =
    //         record?.content?.music ?? record?.content?.humming ?? [];

    //     if (!matches?.length) {
    //         return (
    //             <div className="p-4">{messages('track.noResultMatches')}</div>
    //         );
    //     }
    //     return (
    //         <div className="p-4">
    //             {matches.map((item: AcrMusicItem, index) => {
    //                 const externalMetadata = item?.external_metadata;
    //                 const youtubeVid = item?.external_metadata?.youtube?.vid;
    //                 const spotifyTrackId =
    //                     item?.external_metadata?.spotify?.track?.id;
    //                 const deezerTrackId =
    //                     item?.external_metadata?.deezer?.track?.id;
    //                 const getLinkTrack = (platform: EXTERNAL_PLATFORM) => {
    //                     switch (platform) {
    //                         case EXTERNAL_PLATFORM.YOUTUBE:
    //                             return `https://www.youtube.com/watch?v=${externalMetadata?.youtube?.vid}`;
    //                         case EXTERNAL_PLATFORM.SPOTIFY:
    //                             return `https://open.spotify.com/track/${externalMetadata?.spotify?.track?.id}`;
    //                         case EXTERNAL_PLATFORM.DEEZER:
    //                             return `https://www.deezer.com/en/track/${externalMetadata?.deezer?.track?.id}`;
    //                         default:
    //                             break;
    //                     }
    //                 };
    //                 return (
    //                     <div key={index} className="mb-6 last:mb-0">
    //                         <div>
    //                             <div>
    //                                 <span>{messages('track.name')}: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.title}
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <span>ISRC: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.external_ids?.isrc}
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <span>Label: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.label}
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <span>{messages('artist.label')}: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.artists
    //                                         ?.map((artist) => artist.name)
    //                                         .join(' & ')}
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <span>Album: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.album?.name}
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <span>
    //                                     {messages('release.releaseDate')}:{' '}
    //                                 </span>
    //                                 <span className="font-semibold">
    //                                     {item?.release_date}
    //                                 </span>
    //                             </div>
    //                             {item?.sample_begin_time_offset_ms &&
    //                                 item?.sample_end_time_offset_ms && (
    //                                     <div>
    //                                         <span>
    //                                             {messages(
    //                                                 'track.rageDuplicate'
    //                                             )}
    //                                             :{' '}
    //                                         </span>
    //                                         <span className="font-semibold">
    //                                             {`${convertSecondsToTime(item?.sample_begin_time_offset_ms / 1000)} - ${convertSecondsToTime(item?.sample_end_time_offset_ms / 1000)}`}
    //                                         </span>
    //                                     </div>
    //                                 )}
    //                             {item?.db_begin_time_offset_ms &&
    //                                 item?.db_end_time_offset_ms && (
    //                                     <div>
    //                                         <span>
    //                                             {messages(
    //                                                 'track.rageDuplicateInSongDetected'
    //                                             )}
    //                                             :{' '}
    //                                         </span>
    //                                         <span className="font-semibold">
    //                                             {`${convertSecondsToTime(item?.db_begin_time_offset_ms / 1000)} - ${convertSecondsToTime(item?.db_end_time_offset_ms / 1000)}`}
    //                                         </span>
    //                                     </div>
    //                                 )}
    //                             <div>
    //                                 <span>{messages('common.accuracy')}: </span>
    //                                 <span className="font-semibold">
    //                                     {item?.score}
    //                                 </span>
    //                             </div>
    //                             <div className="mt-2 flex gap-2">
    //                                 {youtubeVid && (
    //                                     <a
    //                                         href={getLinkTrack(
    //                                             EXTERNAL_PLATFORM.YOUTUBE
    //                                         )}
    //                                         target="_blank"
    //                                         rel="noopener noreferrer"
    //                                     >
    //                                         <button className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600">
    //                                             <span>🎬</span>
    //                                             Youtube
    //                                         </button>
    //                                     </a>
    //                                 )}
    //                                 {spotifyTrackId && (
    //                                     <a
    //                                         href={getLinkTrack(
    //                                             EXTERNAL_PLATFORM.SPOTIFY
    //                                         )}
    //                                         target="_blank"
    //                                         rel="noopener noreferrer"
    //                                     >
    //                                         <button className="inline-flex items-center gap-2 rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600">
    //                                             <span>🎵</span>
    //                                             Spotify
    //                                         </button>
    //                                     </a>
    //                                 )}
    //                                 {deezerTrackId && (
    //                                     <a
    //                                         href={getLinkTrack(
    //                                             EXTERNAL_PLATFORM.DEEZER
    //                                         )}
    //                                         target="_blank"
    //                                         rel="noopener noreferrer"
    //                                     >
    //                                         <button className="inline-flex items-center gap-2 rounded bg-orange-500 px-3 py-2 text-white hover:bg-orange-600">
    //                                             <span>🎶</span>
    //                                             Deezer
    //                                         </button>
    //                                     </a>
    //                                 )}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     );
    // };

    return (
        <AppTable
            {...props}
            columns={columns}
            rowKey={(record, index) =>
                `${record.key.startSecond} ${record.key.endSecond}`
            }
            scroll={{ x: 850, y: '650px' }}
            rowClassName={'group cursor-pointer'}
            // expandable={{
            //     expandedRowRender: (record) => expandedRowRender(record),
            // }}
        />
    );
}
