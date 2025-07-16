import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const audioSpecificationsSchema = (messages: any, maxDuration: number) =>
    z.object({
        fileName: z.string().nonempty(messages('validation.input')),
        recordingCountry: z.string().nonempty(messages('validation.input')),
        previewTrack: z
            .string()
            .nonempty('Đoạn nghe mẫu là bắt buộc')
            .refine((val) => timeStringToSeconds(val) <= maxDuration, {
                message: 'Thời gian không được lớn hơn thời lượng bài hát',
            }),
        trackTypes: z.string().nonempty(messages('validation.input')),
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

    const formMethods = useForm<AudioSpecificationsSchema>({
        defaultValues: {
            fileName: trackData?.audioFile?.file?.fileName,
            recordingCountry: trackData?.trackLanguage?.recordingCountryId,
            trackTypes: trackData?.trackTypeId,
            previewTrack: trackData?.audioFile?.preview
                ? convertSecondsToHoursMinutes(trackData.audioFile.preview)
                : '',
        },
        mode: 'onChange',
        resolver: zodResolver(
            audioSpecificationsSchema(
                messages,
                trackData?.audioFile?.duration ?? 0
            )
        ),
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
                        name="fileName"
                        label="Tên File"
                        required
                        ErrorMessage={errors.fileName?.message}
                    >
                        <Controller
                            control={control}
                            name="fileName"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    status={
                                        errors.fileName ? 'error' : undefined
                                    }
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        updateTrackDraft({
                                            audioFile: {
                                                file: {
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
                        name="recordingCountry"
                        label={messages('tracks.recordingCountry')}
                        required
                        ErrorMessage={errors.recordingCountry?.message}
                    >
                        <Controller
                            control={control}
                            name="recordingCountry"
                            render={({ field }) => (
                                <CountrySelect
                                    status={
                                        errors.recordingCountry
                                            ? 'error'
                                            : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    showSearch
                                    onChange={(e) => {
                                        field.onChange(e);
                                        updateTrackDraft({
                                            trackLanguage: {
                                                audioLanguageId: e,
                                            },
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="previewTrack"
                        label="Đoạn nghe mẫu"
                        required
                        ErrorMessage={errors.previewTrack?.message}
                    >
                        <Controller
                            control={control}
                            name="previewTrack"
                            render={({ field }) => (
                                <TimePicker
                                    {...field}
                                    value={
                                        field.value
                                            ? dayjs(
                                                  typeof field.value ===
                                                      'number'
                                                      ? convertSecondsToHoursMinutes(
                                                            field.value
                                                        )
                                                      : field.value,
                                                  DATE_FORMAT.HOUR_MINUTE
                                              )
                                            : null
                                    }
                                    onChange={(time) => {
                                        const value = time
                                            ? time.format(
                                                  DATE_FORMAT.HOUR_MINUTE
                                              )
                                            : '';
                                        field.onChange(value);
                                        updateTrackDraft({
                                            audioFile: {
                                                preview: value
                                                    ? timeStringToSeconds(value)
                                                    : 0,
                                            },
                                        });
                                    }}
                                    onBlur={field.onBlur}
                                    size="middle"
                                    format={DATE_FORMAT.HOUR_MINUTE}
                                    status={
                                        !!errors.previewTrack
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackTypes"
                        label={messages('trackType.label')}
                        required
                        ErrorMessage={errors.trackTypes?.message}
                    >
                        <Controller
                            control={control}
                            name="trackTypes"
                            render={({ field }) => (
                                <TrackTypesSelect
                                    status={
                                        errors.trackTypes ? 'error' : undefined
                                    }
                                    className="w-full"
                                    {...field}
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
