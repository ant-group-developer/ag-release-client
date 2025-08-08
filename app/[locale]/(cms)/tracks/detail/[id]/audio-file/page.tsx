'use client';
import { formatFileSize } from '@/helpers/common';
import MetadataInfoItem from '@/modules/releases/components/release-detail/release-review/metadata-info/metadata-info-item';
import { TrackWaveform } from '@/modules/releases/components/release-detail/release-tracks/track-wave-form';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function AudioFile({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const trackId = params['id'];
    const { trackData } = useGetDetailTrack(trackId as string);
    return (
        <div className="m-auto h-[70vh] max-w-[1000px] space-y-2 overflow-y-auto">
            <div className="rounded-lg border p-4">
                <TrackWaveform key={`${trackData.id}`} data={trackData} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('common.fileName')}>
                    <div className="flex justify-between gap-2">
                        <span>{trackData?.audioFile?.file?.fileName}</span>
                        <span>
                            {' '}
                            {formatFileSize(
                                Number(trackData?.audioFile?.file?.fileSize)
                            )}
                        </span>
                    </div>
                </MetadataInfoItem>
                <MetadataInfoItem label="Bit depth">
                    {trackData?.audioFile?.bitDepth}
                </MetadataInfoItem>
                <MetadataInfoItem label="Bitrate">
                    {trackData?.audioFile?.bitrate}
                </MetadataInfoItem>
                <MetadataInfoItem label="Sample rate">
                    {trackData?.audioFile?.sampleRate}
                </MetadataInfoItem>
            </div>
        </div>
    );
}
