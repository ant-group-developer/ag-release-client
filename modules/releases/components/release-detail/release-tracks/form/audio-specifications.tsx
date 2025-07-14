import { LabelForm } from '@/components/ui/label/labelForm';
import CountrySelect from '@/components/ui/select/country-select';
import ErrorText from '@/components/ui/text/error-text';
import { timeStringToSeconds } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { Input, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const audioSpecificationsSchema = (messages: any, maxDuration: number) =>
    z.object({
        fileName: z.string().nonempty(messages('validation.input')),
        countryRecording: z.string().nonempty(messages('validation.input')),
        previewTrack: z
            .string()
            .nonempty('Đoạn nghe mẫu là bắt buộc')
            .refine((val) => timeStringToSeconds(val) <= maxDuration, {
                message: 'Thời gian không được lớn hơn thời lượng bài hát',
            }),
        // hookTrack: z
        //     .string()
        //     .nonempty('Hook bài hát là bắt buộc')
        //     .refine((val) => timeStringToSeconds(val) <= maxDuration, {
        //         message: 'Thời gian không được lớn hơn thời lượng bài hát',
        //     }),
        recordingType: z.string().nonempty(messages('validation.input')),
    });

export type AudioSpecificationsSchema = z.infer<
    ReturnType<typeof audioSpecificationsSchema>
>;

type Props = {
    trackData: TrackData;
};

export default function AudioSpecifications({ trackData }: Props) {
    const messages = useTranslations();
    // const { fileData } = trackData;
    // const metadata = fileData?.metadata;
    const formValues = useReleaseFormStore((state) => state.formValues);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const formMethods = useForm<AudioSpecificationsSchema>({
        // defaultValues: {
        //     fileName: fileData?.fileName,
        //     countryRecording: thisTrackData?.countryRecording,
        //     previewTrack: '',
        //     // hookTrack: '00:00:00',
        //     recordingType: thisTrackData?.recordingType,
        // },
        // mode: 'onChange',
        // resolver: zodResolver(
        //     audioSpecificationsSchema(messages, trackData.songInfo.duration)
        // ),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = formMethods;
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const onSubmit = (data: AudioSpecificationsSchema) => {
        const newValue = {
            ...formValues,
            tracks: formValues?.tracks?.map((track: any) => {
                if (track.id === trackData.id) {
                    return {
                        ...track,
                        ...data,
                    };
                }
                return track;
            }),
        };
        setFormValues(newValue);
    };

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

    // useEffect(() => {
    //     formMethods.trigger();
    // }, [fileData, trackData, formMethods]);

    return (
        <FormProvider {...formMethods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <LabelForm label="Tên File" required />
                        <Controller
                            control={control}
                            name="fileName"
                            render={({ field }) => <Input {...field} />}
                        />
                        <ErrorText
                            isError={!!errors.fileName}
                            message={errors.fileName?.message}
                        />
                    </div>

                    <div>
                        <LabelForm label="Quốc gia ghi âm" required />
                        <Controller
                            control={control}
                            name="countryRecording"
                            render={({ field }) => (
                                <CountrySelect
                                    status={
                                        errors.countryRecording
                                            ? 'error'
                                            : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    showSearch
                                />
                            )}
                        />
                        <ErrorText
                            isError={!!errors.countryRecording}
                            message={errors.countryRecording?.message}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <LabelForm
                                label="Đoạn nghe mẫu"
                                required
                                htmlFor="previewTrack"
                            />
                            <Controller
                                control={control}
                                name="previewTrack"
                                render={({ field }) => (
                                    <TimePicker
                                        {...field}
                                        value={
                                            field.value
                                                ? dayjs(field.value, 'HH:mm:ss')
                                                : null
                                        }
                                        onChange={(time) => {
                                            field.onChange(
                                                time
                                                    ? time.format('HH:mm:ss')
                                                    : ''
                                            );
                                        }}
                                        onBlur={field.onBlur}
                                        size="large"
                                        format="HH:mm:ss"
                                        status={
                                            !!errors.previewTrack
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <ErrorText
                                isError={!!errors.previewTrack}
                                message={errors.previewTrack?.message}
                            />
                        </div>

                        {/* <div>
                            <LabelForm
                                label="Hook bài hát"
                                required
                                htmlFor="hookTrack"
                            />
                            <Controller
                                control={control}
                                name="hookTrack"
                                render={({ field }) => (
                                    <TimePicker
                                        {...field}
                                        value={
                                            field.value
                                                ? dayjs(field.value, 'HH:mm:ss')
                                                : null
                                        }
                                        onChange={(time) => {
                                            field.onChange(
                                                time
                                                    ? time.format('HH:mm:ss')
                                                    : ''
                                            );
                                        }}
                                        onBlur={field.onBlur}
                                        defaultValue={dayjs(
                                            '00:00:00',
                                            'HH:mm:ss'
                                        )}
                                        size="large"
                                        format="HH:mm:ss"
                                    />
                                )}
                            />
                            <ErrorText
                                isError={!!errors.hookTrack}
                                message={errors.hookTrack?.message}
                            />
                        </div> */}
                    </div>
                    <div>
                        <LabelForm
                            label="Thể loại bản ghi"
                            required
                            htmlFor="recordingType"
                        />
                        <Controller
                            control={control}
                            name="recordingType"
                            render={({ field }) => (
                                <Select
                                    status={
                                        errors.recordingType
                                            ? 'error'
                                            : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    options={[
                                        {
                                            label: 'Sound Recording (Music work)',
                                            value: '1',
                                        },
                                        {
                                            label: 'Sound Recording (Non music work)',
                                            value: '2',
                                        },
                                    ]}
                                    showSearch
                                />
                            )}
                        />
                        <ErrorText
                            isError={!!errors.recordingType}
                            message={errors.recordingType?.message}
                        />
                    </div>
                </div>
                {/* 
                <div className="grid grid-cols-7 rounded-md border p-2">
                    <div>
                        <p className="font-bold">Codec</p>
                        <p className="text-xs">{metadata?.codec}</p>
                    </div>
                    <div>
                        <p className="font-bold">Bit Depth</p>
                        <p className="text-xs">{metadata?.bitDepth}</p>
                    </div>
                    <div>
                        <p className="font-bold">Bitrate</p>
                        <p className="text-xs">{metadata?.bitrate}</p>
                    </div>
                    <div>
                        <p className="font-bold">Format</p>
                        <p className="text-xs">{metadata?.format}</p>
                    </div>
                    <div>
                        <p className="font-bold">Channels</p>
                        <p className="text-xs">{metadata?.channels}</p>
                    </div>
                    <div>
                        <p className="font-bold">Sample Rate</p>
                        <p className="text-xs">{metadata?.sampleRate}</p>
                    </div>
                    <div>
                        <p className="font-bold">MQS</p>
                        <p className="text-xs">{metadata?.mqs}</p>
                    </div>
                </div> */}
            </form>
        </FormProvider>
    );
}
