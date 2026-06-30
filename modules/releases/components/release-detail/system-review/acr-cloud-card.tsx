'use client';

import { TrackData } from '@/modules/tracks/types';
import { Card, theme } from 'antd';
import { Music } from 'lucide-react';
import AcrTrackResultSection from './acr-track-result-section';

const ACR_CLOUD_CARD_TEXT = {
    title: 'K\u1ebeT QU\u1ea2 QU\u00c9T B\u1ea2N QUY\u1ec0N ARC (ACRCLOUD DATA)',
    loading: '\u0110ang t\u1ea3i danh s\u00e1ch b\u00e0i h\u00e1t...',
    description:
        'H\u1ec7 th\u1ed1ng t\u1ef1 \u0111\u1ed9ng th\u1ef1c hi\u1ec7n \u0111\u1ed1i so\u00e1t \u00e2m thanh c\u1ee7a t\u1eebng track trong Release v\u1edbi kho d\u1eef li\u1ec7u b\u1ea3n quy\u1ec1n th\u1ebf gi\u1edbi ACRCloud.',
} as const;

interface AcrCloudCardProps {
    tracks: TrackData[];
    isLoading: boolean;
}

export default function AcrCloudCard({ tracks, isLoading }: AcrCloudCardProps) {
    const { token } = theme.useToken();

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Music className="text-indigo-500" size={20} />
                    <span>{ACR_CLOUD_CARD_TEXT.title}</span>
                </div>
            }
        >
            {isLoading ? (
                <p className="py-6 text-center text-gray-400">
                    {ACR_CLOUD_CARD_TEXT.loading}
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">
                        {ACR_CLOUD_CARD_TEXT.description}
                    </p>

                    {tracks.map((track, index) => (
                        <AcrTrackResultSection
                            key={track.id}
                            track={track}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}
