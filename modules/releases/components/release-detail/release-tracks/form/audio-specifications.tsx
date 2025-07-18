import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const audioSpecificationsSchema = (messages: any) =>
    releaseTrackSchema(messages).pick({
        audioFile: true,
        trackLanguage: true,
        trackTypeId: true,
    });

export type AudioSpecificationsSchema = z.infer<
    ReturnType<typeof audioSpecificationsSchema>
>;

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
};

export default function AudioSpecifications({
    trackData,
    updateTrackDraft,
}: Props) {
    const messages = useTranslations();

    const formValues = useReleaseFormStore((state) => state.formValues);

    const getAudioFileDefault = () => ({
        file: {
            fileName: trackData?.audioFile?.file?.fileName ?? '',
        },
        preview: trackData?.audioFile?.preview ?? 0,
    });
    const formMethods = useForm<AudioSpecificationsSchema>({
        defaultValues: {
            audioFile: getAudioFileDefault(),
            trackLanguage: trackData?.trackLanguage ?? {},
            trackTypeId: trackData?.trackTypeId ?? '',
        },
        mode: 'onChange',
        resolver: zodResolver(audioSpecificationsSchema(messages)),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = formMethods;
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const onSubmit = (data: AudioSpecificationsSchema) => {};

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: any) => {
                if (track.id === trackData.id) {
                    return {
                        ...track,
                        ...watchedAllFields,
                    };
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

    return (
        <FormProvider {...formMethods}>
            <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        name="audioFile.file.fileName"
                        label="Tên File"
                        required
                        ErrorMessage={errors.audioFile?.file?.fileName?.message}
                    >
                        <Controller
                            control={control}
                            name="audioFile.file.fileName"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    status={
                                        errors.audioFile?.file?.fileName
                                            ? 'error'
                                            : undefined
                                    }
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        updateTrackDraft({
                                            audioFile: {
                                                ...formMethods.getValues(
                                                    'audioFile'
                                                ),
                                                file: {
                                                    ...formMethods.getValues(
                                                        'audioFile.file'
                                                    ),
                                                    fileName: e.target.value,
                                                },
                                            },
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackLanguage.recordingCountryId"
                        label={messages('tracks.recordingCountry')}
                        required
                        ErrorMessage={
                            errors.trackLanguage?.recordingCountryId?.message
                        }
                    >
                        <Controller
                            control={control}
                            name="trackLanguage.recordingCountryId"
                            render={({ field }) => (
                                <CountrySelect
                                    status={
                                        errors.trackLanguage?.recordingCountryId
                                            ? 'error'
                                            : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    value={field.value ?? ''}
                                    showSearch
                                    onChange={(e) => {
                                        field.onChange(e);
                                        updateTrackDraft({
                                            trackLanguage: {
                                                ...formMethods.getValues(
                                                    'trackLanguage'
                                                ),
                                                recordingCountryId: e,
                                            },
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="audioFile.preview"
                        label="Đoạn nghe mẫu"
                        required
                        ErrorMessage={errors.audioFile?.preview?.message}
                    >
                        <Controller
                            control={control}
                            name="audioFile.preview"
                            render={({ field }) => (
                                <TimePicker
                                    {...field}
                                    value={
                                        typeof field.value === 'number' &&
                                        field.value > 0
                                            ? dayjs(
                                                  convertSecondsToHoursMinutes(
                                                      field.value
                                                  ),
                                                  DATE_FORMAT.HOUR_MINUTE_SECOND
                                              )
                                            : null
                                    }
                                    onChange={(time) => {
                                        const value = time
                                            ? time.format(
                                                  DATE_FORMAT.HOUR_MINUTE_SECOND
                                              )
                                            : '';
                                        const seconds = value
                                            ? timeStringToSeconds(value)
                                            : 0;
                                        field.onChange(seconds);
                                        updateTrackDraft({
                                            audioFile: {
                                                ...formMethods.getValues(
                                                    'audioFile'
                                                ),
                                                preview: seconds,
                                            },
                                        });
                                    }}
                                    onBlur={field.onBlur}
                                    size="middle"
                                    format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                    status={
                                        !!errors.audioFile?.preview
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackTypeId"
                        label={messages('trackType.label')}
                        required
                        ErrorMessage={errors.trackTypeId?.message}
                    >
                        <Controller
                            control={control}
                            name="trackTypeId"
                            render={({ field }) => (
                                <TrackTypesSelect
                                    status={
                                        errors.trackTypeId ? 'error' : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    value={field.value ?? ''}
                                    showSearch
                                    onChange={(e) => {
                                        field.onChange(e);
                                        updateTrackDraft({ trackTypeId: e });
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </form>
        </FormProvider>
    );
}
