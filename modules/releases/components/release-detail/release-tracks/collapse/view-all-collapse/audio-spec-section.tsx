import FormItem from '@/components/ui/react-hook-form/form-item';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, TimePicker } from 'antd';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any, fieldName?: string) => void;
    trackData: TrackData;
};

export default function AudioSpecSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();
    const formMethods = useForm({
        defaultValues: {
            audioFile: {
                preview: trackData?.audioFile?.preview,
                file: {
                    fileName: trackData?.audioFile?.file?.fileName,
                },
            },
            trackLanguage: trackData?.trackLanguage,
            trackTypeId: trackData?.trackTypeId,
        },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
    });
    const {
        control,
        formState: { errors },
    } = formMethods;
    return (
        <CollapseItem
            defaultActiveKey={['audio-specs']}
            items={[
                {
                    key: 'audio-specs',
                    label: (
                        <Title level={5} className="!mb-0">
                            {messages('tracks.audioSpecification')}
                        </Title>
                    ),
                    children: (
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormItem
                                    name="audioFile.file.fileName"
                                    label={messages('common.fileName')}
                                    required
                                    ErrorMessage={
                                        errors.audioFile?.file?.fileName
                                            ?.message
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
                                                    errors.audioFile?.file
                                                        ?.fileName
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    name="audioFile.preview"
                                    label={messages(
                                        'formFields.tracks.preview'
                                    )}
                                    required
                                    ErrorMessage={
                                        errors.audioFile?.preview?.message
                                    }
                                >
                                    <Controller
                                        control={control}
                                        name="audioFile.preview"
                                        render={({ field }) => (
                                            <TimePicker
                                                id={`tracks.${index}.preview`}
                                                className="w-full"
                                                showNow={false}
                                                {...field}
                                                value={
                                                    typeof field.value ===
                                                        'number' &&
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
                                                        ? timeStringToSeconds(
                                                              value
                                                          )
                                                        : 0;
                                                    field.onChange(seconds);
                                                    debouncedUpdateTrackDraft({
                                                        audioFile: {
                                                            preview: seconds,
                                                        },
                                                    });
                                                }}
                                                onBlur={field.onBlur}
                                                size="middle"
                                                format={
                                                    DATE_FORMAT.HOUR_MINUTE_SECOND
                                                }
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
                                            <p className="font-bold">
                                                Bit Depth
                                            </p>
                                            <p>
                                                {trackData.audioFile.bitDepth ??
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">Bitrate</p>
                                            <p>
                                                {trackData.audioFile.bitrate ??
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">Format</p>
                                            <p>
                                                {trackData.audioFile.file?.extension?.toUpperCase() ||
                                                    'WAVE'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                Sample Rate
                                            </p>
                                            <p>
                                                {trackData.audioFile
                                                    .sampleRate ?? '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
