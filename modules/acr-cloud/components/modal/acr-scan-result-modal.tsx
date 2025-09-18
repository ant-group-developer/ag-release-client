import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertMsToMinSec,
    convertSecondsToTime,
    formattedDate,
} from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useGetAcrCloudHistory } from '@/modules/acr-cloud/hooks/use-get-acr-cloud-history';
import { TrackData } from '@/modules/tracks/types';
import { Button, Drawer, Spin, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { ResultScan, TrackScanHistoryData } from '../../types';
import TableTrackTimeRange from '../table/track-time-range';
import AcrResultCompareModal from './acr-result-compare-modal';
import AcrCloudScanModal from './acr-scan-modal';

enum EXTERNAL_PLATFORM {
    YOUTUBE = 'youtube',
    SPOTIFY = 'spotify',
    DEEZER = 'deezer',
}

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanResultModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    const { acrCloudResult, isPending } = useGetAcrCloudHistory(dataEdit?.id);
    const [isOpenCompareModal, setOpenCompareModal] = useState<boolean>(false);
    const [isOpenReScan, setIsOpenReScan] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedResultScan, setSelectedResultScan] =
        useState<ResultScan | null>(null);
    const resultContent =
        selectedResultScan?.content?.humming ??
        selectedResultScan?.content?.music;
    const renderTitle = () => {
        return (
            <div className="space-x-2">
                <span>{`${messages('common.result')}  ACRCloud`}</span>
                <Button
                    onClick={() => setOpenCompareModal(true)}
                    size="small"
                    type="primary"
                >
                    <span>{messages('common.compare')}</span>
                </Button>
                <Button
                    onClick={() => setIsOpenReScan(true)}
                    size="small"
                    type="primary"
                >
                    <span>{messages('common.reScan')}</span>
                </Button>
            </div>
        );
    };

    const tabItems =
        acrCloudResult?.map((item: TrackScanHistoryData) => ({
            key: item.id.toString(),
            label: formattedDate(item?.createdAt),
            children: (
                <div className="grid grid-cols-12 gap-2 overflow-auto">
                    <TableTrackTimeRange
                        className="col-span-8 w-full max-w-[800px]"
                        bordered
                        size="middle"
                        dataSource={item?.result}
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () => {
                                setSelectedResultScan(record);
                                setDrawerOpen(true);
                            },
                        })}
                    />
                    <div className="col-span-4 max-h-[700px] overflow-y-auto rounded border p-4">
                        {resultContent?.map((item: any, idx: number) => {
                            const externalMetadata = item?.external_metadata;
                            const youtubeVid = externalMetadata?.youtube?.vid;
                            const spotifyTrackId =
                                externalMetadata?.spotify?.track?.id;
                            const deezerTrackId =
                                externalMetadata?.deezer?.track?.id;
                            const getLinkTrack = (
                                platform: EXTERNAL_PLATFORM
                            ) => {
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
                            return (
                                <div key={idx} className="border-b py-2">
                                    <div>
                                        <span>{messages('track.name')}: </span>
                                        <span className="font-semibold">
                                            {item?.title}
                                        </span>
                                    </div>
                                    <div>
                                        <span>ISRC: </span>
                                        <span className="font-semibold">
                                            {item?.external_ids?.isrc}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Label: </span>
                                        <span className="font-semibold">
                                            {item?.label}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            {messages('artist.label')}:{' '}
                                        </span>
                                        <span className="font-semibold">
                                            {item?.artists
                                                .map(
                                                    (artist: any) => artist.name
                                                )
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
                                        <span>
                                            {messages('release.releaseDate')}
                                            :{' '}
                                        </span>
                                        <span className="font-semibold">
                                            {formattedDate(
                                                item?.release_date,
                                                DATE_FORMAT.DATE_ONLY
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            {messages('track.rageDuplicate')}
                                            :{' '}
                                        </span>
                                        <span className="font-semibold">
                                            {`${convertMsToMinSec(item?.sample_begin_time_offset_ms)} - ${convertMsToMinSec(item?.sample_end_time_offset_ms)}`}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            {messages(
                                                'track.rageDuplicateInSongDetected'
                                            )}
                                            :{' '}
                                        </span>
                                        <span className="font-semibold">
                                            {`${convertMsToMinSec(item?.db_begin_time_offset_ms)} - ${convertMsToMinSec(item?.db_end_time_offset_ms)}`}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            {messages('common.accuracy')}:{' '}
                                        </span>
                                        <span className="font-semibold">
                                            {item?.score}
                                        </span>
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
                                                            src={
                                                                '/icon/youtube.png'
                                                            }
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
                                                            src={
                                                                '/icon/spotify.png'
                                                            }
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
                                                            src={
                                                                '/icon/deezer.svg'
                                                            }
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
                            );
                        })}
                    </div>
                </div>
            ),
        })) || [];

    return (
        <AppModal
            open
            title={renderTitle()}
            onCancel={closeModal}
            width={'80vw'}
            footer={null}
            className="!top-12"
            {...props}
        >
            <>
                {/* <Spin spinning={isPending}>
                    <div className="max-h-[700px] min-h-[200px] space-y-2 overflow-auto">
                        {acrCloudResult?.map((item: TrackScanHistoryData) => (
                            <Collapse
                                key={item.id}
                                items={[
                                    {
                                        label: (
                                            <span className="font-semibold">
                                                {formattedDate(item?.createdAt)}
                                            </span>
                                        ),
                                        children: (
                                            <div>
                                                <Collapse
                                                    defaultActiveKey={item?.result?.map(
                                                        (
                                                            _: ResultScan,
                                                            idx: number
                                                        ) => idx
                                                    )}
                                                    items={item?.result?.map(
                                                        (item2: ResultScan) => {
                                                            const value =
                                                                item2?.content
                                                                    ?.music ??
                                                                item2?.content
                                                                    ?.humming;
                                                            return {
                                                                label: `${convertSecondsToTime(item2?.key?.startSecond)} - ${convertSecondsToTime(item2?.key?.endSecond)} (${messages('track.count')}: ${value?.length ?? 0})`,
                                                                children: (
                                                                    <div>
                                                                        <ScanResultPanel
                                                                            data={
                                                                                item2
                                                                            }
                                                                        />
                                                                    </div>
                                                                ),
                                                            };
                                                        }
                                                    )}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        ))}
                    </div>
                </Spin> */}

                <Spin spinning={isPending}>
                    <div className="max-h-[800px] min-h-[200px] space-y-2 overflow-hidden">
                        <Tabs
                            tabPosition="left"
                            items={tabItems}
                            className="h-full"
                            style={{ height: '700px' }}
                        />
                    </div>
                </Spin>

                <Drawer
                    title={`${convertSecondsToTime(selectedResultScan?.key?.startSecond)} - ${convertSecondsToTime(selectedResultScan?.key?.endSecond)}`}
                    placement="right"
                    width={500}
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                >
                    {resultContent?.map((item: any, idx: number) => {
                        const externalMetadata = item?.external_metadata;
                        const youtubeVid = externalMetadata?.youtube?.vid;
                        const spotifyTrackId =
                            externalMetadata?.spotify?.track?.id;
                        const deezerTrackId =
                            externalMetadata?.deezer?.track?.id;
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
                        return (
                            <div key={idx} className="border-b py-2">
                                <div>
                                    <span>{messages('track.name')}: </span>
                                    <span className="font-semibold">
                                        {item?.title}
                                    </span>
                                </div>
                                <div>
                                    <span>ISRC: </span>
                                    <span className="font-semibold">
                                        {item?.external_ids?.isrc}
                                    </span>
                                </div>
                                <div>
                                    <span>Label: </span>
                                    <span className="font-semibold">
                                        {item?.label}
                                    </span>
                                </div>
                                <div>
                                    <span>{messages('artist.label')}: </span>
                                    <span className="font-semibold">
                                        {item?.artists
                                            .map((artist: any) => artist.name)
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
                                    <span>
                                        {messages('release.releaseDate')}:{' '}
                                    </span>
                                    <span className="font-semibold">
                                        {formattedDate(
                                            item?.release_date,
                                            DATE_FORMAT.DATE_ONLY
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        {messages('track.rageDuplicate')}:{' '}
                                    </span>
                                    <span className="font-semibold">
                                        {`${convertMsToMinSec(item?.sample_begin_time_offset_ms)} - ${convertMsToMinSec(item?.sample_end_time_offset_ms)}`}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        {messages(
                                            'track.rageDuplicateInSongDetected'
                                        )}
                                        :{' '}
                                    </span>
                                    <span className="font-semibold">
                                        {`${convertMsToMinSec(item?.db_begin_time_offset_ms)} - ${convertMsToMinSec(item?.db_end_time_offset_ms)}`}
                                    </span>
                                </div>
                                <div>
                                    <span>{messages('common.accuracy')}: </span>
                                    <span className="font-semibold">
                                        {item?.score}
                                    </span>
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
                                                        src={
                                                            '/icon/youtube.png'
                                                        }
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
                                                        src={
                                                            '/icon/spotify.png'
                                                        }
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
                        );
                    })}
                </Drawer>

                <AcrResultCompareModal
                    open={isOpenCompareModal}
                    onCancel={() => setOpenCompareModal(false)}
                />
                <AcrCloudScanModal
                    open={isOpenReScan}
                    hideSkipScannedOption
                    selectedTrackIds={[dataEdit?.id]}
                    onCancel={() => setIsOpenReScan(false)}
                />
            </>
        </AppModal>
    );
}
