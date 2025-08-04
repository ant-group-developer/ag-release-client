import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import type { TrackData } from '@/modules/releases/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Collapse } from 'antd';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ArtistItem from '../metadata-info/artist-item';
import TrackMetadataInfoItem from './track-metadata-info-item';

const SIZE_ICON = 20;

interface TrackError {
    trackIndex: number;
    errors: {
        path: string[];
        message: string;
    }[];
}

type Props = {};

export default function TracksInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const { tracksData } = useGetListTracks({ releaseId: formValue?.id });
    const formErrors = useReleaseFormStore((state) => state.validationErrors);

    const formatTrackError = (errors: any[]) => {
        const trackErrors: TrackError[] = [];
        errors.forEach((error) => {
            if (errors.length > 0 && error.path[0] === 'tracks') {
                const trackIndex = error.path[1];

                const existingTrackError = trackErrors.find(
                    (trackError) => trackError.trackIndex === trackIndex
                );

                if (existingTrackError) {
                    existingTrackError.errors.push({
                        path: error.path.slice(2),
                        message: error.message,
                    });
                    return;
                }

                trackErrors.push({
                    trackIndex: error.path[1],
                    errors: [
                        {
                            path: error.path.slice(2),
                            message: error.message,
                        },
                    ],
                });
            }
        });
        return trackErrors;
    };

    const trackErrors = formatTrackError(formErrors);

    const getFieldError = (trackIndex: number, field: keyof TrackData) => {
        const trackError = trackErrors.find(
            (error) => error.trackIndex === trackIndex
        );
        if (!trackError) return null;
        return trackError.errors.find((error) => error.path[0] === field);
    };

    // Hàm lấy giá trị hiển thị cho từng field
    const getFieldValue = (
        track: TrackData | undefined,
        field: keyof TrackData
    ) => {
        if (!track) return '';
        if (
            field === 'trackLanguage' &&
            typeof track.trackLanguage === 'object'
        ) {
            const lang = track.trackLanguage;
            const audioLang = lang?.audioLanguage?.name;
            const country = lang?.metadataLanguageCountry?.name;
            const recordingCountry = (lang as any)?.recordingCountry?.name;
            return (
                <div className="mt-1">
                    {audioLang && (
                        <div>
                            {messages('tracks.language')}: {audioLang}
                        </div>
                    )}
                    {country && (
                        <div>
                            {messages('common.language')} metadata: {country}
                        </div>
                    )}
                    {recordingCountry && (
                        <div>
                            {messages('tracks.recordingCountry')}:{' '}
                            {recordingCountry}
                        </div>
                    )}
                </div>
            );
        }
        if (field === 'primaryGenreId') {
            return track.primaryGenre?.name || track.primaryGenreId || '';
        }
        if (field === 'subGenreId') {
            return track.subGenre?.name || track.subGenreId || '';
        }
        const value = track[field];
        if (typeof value === 'boolean') {
            return value ? messages('common.yes') : messages('common.no');
        }
        return value !== undefined && value !== null ? String(value) : '';
    };

    const renderField = (
        trackIndex: number,
        label: string,
        field: keyof TrackData,
        isRequired: boolean = false
    ) => {
        const error = getFieldError(trackIndex, field);
        const track = tracksData?.items[trackIndex];
        const value = getFieldValue(track, field);
        return (
            <div className="flex justify-between">
                <div>
                    <p className="font-medium">
                        {label}{' '}
                        {isRequired && <span className="text-red-500">*</span>}
                    </p>
                    {value === '' ? (
                        <p>
                            {isRequired ? (
                                <p className="text-red-500">
                                    {' '}
                                    {messages('common.required')}{' '}
                                </p>
                            ) : (
                                <p className="text-gray-500">
                                    {' '}
                                    {messages('common.optional')}{' '}
                                </p>
                            )}
                        </p>
                    ) : (
                        <p className="mt-1">{value}</p>
                    )}
                </div>
                {error && (
                    <AlertCircle className="text-red-500" size={SIZE_ICON} />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            <p className="font-semibold"> {messages('tracks.label')} </p>

            <div className="mb-2 rounded-lg bg-zinc-100 p-4">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                {tracksData?.items?.map((track: TrackData, index: number) => (
                    <Collapse
                        key={String(index + 1)}
                        className="release-review-collapse !border-none !bg-zinc-100 !py-2"
                        size="small"
                        bordered={false}
                    >
                        <Collapse.Panel
                            header={
                                <span className="text-base font-medium">
                                    {index + 1} {track.title || 'Track'}
                                </span>
                            }
                            key={String(index + 1)}
                        >
                            <div>
                                <TrackMetadataInfoItem
                                    label={messages('tracks.label')}
                                >
                                    {renderField(
                                        index,
                                        messages('tracks.name'),
                                        'title',
                                        true
                                    )}
                                    {renderField(index, 'ISRC', 'isrc')}
                                    {/* {renderField(index, 'ISWC', 'iswc')} */}
                                    {renderField(
                                        index,
                                        messages('formFields.tracks.version'),
                                        'version'
                                    )}
                                    {renderField(
                                        index,
                                        messages('genres.primary'),
                                        'primaryGenreId',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.tracks.subGenres'),
                                        'subGenreId'
                                    )}
                                </TrackMetadataInfoItem>

                                {/* Thông tin nghệ sĩ */}
                                <TrackMetadataInfoItem
                                    label={messages('artist.label')}
                                >
                                    {track?.trackArtists?.map(
                                        (
                                            trackArtist: TrackArtistData,
                                            index: number
                                        ) => (
                                            <ArtistItem
                                                key={index}
                                                data={{
                                                    artist: trackArtist?.artist,
                                                    role: trackArtist?.artistRole,
                                                }}
                                            />
                                        )
                                    )}
                                </TrackMetadataInfoItem>

                                {/* Các metadata khác */}
                                <TrackMetadataInfoItem
                                    label={messages('releases.otherMetadata')}
                                >
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.tracks.trackOriginTypeId'
                                        ),
                                        'originType',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('language.label'),
                                        'trackLanguage',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.pLineOwner'),
                                        'pLineOwner',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.tracks.sensitiveContent'
                                        ),
                                        'isSensitiveContent',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('trackType.label'),
                                        'trackTypeId'
                                    )}
                                </TrackMetadataInfoItem>
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                ))}
            </div>
        </div>
    );
}
