import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import type { TrackData } from '@/modules/releases/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Collapse } from 'antd';
import { useTranslations } from 'next-intl';
import ArtistItem from '../metadata-info/artist-item';
import TrackMetadataInfoItem from './track-metadata-info-item';

type Props = {};

export default function TracksInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const { tracksData } = useGetListTracks({
        releaseId: formValue?.id,
        fieldOrder: 'order',
    });

    // Hàm lấy giá trị hiển thị cho từng field
    const getFieldValue = (
        track: TrackData | undefined,
        field: keyof TrackData
    ) => {
        if (!track) return '';

        switch (field) {
            case 'trackLanguage': {
                if (typeof track.trackLanguage === 'object') {
                    const lang = track.trackLanguage;
                    const audioLang = lang?.audioLanguage?.name;
                    const country = lang?.metadataLanguageCountry?.name;
                    const recordingCountry = (lang as any)?.recordingCountry
                        ?.name;

                    return (
                        <div className="mt-1">
                            {audioLang && (
                                <div>
                                    {messages('track.language')}: {audioLang}
                                </div>
                            )}
                            {country && (
                                <div>
                                    {messages('common.language')} metadata:{' '}
                                    {country}
                                </div>
                            )}
                            {recordingCountry && (
                                <div>
                                    {messages('track.recordingCountry')}:{' '}
                                    {recordingCountry}
                                </div>
                            )}
                        </div>
                    );
                }
                return '';
            }

            case 'primaryGenreId':
                return track.primaryGenre?.name || track.primaryGenreId || '';

            case 'subGenreId':
                return track.subGenre?.name || track.subGenreId || '';

            case 'trackSensitiveId':
                return (
                    track.trackSensitive?.name || track.trackSensitiveId || ''
                );

            case 'pLineOwner':
                return `${track.pLineYear ?? ''}  ${track.pLineOwner ?? ''}`.trim();

            case 'trackTypeId':
                return track.trackType?.name || track.trackTypeId || '';

            case 'trackOriginTypeId':
                return (
                    track.trackOriginType?.name || track.trackOriginTypeId || ''
                );

            case 'trackTypeId':
                return track.trackType?.name || track.trackTypeId || '';

            default: {
                const value = track[field];
                if (typeof value === 'boolean') {
                    return value
                        ? messages('common.yes')
                        : messages('common.no');
                }
                return value !== undefined && value !== null
                    ? String(value)
                    : '';
            }
        }
    };

    const renderField = (
        trackIndex: number,
        label: string,
        field: keyof TrackData,
        isRequired: boolean = false
    ) => {
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
                {/* {error && (
                    <AlertCircle className="text-red-500" size={SIZE_ICON} />
                )} */}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {/* <p className="font-semibold"> {messages('track.label')} </p> */}

            {/* <div className="mb-2 rounded-lg bg-[#f5f5f5] p-4 dark:bg-zinc-900">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div> */}

            <div className="flex flex-col gap-2">
                {tracksData?.items?.map((track: TrackData, index: number) => (
                    <Collapse
                        key={String(index + 1)}
                        className="release-review-collapse !border-none !bg-main !py-2 dark:!bg-zinc-900"
                        size="small"
                        bordered={false}
                    >
                        <Collapse.Panel
                            header={
                                <span className="text-base font-medium">
                                    {index + 1}.{track.title || 'Track'}
                                </span>
                            }
                            key={String(index + 1)}
                        >
                            <div>
                                <TrackMetadataInfoItem
                                    label={messages('track.label')}
                                >
                                    {renderField(
                                        index,
                                        messages('track.name'),
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
                                                key={trackArtist.id}
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
                                    label={messages('release.otherMetadata')}
                                >
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.tracks.trackOriginTypeId'
                                        ),
                                        'trackOriginTypeId',
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
                                        'trackSensitiveId',
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
