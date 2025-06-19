import TimeInput from '@/components/ui/input/time-input';
import { LabelForm } from '@/components/ui/label/labelForm';
import CountrySelect from '@/components/ui/select/country-select';
import ErrorText from '@/components/ui/text/error-text';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const audioSpecificationsSchema = z.object({
    fileName: z.string().nonempty('File name is required'),
    countryRecording: z.string().nonempty('Country recording is required'),
    previewTrack: z.string().optional(),
    hookTrack: z.string().optional(),
    recordingType: z.string().nonempty('Recording type is required'),
});

export type AudioSpecificationsSchema = z.infer<
    typeof audioSpecificationsSchema
>;

type Props = {
    trackData: TrackData;
};

export default function AudioSpecifications({ trackData }: Props) {
    const { fileData } = trackData;
    const metadata = fileData?.metadata;
    const formValues = useReleaseFormStore((state) => state.formValues);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const formMethods = useForm<AudioSpecificationsSchema>({
        defaultValues: {
            fileName: fileData?.fileName,
            countryRecording: thisTrackData?.countryRecording,
            // previewTrack: thisTrackData?.previewTrack,
            // hookTrack: thisTrackData?.hookTrack,
            recordingType: thisTrackData?.recordingType,
        },
        resolver: zodResolver(audioSpecificationsSchema),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = formMethods;
    const messages = useTranslations();
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

    useEffect(() => {
        formMethods.trigger();
    }, [fileData, trackData, formMethods]);

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
                                htmlFor="previewTrack"
                            />
                            <Controller
                                control={control}
                                name="previewTrack"
                                render={({ field }) => (
                                    <TimeInput name="previewTrack" />
                                )}
                            />
                        </div>

                        <div>
                            <LabelForm
                                label="Hook bài hát"
                                htmlFor="hookTrack"
                            />
                            <Controller
                                control={control}
                                name="hookTrack"
                                render={({ field }) => (
                                    <TimeInput name="hookTrack" />
                                )}
                            />
                        </div>
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
                </div>
            </form>
        </FormProvider>
    );
}
