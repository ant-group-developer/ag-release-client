'use client';

import { TrackData } from '@/modules/tracks/types';
import { Card, theme, Alert } from 'antd';
import { Music, CheckCircle } from 'lucide-react';
import AcrTrackResultSection from './acr-track-result-section';
import { useTranslations } from 'next-intl';

interface AcrCloudCardProps {
    tracks: TrackData[];
    isLoading: boolean;
}

export default function AcrCloudCard({ tracks, isLoading }: AcrCloudCardProps) {
    const { token } = theme.useToken();
    const messages = useTranslations();

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Music className="text-indigo-500" size={20} />
                    <span>{messages('release.systemReview.acrCloudCard.title')}</span>
                </div>
            }
        >
            {isLoading ? (
                <p className="py-6 text-center text-gray-400">
                    {messages('release.systemReview.acrCloudCard.loading')}
                </p>
            ) : tracks.length === 0 ? (
                <Alert
                    message={messages('release.systemReview.acrCloudCard.noTracks')}
                    description={messages('release.systemReview.acrCloudCard.noTracksDesc')}
                    type="success"
                    showIcon
                    icon={
                        <CheckCircle size={18} className="text-emerald-500" />
                    }
                    className="rounded-lg border border-emerald-100 bg-emerald-50/50"
                />
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">
                        {messages('release.systemReview.acrCloudCard.description')}
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
