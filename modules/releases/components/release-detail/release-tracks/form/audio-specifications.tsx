import FormItem from '@/components/ui/react-hook-form/form-item';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigProvider, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
};

export default function AudioSpecifications({ trackData }: Props) {
    // hooks - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { action } = useGetReleaseDetailRoute();
    const getAudioFileDefault = () => ({
        file: {
            fileName: trackData?.audioFile?.file?.fileName ?? '',
        },
        preview: trackData?.audioFile?.preview ?? 0,
        sampleLength: trackData?.audioFile?.sampleLength ?? 0,
        duration: trackData?.audioFile?.duration ?? 0,
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
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
    } = formMethods;

    const { updateTrackDraft } = useUpdateTrackDraft();
    const debouncedUpdateTrackDraft = useCallback(
        debounce(async (data: any, fieldName?: string) => {
            if (fieldName) {
                const isValid = await trigger(
                    fieldName as keyof AudioSpecificationsSchema
                );
                if (!isValid) return;
            }
            if (!formValues.id) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id: trackData.id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 500),
        [formValues.id]
    );

    return (
        <ConfigProvider componentDisabled={isReadMode}>
            <FormProvider {...formMethods}>
                <form className="space-y-4 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <FormItem
                                name="audioFile.file.fileName"
                                label={messages('common.fileName')}
                                required
                                ErrorMessage={
                                    errors.audioFile?.file?.fileName?.message
                                }
                            >
                                <Controller
                                    control={control}
                                    name="audioFile.file.fileName"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            readOnly={true}
                                            status={
                                                errors.audioFile?.file?.fileName
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <FormItem
                            name="audioFile.sampleLength"
                            label={messages('formFields.tracks.sampleLength')}
                            required
                            ErrorMessage={
                                errors.audioFile?.sampleLength?.message
                            }
                        >
                            <Controller
                                control={control}
                                name="audioFile.sampleLength"
                                render={({ field }) => (
                                    <TimePicker
                                        className="w-full"
                                        showNow={false}
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
                                            debouncedUpdateTrackDraft(
                                                {
                                                    audioFile: {
                                                        sampleLength: seconds,
                                                    },
                                                },
                                                'audioFile.sampleLength'
                                            );
                                        }}
                                        onBlur={field.onBlur}
                                        size="middle"
                                        format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                        status={
                                            !!errors.audioFile?.sampleLength
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="audioFile.preview"
                            label={messages('formFields.tracks.preview')}
                            required
                            ErrorMessage={errors.audioFile?.preview?.message}
                        >
                            <Controller
                                control={control}
                                name="audioFile.preview"
                                render={({ field }) => (
                                    <TimePicker
                                        className="w-full"
                                        showNow={false}
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
                                            debouncedUpdateTrackDraft(
                                                {
                                                    audioFile: {
                                                        preview: seconds,
                                                    },
                                                },
                                                'audioFile.preview'
                                            );
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
                    </div>
                    {trackData.audioFile && (
                        <div className="mt-6 overflow-hidden rounded-md border">
                            <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                                <div>
                                    <p className="font-bold">Bit Depth</p>
                                    <p>{trackData.audioFile.bitDepth ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Bitrate</p>
                                    <p>{trackData.audioFile.bitrate ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Format</p>
                                    <p>
                                        {trackData.audioFile.file?.extension?.toUpperCase() ||
                                            'WAVE'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-bold">Sample Rate</p>
                                    <p>
                                        {trackData.audioFile.sampleRate ?? '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </FormProvider>
        </ConfigProvider>
    );
}
