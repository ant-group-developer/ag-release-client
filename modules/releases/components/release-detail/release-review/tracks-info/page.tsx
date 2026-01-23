import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import type { TrackData } from '@/modules/releases/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TrackContributorData } from '@/modules/track-contributor/types';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Collapse, Skeleton } from 'antd';
import { CircleCheck, OctagonAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import ArtistItem from '../metadata-info/artist-item';

type Props = {};

export default function TracksInfo({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const releaseId = params['release-id'];
    const formValue = useReleaseFormStore((state) => state.formValues);
    const { tracksData, isFetching: isTracksFetching } = useGetListTracks({
        releaseId: formValue?.id,
        fieldOrder: 'order',
    });
    const { releaseValidateData } = useReleaseValidate(releaseId as string);

    type TrackLanguageField =
        | 'trackLanguage.audioLanguage'
        | 'trackLanguage.metadataLanguageCountry'
        | 'trackLanguage.recordingCountry'
        | 'trackLanguage.metadataLanguageId';

    // Hàm lấy giá trị hiển thị cho từng field
    const getFieldValue = (
        track: TrackData | undefined,
        field: keyof TrackData | TrackLanguageField
    ) => {
        if (!track) return '';

        switch (field) {
            case 'trackLanguage.audioLanguage':
                return track?.trackLanguage?.audioLanguage?.name ?? '';

            case 'trackLanguage.metadataLanguageCountry':
                return (
                    track?.trackLanguage?.metadataLanguageCountry?.name ?? ''
                );

            case 'trackLanguage.metadataLanguageId':
                return track?.trackLanguage?.metadataLanguage?.name ?? '';

            case 'trackLanguage.recordingCountry':
                return track?.trackLanguage?.recordingCountry?.name ?? '';

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

            case 'preview':
                return track?.audioFile?.preview
                    ? convertSecondsToHoursMinutes(
                          Number(track?.audioFile?.preview)
                      )
                    : '';

            case 'sampleLength':
                return track?.audioFile?.sampleLength
                    ? convertSecondsToHoursMinutes(
                          Number(track?.audioFile?.sampleLength)
                      )
                    : '';

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
        field: keyof TrackData | TrackLanguageField,
        isRequired: boolean = false
    ) => {
        const track = tracksData?.items[trackIndex];
        const value = getFieldValue(track, field);
        return (
            <div className="rounded-lg border px-4 py-2">
                <div>
                    <p className="font-medium">
                        {label}{' '}
                        {isRequired && <span className="text-red-500">*</span>}
                    </p>
                    {!value ? (
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

    if (isTracksFetching) {
        return (
            <div className="w-full space-y-4">
                <Skeleton.Node active className="!block !h-12 !w-full" />
                <Skeleton.Node active className="!block !h-12 !w-full" />
                <Skeleton.Node active className="!block !h-12 !w-full" />
                <Skeleton.Node active className="!block !h-12 !w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* <p className="font-semibold"> {messages('track.label')} </p> */}

            {/* <div className="mb-2 rounded-lg bg-[#f5f5f5] p-4 dark:bg-zinc-900">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div> */}

            <div className="m-auto flex w-full flex-col gap-2">
                {tracksData?.items?.map((track: TrackData, index: number) => {
                    const trackArtists = track?.trackArtists;
                    const trackContributors = track?.trackContributors;
                    const errorCount = releaseValidateData?.reduce(
                        (pre, current) => {
                            if (current?.trackId === track.id) {
                                return pre + 1;
                            }
                            return pre;
                        },
                        0
                    );

                    return (
                        <Collapse key={String(index + 1)}>
                            <Collapse.Panel
                                header={
                                    <div className="flex justify-between">
                                        <span className="text-base">
                                            {index + 1}.{track.title || 'Track'}
                                        </span>
                                        {errorCount > 0 && (
                                            <div className="flex items-center gap-1 text-red-500">
                                                <span>{errorCount}</span>
                                                <CustomTooltip
                                                    title={`${errorCount} ${messages(
                                                        'common.errors'
                                                    )}`}
                                                >
                                                    <OctagonAlert
                                                        size={SIZE_ICON}
                                                    />
                                                </CustomTooltip>
                                            </div>
                                        )}
                                        {errorCount <= 0 && (
                                            <CircleCheck
                                                className="text-green-500"
                                                size={SIZE_ICON}
                                            />
                                        )}
                                    </div>
                                }
                                key={String(index + 1)}
                            >
                                <div className="m-auto grid max-w-5xl grid-cols-2 gap-4 px-4">
                                    {renderField(
                                        index,
                                        messages('track.name'),
                                        'title',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.tracks.version'),
                                        'version'
                                    )}

                                    <div className="rounded-lg border bg-white px-4 py-2">
                                        <p className="font-medium">
                                            {messages('artist.artists')}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        {trackArtists?.map(
                                            (
                                                trackArtist: TrackArtistData,
                                                index: number
                                            ) => (
                                                <ArtistItem
                                                    key={trackArtist.id}
                                                    data={{
                                                        artist: trackArtist?.artist,
                                                        // role: trackArtist?.artistRole,
                                                    }}
                                                />
                                            )
                                        )}
                                        {(!trackArtists ||
                                            trackArtists?.length <= 0) && (
                                            <p className="text-red-500">
                                                {messages('common.required')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg border bg-white px-4 py-2">
                                        <p className="font-medium">
                                            {messages('common.contributors')}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        {trackContributors?.map(
                                            (
                                                item: TrackContributorData,
                                                index: number
                                            ) => (
                                                <ArtistItem
                                                    key={item.id}
                                                    data={{
                                                        artist: item?.artist,
                                                        role: item?.artistRole,
                                                    }}
                                                />
                                            )
                                        )}
                                        {(!trackContributors ||
                                            trackContributors?.length <= 0) && (
                                            <p className="text-red-500">
                                                {messages('common.required')}
                                            </p>
                                        )}
                                    </div>

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
                                    {renderField(index, 'ISRC', 'isrc')}
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
                                        messages('formFields.audioLanguageId'),
                                        'trackLanguage.audioLanguage',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.metadataLanguageCountryId'
                                        ),
                                        'trackLanguage.metadataLanguageCountry',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.recordingCountryId'
                                        ),
                                        'trackLanguage.recordingCountry',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.metaDataLanguage'),
                                        'trackLanguage.metadataLanguageId',
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
                                    {renderField(
                                        index,
                                        messages('formFields.pLineOwner'),
                                        'pLineOwner',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.pLineYear'),
                                        'pLineYear',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages('formFields.preview'),
                                        'preview',
                                        true
                                    )}
                                    {renderField(
                                        index,
                                        messages(
                                            'formFields.tracks.sampleLength'
                                        ),
                                        'sampleLength',
                                        true
                                    )}
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    );
                })}
            </div>
        </div>
    );
}
