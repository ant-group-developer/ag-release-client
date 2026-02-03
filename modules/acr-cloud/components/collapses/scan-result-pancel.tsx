import { DATE_FORMAT } from '@/enums/common';
import { convertMsToMinSec, formattedDate } from '@/helpers/common';
import { AcrMusicItem, ResultScan } from '@/modules/acr-cloud/types';
import { Button, Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {
    data: ResultScan;
};

enum EXTERNAL_PLATFORM {
    YOUTUBE = 'youtube',
    SPOTIFY = 'spotify',
    DEEZER = 'deezer',
}

export default function ScanResultPanel({ data }: Props) {
    const messages = useTranslations();
    let value = data?.content?.music ?? data?.content?.humming;

    if (!value) return <p>{messages('track.noResultMatches')}</p>;

    if (!data?.content?.music && data?.content?.humming) {
        value = value?.map((item) => ({
            ...item,
            score: Math.round(item.score * 100),
        }));
    }

    const childItems: CollapseProps['items'] = value?.map(
        (item: AcrMusicItem, i: number) => {
            const externalMetadata = item?.external_metadata;
            const youtubeVid = externalMetadata?.youtube?.vid;
            const spotifyTrackId = externalMetadata?.spotify?.track?.id;
            const deezerTrackId = externalMetadata?.deezer?.track?.id;
            const getLinkTrack = (platform: EXTERNAL_PLATFORM) => {
                switch (platform) {
                    case EXTERNAL_PLATFORM.YOUTUBE:
                        return `https://www.youtube.com/watch?v=${externalMetadata?.youtube?.vid}`;
                    case EXTERNAL_PLATFORM.SPOTIFY:
                        return `https://open.spotify.com/track/${externalMetadata?.spotify?.track?.id}`;
                    case EXTERNAL_PLATFORM.DEEZER:
                        return `https://www.deezer.com/en/track/${externalMetadata?.deezer?.track?.id}`;
                    default:
                        break;
                }
            };
            return {
                key: `i-${i}`,
                label: `${item?.title} (${messages('common.accuracy')}: ${item.score})`,
                children: (
                    <div>
                        <div>
                            <span>{messages('track.name')}: </span>
                            <span className="font-semibold">{item?.title}</span>
                        </div>
                        <div>
                            <span>ISRC: </span>
                            <span className="font-semibold">
                                {item?.external_ids?.isrc}
                            </span>
                        </div>
                        <div>
                            <span>Label: </span>
                            <span className="font-semibold">{item?.label}</span>
                        </div>
                        <div>
                            <span>{messages('artist.label')}: </span>
                            <span className="font-semibold">
                                {item?.artists
                                    .map((artist) => artist.name)
                                    .join(' & ')}
                            </span>
                        </div>
                        <div>
                            <span>Album: </span>
                            <span className="font-semibold">
                                {item?.album?.name}
                            </span>
                        </div>
                        <div>
                            <span>{messages('release.releaseDate')}: </span>
                            <span className="font-semibold">
                                {formattedDate(
                                    item?.release_date,
                                    DATE_FORMAT.DATE_ONLY
                                )}
                            </span>
                        </div>
                        <div>
                            <span>{messages('track.rageDuplicate')}: </span>
                            <span className="font-semibold">
                                {`${convertMsToMinSec(item?.sample_begin_time_offset_ms)} - ${convertMsToMinSec(item?.sample_end_time_offset_ms)}`}
                            </span>
                        </div>
                        <div>
                            <span>
                                {messages('track.rageDuplicateInSongDetected')}
                                :{' '}
                            </span>
                            <span className="font-semibold">
                                {`${convertMsToMinSec(item?.db_begin_time_offset_ms)} - ${convertMsToMinSec(item?.db_end_time_offset_ms)}`}
                            </span>
                        </div>
                        <div>
                            <span>{messages('common.accuracy')}: </span>
                            <span className="font-semibold">{item?.score}</span>
                        </div>
                        <div className="flex gap-2">
                            {youtubeVid && (
                                <a
                                    href={getLinkTrack(
                                        EXTERNAL_PLATFORM.YOUTUBE
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        icon={
                                            <Image
                                                src={'/icon/youtube.png'}
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        }
                                    >
                                        Youtube{' '}
                                    </Button>
                                </a>
                            )}
                            {spotifyTrackId && (
                                <a
                                    href={getLinkTrack(
                                        EXTERNAL_PLATFORM.SPOTIFY
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        icon={
                                            <Image
                                                src={'/icon/spotify.png'}
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        }
                                    >
                                        {' '}
                                        Spotify{' '}
                                    </Button>
                                </a>
                            )}
                            {deezerTrackId && (
                                <a
                                    href={getLinkTrack(
                                        EXTERNAL_PLATFORM.DEEZER
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        icon={
                                            <Image
                                                src={'/icon/deezer.svg'}
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        }
                                    >
                                        {' '}
                                        Deezer{' '}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                ),
            };
        }
    );

    return <Collapse items={childItems} />;
}
