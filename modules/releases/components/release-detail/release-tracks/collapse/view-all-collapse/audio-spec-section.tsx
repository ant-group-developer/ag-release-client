'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Form, Input, TimePicker } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function AudioSpecSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();
    const form = Form.useFormInstance();
    const { action } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    const updateTrackDraft = async (data: any, fieldName?: NamePath) => {
        if (fieldName) {
            try {
                await form.validateFields([fieldName]);
            } catch {
                return;
            }
        }
        debouncedUpdateTrackDraft(data);
    };

    const handleOnChangePreview = async (time: dayjs.Dayjs | null) => {
        form.setFieldValue(['audioFile', 'preview'], time);

        try {
            // Validate cả preview và sampleLength
            await form.validateFields([
                ['audioFile', 'preview'],
                ['audioFile', 'sampleLength'],
            ]);

            // Chỉ update khi validate OK
            updateTrackDraft(
                {
                    audioFile: {
                        preview: time
                            ? timeStringToSeconds(
                                  time.format(DATE_FORMAT.HOUR_MINUTE_SECOND)
                              )
                            : 0,
                    },
                },
                ['audioFile', 'preview']
            );
        } catch (error) {
            // Validate failed, không update
            return;
        }
    };

    const handleOnChangeSampleLength = async (time: dayjs.Dayjs | null) => {
        form.setFieldValue(['audioFile', 'sampleLength'], time);

        try {
            // Validate cả sampleLength và preview
            await form.validateFields([
                ['audioFile', 'sampleLength'],
                ['audioFile', 'preview'],
            ]);

            // Chỉ update khi validate OK
            updateTrackDraft(
                {
                    audioFile: {
                        sampleLength: time
                            ? timeStringToSeconds(
                                  time.format(DATE_FORMAT.HOUR_MINUTE_SECOND)
                              )
                            : 0,
                    },
                },
                ['audioFile', 'sampleLength']
            );
        } catch (error) {
            // Validate failed, không update
            return;
        }
    };

    const validatePreview = (messages: any, form: any) => {
        return (_: any, value: dayjs.Dayjs | null) => {
            if (!value || !dayjs.isDayjs(value)) {
                return Promise.reject(messages('validation.input'));
            }

            const previewSeconds = timeStringToSeconds(
                value.format(DATE_FORMAT.HOUR_MINUTE_SECOND)
            );

            const durationRaw = form.getFieldValue(['audioFile', 'duration']);
            const durationSeconds =
                typeof durationRaw === 'string'
                    ? timeStringToSeconds(durationRaw)
                    : durationRaw;

            if (durationSeconds != null && previewSeconds >= durationSeconds) {
                return Promise.reject(
                    messages('track.validation.previewMustBeLessThanDuration')
                );
            }

            return Promise.resolve();
        };
    };

    const validateSampleLength = (messages: any, form: any) => {
        return (_: any, value: dayjs.Dayjs | null) => {
            if (!value || !dayjs.isDayjs(value)) {
                return Promise.reject(messages('validation.input'));
            }

            const sampleSeconds = timeStringToSeconds(
                value.format(DATE_FORMAT.HOUR_MINUTE_SECOND)
            );

            const durationRaw = form.getFieldValue(['audioFile', 'duration']);
            const durationSeconds =
                typeof durationRaw === 'string'
                    ? timeStringToSeconds(durationRaw)
                    : durationRaw;

            const previewValue = form.getFieldValue(['audioFile', 'preview']);
            const previewSeconds = dayjs.isDayjs(previewValue)
                ? timeStringToSeconds(
                      previewValue.format(DATE_FORMAT.HOUR_MINUTE_SECOND)
                  )
                : 0;

            if (
                durationSeconds != null &&
                sampleSeconds > durationSeconds - previewSeconds
            ) {
                return Promise.reject(
                    messages(
                        'track.validation.sampleLengthMustBeLessThanDuration'
                    )
                );
            }

            return Promise.resolve();
        };
    };

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <CollapseItem
                defaultActiveKey={['audio-specs']}
                items={[
                    {
                        key: 'audio-specs',
                        label: (
                            <span className="text-base font-semibold">
                                {messages('track.audioSpecification')}
                            </span>
                        ),
                        children: (
                            <div className="grid grid-cols-2 gap-4">
                                {/* File name */}
                                <AppFormItem
                                    name={['audioFile', 'file', 'fileName']}
                                    label={messages('common.fileName')}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                    ]}
                                >
                                    <Input
                                        id={`tracks.${index}.fileName`}
                                        readOnly
                                        value={
                                            trackData.audioFile?.file
                                                ?.fileName ?? ''
                                        }
                                        disabled={isReadMode}
                                    />
                                </AppFormItem>

                                <AppFormItem
                                    name={['audioFile', 'duration']}
                                    label={messages('common.duration')}
                                    required
                                >
                                    <Input
                                        readOnly
                                        value={convertSecondsToHoursMinutes(
                                            trackData.audioFile?.duration ?? 0
                                        )}
                                        disabled
                                    />
                                </AppFormItem>

                                {/* Sample Length */}
                                <AppFormItem
                                    name={['audioFile', 'sampleLength']}
                                    label={messages(
                                        'formFields.tracks.sampleLength'
                                    )}
                                    required
                                    rules={[
                                        {
                                            validator: validatePreview(
                                                messages,
                                                form
                                            ),
                                        },
                                    ]}
                                >
                                    <TimePicker
                                        id={`tracks.${index}.audioFile.sampleLength`}
                                        className="w-full"
                                        disabled={isReadMode}
                                        showNow={false}
                                        format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                        onChange={handleOnChangeSampleLength}
                                    />
                                </AppFormItem>

                                {/* Preview */}
                                <AppFormItem
                                    name={['audioFile', 'preview']}
                                    label={messages(
                                        'formFields.tracks.preview'
                                    )}
                                    required
                                    rules={[
                                        {
                                            validator: validateSampleLength(
                                                messages,
                                                form
                                            ),
                                        },
                                    ]}
                                >
                                    <TimePicker
                                        id={`tracks.${index}.audioFile.preview`}
                                        className="w-full"
                                        disabled={isReadMode}
                                        showNow={false}
                                        format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                        onChange={handleOnChangePreview}
                                    />
                                </AppFormItem>

                                {/* Audio file info table */}
                                {trackData.audioFile && (
                                    <div className="col-span-2 mt-6 overflow-hidden rounded-md border">
                                        <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                                            <div>
                                                <p className="font-bold">
                                                    Bit Depth
                                                </p>
                                                <p>
                                                    {trackData.audioFile
                                                        .bitDepth ?? '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    Bitrate
                                                </p>
                                                <p>
                                                    {trackData.audioFile
                                                        .bitrate ?? '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    Format
                                                </p>
                                                <p>
                                                    {trackData.audioFile.file?.extension?.toUpperCase() ??
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
        </ConfigProvider>
    );
}
