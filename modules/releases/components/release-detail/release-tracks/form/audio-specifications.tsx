import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import { timeStringToSeconds } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
    updateTrackDraft: (data: any) => void;
};

export default function AudioSpecifications({
    trackData,
    updateTrackDraft,
}: Props) {
    const messages = useTranslations();
    // const { fileData } = trackData;
    // const metadata = fileData?.metadata;
    const formValues = useReleaseFormStore((state) => state.formValues);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const formMethods = useForm<AudioSpecificationsSchema>({
        defaultValues: {
            fileName: trackData?.title,
            countryRecording: thisTrackData?.recordingCountryId,
        },
        mode: 'onChange',
        resolver: zodResolver(
            audioSpecificationsSchema(
                messages,
                trackData?.audioFileBucket?.duration ?? 0
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

    // useEffect(() => {
    //     formMethods.trigger();
    // }, [fileData, trackData, formMethods]);

    return (
        <FormProvider {...formMethods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                                        field.onChange(e);
                                        updateTrackDraft({
                                            fileName: e.target.value,
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="countryRecording"
                        label="Quốc gia ghi âm"
                        required
                        ErrorMessage={errors.countryRecording?.message}
                    >
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
                                    onChange={(e) => {
                                        field.onChange(e);
                                        updateTrackDraft({
                                            countryRecordingId: e,
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
                                            ? dayjs(field.value, 'HH:mm:ss')
                                            : null
                                    }
                                    onChange={(time) => {
                                        const value = time
                                            ? time.format('HH:mm:ss')
                                            : '';
                                        field.onChange(value);
                                        updateTrackDraft({
                                            previewTrack: value,
                                        });
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
                    </FormItem>

                    <FormItem
                        name="recordingType"
                        label="Thể loại bản ghi"
                        required
                        ErrorMessage={errors.recordingType?.message}
                    >
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
                                    onChange={(e) => {
                                        field.onChange(e);
                                        updateTrackDraft({ recordingType: e });
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                {/* Các phần khác nếu có */}
            </form>
        </FormProvider>
    );
}
