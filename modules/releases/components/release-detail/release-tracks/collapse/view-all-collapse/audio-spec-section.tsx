'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import { DATE_FORMAT } from '@/enums/common';
import {
    convertSecondsToHoursMinutes,
    timeStringToSeconds,
} from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackData } from '@/modules/tracks/types';
import { Form, Input, TimePicker } from 'antd';
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
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;

    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            try {
                await form.validateFields([fieldName]);
            } catch {
                return;
            }
        }
        debouncedUpdateTrackDraft(data);
    };

    return (
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
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input
                                    id={`tracks.${index}.fileName`}
                                    readOnly
                                    value={
                                        trackData.audioFile?.file?.fileName ??
                                        ''
                                    }
                                    disabled={isReadMode}
                                    status={
                                        form.getFieldError([
                                            'tracks',
                                            index,
                                            'audioFile',
                                            'file',
                                            'fileName',
                                        ]).length
                                            ? 'error'
                                            : undefined
                                    }
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
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <TimePicker
                                    id={`tracks.${index}.audioFile.sampleLength`}
                                    className="w-full"
                                    disabled={isReadMode}
                                    showNow={false}
                                    format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                    value={
                                        typeof trackData.audioFile
                                            ?.sampleLength === 'number' &&
                                        trackData.audioFile?.sampleLength > 0
                                            ? dayjs(
                                                  convertSecondsToHoursMinutes(
                                                      trackData.audioFile
                                                          .sampleLength
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
                                        form.setFieldValue(
                                            [
                                                'tracks',
                                                index,
                                                'audioFile',
                                                'sampleLength',
                                            ],
                                            seconds
                                        );
                                        updateTrackDraft(
                                            {
                                                audioFile: {
                                                    sampleLength: seconds,
                                                },
                                            },
                                            'audioFile.sampleLength'
                                        );
                                    }}
                                    status={
                                        form.getFieldError([
                                            'tracks',
                                            index,
                                            'audioFile',
                                            'sampleLength',
                                        ]).length
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            </AppFormItem>

                            {/* Preview */}
                            <AppFormItem
                                name={['audioFile', 'preview']}
                                label={messages('formFields.tracks.preview')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <TimePicker
                                    id={`tracks.${index}.audioFile.preview`}
                                    className="w-full"
                                    disabled={isReadMode}
                                    showNow={false}
                                    format={DATE_FORMAT.HOUR_MINUTE_SECOND}
                                    value={
                                        typeof trackData.audioFile?.preview ===
                                            'number' &&
                                        trackData.audioFile?.preview > 0
                                            ? dayjs(
                                                  convertSecondsToHoursMinutes(
                                                      trackData.audioFile
                                                          ?.preview
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
                                        form.setFieldValue(
                                            [
                                                'tracks',
                                                index,
                                                'audioFile',
                                                'preview',
                                            ],
                                            seconds
                                        );
                                        updateTrackDraft(
                                            {
                                                audioFile: {
                                                    preview: seconds,
                                                },
                                            },
                                            'audioFile.preview'
                                        );
                                    }}
                                    status={
                                        form.getFieldError([
                                            'tracks',
                                            index,
                                            'audioFile',
                                            'preview',
                                        ]).length
                                            ? 'error'
                                            : undefined
                                    }
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
    );
}
