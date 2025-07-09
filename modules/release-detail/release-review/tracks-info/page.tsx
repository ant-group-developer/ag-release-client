import { SIZE_ICON } from '@/constants/common';
import { getLanguageLabel } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { Collapse } from 'antd';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

    const renderField = (
        trackIndex: number,
        label: string,
        field: keyof TrackData,
        isRequired: boolean = false
    ) => {
        const error = getFieldError(trackIndex, field);
        const track = formValue.tracks?.[trackIndex];
        let value = track?.[field];

        if (field === 'languageTrack') {
            value = getLanguageLabel(typeof value === 'string' ? value : '');
        }

        if (
            field === 'pLine' &&
            value &&
            typeof value === 'object' &&
            'year' in value &&
            'name' in value
        ) {
            if (value.year && value.name) {
                value = `${value.year} ${value.name}`;
            } else {
                value = 'Thiếu năm hoặc tên bản quyền';
            }
        }

        return (
            <div className="flex justify-between">
                <div>
                    <p
                        className={cn('font-semibold', {
                            'text-red-500': error,
                        })}
                    >
                        {label} {isRequired && '*'}
                    </p>
                    {value === undefined || value === null ? (
                        <p className="text-gray-500">
                            {isRequired
                                ? messages('common.required')
                                : messages('common.optional')}
                        </p>
                    ) : (
                        <p className="mt-1">
                            {typeof value === 'boolean'
                                ? value
                                    ? messages('common.yes')
                                    : messages('common.no')
                                : Array.isArray(value)
                                  ? value.map((v) => v.name).join(', ')
                                  : String(value)}
                        </p>
                    )}
                </div>
                {error && (
                    <CircleAlert className="text-red-500" size={SIZE_ICON} />
                )}
            </div>
        );
    };

    const isHasTrack = formValue.tracks?.length ?? 0;

    return (
        <div className="my-1">
            {isHasTrack > 0 && (
                <p className="font-semibold"> {messages('tracks.label')} </p>
            )}
            <div className="flex flex-col gap-1">
                {formValue.tracks?.map((track, index) => (
                    <Collapse
                        key={String(index + 1)}
                        className="release-review-collapse !border-none !bg-card-bg !py-2"
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
                                <div className="grid grid-cols-6 bg-card-bg p-4">
                                    <span className="col-span-2 font-medium">
                                        {messages('tracks.label')} &{' '}
                                        {messages('artist.label')}
                                    </span>
                                    <div className="col-span-4 flex flex-col gap-2">
                                        {renderField(
                                            index,
                                            messages('tracks.name'),
                                            'trackName',
                                            true
                                        )}
                                        {renderField(index, 'ISRC', 'isrc')}
                                        {renderField(
                                            index,
                                            messages('artist.label'),
                                            'artists',
                                            true
                                        )}
                                        {renderField(
                                            index,
                                            messages('common.source'),
                                            'trackOrigin',
                                            true
                                        )}
                                        {renderField(
                                            index,
                                            messages(
                                                'formFields.tracks.languageTrack'
                                            ),
                                            'languageTrack',
                                            true
                                        )}
                                        {renderField(
                                            index,
                                            'Bản quyền ghi âm',
                                            'pLine',
                                            true
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 bg-card-bg p-4">
                                    <span className="col-span-2 font-medium">
                                        {messages('releases.otherMetadata')}
                                    </span>
                                    <div className="col-span-4 flex flex-col gap-2">
                                        {renderField(
                                            index,
                                            messages(
                                                'formFields.tracks.genres'
                                            ),
                                            'genres',
                                            true
                                        )}
                                        {renderField(
                                            index,
                                            messages(
                                                'formFields.tracks.subGenres'
                                            ),
                                            'subGenres'
                                        )}
                                        {renderField(
                                            index,
                                            messages(
                                                'formFields.tracks.sensitiveContent'
                                            ),
                                            'isSensitiveContent',
                                            true
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                ))}
            </div>
        </div>
    );
}
