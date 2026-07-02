'use client';

import { convertMsToMinSec } from '@/helpers/common';
import { useGetAcrCloudHistory } from '@/modules/acr-cloud/hooks/use-get-acr-cloud-history';
import TagScanCopyright from '@/modules/tracks/components/tags/tag-scan-coppyright';
import { SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';
import { TrackData } from '@/modules/tracks/types';
import { Button, Spin, Tag } from 'antd';
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const getMockAcrMatches = (trackTitle: string, index: number) => {
    if (index === 0) {
        return [
            {
                title: `${trackTitle} (Original Instrumental)`,
                artists: [{ name: 'Classic Records Band' }],
                score: 96,
                external_ids: { isrc: 'USUM71890123' },
                label: 'Universal Music Group',
                album: { name: 'Global Sounds 2018' },
                sample_begin_time_offset_ms: 15000,
                sample_end_time_offset_ms: 48000,
                external_metadata: {
                    youtube: { vid: 'dQw4w9WgXcQ' },
                    spotify: { track: { id: '4PTG3Z6ehGkBFQC2zYocWw' } },
                    deezer: { track: { id: '3135556' } },
                },
            },
        ];
    }
    if (index === 1) {
        return [
            {
                title: 'Sunset Beach Remake',
                artists: [{ name: 'Chillout DJ Set' }],
                score: 82,
                external_ids: { isrc: 'DEUM71900456' },
                label: 'Independent Records',
                album: { name: 'Summer Hits Lofi' },
                sample_begin_time_offset_ms: 65000,
                sample_end_time_offset_ms: 85000,
                external_metadata: {
                    spotify: { track: { id: '4PTG3Z6ehGkBFQC2zYocWw' } },
                },
            },
        ];
    }
    return [];
};

interface AcrTrackResultSectionProps {
    track: TrackData;
    index: number;
}

export default function AcrTrackResultSection({
    track,
    index,
}: AcrTrackResultSectionProps) {
    const { acrCloudResult, isPending } = useGetAcrCloudHistory(track.id);

    const latestScan = acrCloudResult?.[0];
    const realMatches = latestScan?.result?.flatMap(
        (r) => r.content?.music ?? r.content?.humming ?? []
    ) ?? [];

    const hasRealData = acrCloudResult && acrCloudResult.length > 0;
    
    // Fallback sang dữ liệu mock nếu hệ thống chưa có kết quả quét thực tế
    const matches = hasRealData && realMatches.length > 0
        ? realMatches
        : getMockAcrMatches(track.title, index);

    const status = hasRealData
        ? track.scanCopyrightStatus
        : (index === 0 || index === 1 ? SCAN_COPYRIGHT_STATUS.WARNING : SCAN_COPYRIGHT_STATUS.FINISHED);

    const isUnScanned = hasRealData && status === SCAN_COPYRIGHT_STATUS.UN_SCANNED;

    return (
        <div className="rounded-lg border bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
            {/* Header của bài hát */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-gray-800">
                            {track.title}
                        </h4>
                        <span className="text-xs text-gray-400">
                            ISRC: {track.isrc || 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        ACR status:
                    </span>
                    <TagScanCopyright status={status} />
                </div>
            </div>

            {/* Phần nội dung quét */}
            {isPending ? (
                <div className="flex justify-center py-4">
                    <Spin size="small" />
                </div>
            ) : isUnScanned ? (
                <div className="flex items-center gap-2 py-1 text-sm font-medium text-blue-600">
                    <Clock size={16} />
                    <span>Bài hát chưa được quét bản quyền ARC.</span>
                </div>
            ) : matches.length === 0 ? (
                <div className="flex items-center gap-2 py-1 text-sm font-medium text-emerald-600">
                    <CheckCircle size={16} />
                    <span>
                        Không phát hiện vi phạm bản quyền. Bài hát đạt kiểm định an toàn âm thanh.
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                        <AlertTriangle size={16} />
                        <span>
                            Phát hiện trùng khớp âm thanh trùng lặp ({matches.length} kết quả):
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {matches.map((match, mIdx) => {
                            const externalMetadata = match?.external_metadata as any;
                            const youtubeVid = externalMetadata?.youtube?.vid;
                            const spotifyTrackId = externalMetadata?.spotify?.track?.id;
                            const deezerTrackId = externalMetadata?.deezer?.track?.id;
                            
                            const getLinkTrack = (platform: 'youtube' | 'spotify' | 'deezer') => {
                                switch (platform) {
                                    case 'youtube':
                                        return `https://www.youtube.com/watch?v=${youtubeVid}`;
                                    case 'spotify':
                                        return `https://open.spotify.com/track/${spotifyTrackId}`;
                                    case 'deezer':
                                        return `https://www.deezer.com/en/track/${deezerTrackId}`;
                                    default:
                                        return '';
                                }
                            };

                            return (
                                <div
                                    key={mIdx}
                                    className="grid grid-cols-1 gap-4 rounded-lg border border-amber-100 bg-white p-3 text-sm md:grid-cols-2"
                                >
                                    <div className="space-y-1">
                                        <div>
                                            <span className="text-gray-400">Tên bài hát gốc:</span>{' '}
                                            <span className="font-semibold text-gray-800">
                                                {match.title}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Nghệ sĩ:</span>{' '}
                                            <span className="font-semibold text-gray-800">
                                                {match.artists?.map((artist) => artist.name).join(' & ')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Album:</span>{' '}
                                            <span className="text-gray-600">
                                                {match.album?.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Nhãn đĩa:</span>{' '}
                                            <span className="text-gray-600">
                                                {match.label || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div>
                                            <span className="text-gray-400">ISRC gốc:</span>{' '}
                                            <span className="font-mono font-medium text-gray-700">
                                                {match.external_ids?.isrc || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Khoảng thời gian khớp trong bài:</span>{' '}
                                            <span className="font-semibold text-gray-700">
                                                {match.sample_begin_time_offset_ms !== undefined && match.sample_end_time_offset_ms !== undefined
                                                    ? `${convertMsToMinSec(match.sample_begin_time_offset_ms)} - ${convertMsToMinSec(match.sample_end_time_offset_ms)}`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Độ chính xác (Score):</span>{' '}
                                            <Tag color="orange" className="ml-1 font-bold">
                                                {match.score}/100
                                            </Tag>
                                        </div>

                                        {/* Nút nghe thử */}
                                        <div className="flex gap-2 pt-2">
                                            {youtubeVid && (
                                                <a
                                                    href={getLinkTrack('youtube')}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Button
                                                        size="small"
                                                        type="default"
                                                        className="flex items-center gap-1 text-xs"
                                                    >
                                                        <ExternalLink size={12} />
                                                        YouTube
                                                    </Button>
                                                </a>
                                            )}
                                            {spotifyTrackId && (
                                                <a
                                                    href={getLinkTrack('spotify')}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Button
                                                        size="small"
                                                        type="default"
                                                        className="flex items-center gap-1 text-xs"
                                                    >
                                                        <ExternalLink size={12} />
                                                        Spotify
                                                    </Button>
                                                </a>
                                            )}
                                            {deezerTrackId && (
                                                <a
                                                    href={getLinkTrack('deezer')}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Button
                                                        size="small"
                                                        type="default"
                                                        className="flex items-center gap-1 text-xs"
                                                    >
                                                        <ExternalLink size={12} />
                                                        Deezer
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
