'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import SensitiveContentSelect from '@/modules/track-sensitive/components/select/isSensitiveContent-select';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, DatePicker, Form, Input, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function OtherSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();
    const form = Form.useFormInstance();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

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

    const maxYear = dayjs().year() + 1;
    const disabledYear = (current: dayjs.Dayjs) => {
        return current && current.year() > maxYear;
    };

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <div className="space-y-4">
                <p className="text-base font-semibold">
                    {messages('common.others')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {/* Sensitive Content */}
                    <AppFormItem
                        label={messages('formFields.tracks.sensitiveContent')}
                        name="trackSensitiveId"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <SensitiveContentSelect
                            id={`tracks.${index}.trackSensitiveId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            onChange={(value) => {
                                updateTrackDraft(
                                    { trackSensitiveId: value },
                                    'trackSensitiveId'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* Is Created by AI */}
                    <AppFormItem
                        label={messages('common.isSongCreatedByAi')}
                        name="isByAi"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Radio.Group
                            id={`tracks.${index}.isByAi`}
                            disabled={isReadMode}
                            onChange={(e) => {
                                const value = e.target.value;
                                updateTrackDraft({ isByAi: value }, 'isByAi');
                            }}
                        >
                            <Radio value={true}>{messages('common.yes')}</Radio>
                            <Radio value={false}>{messages('common.no')}</Radio>
                        </Radio.Group>
                    </AppFormItem>

                    {/* Track Origin Type */}
                    <AppFormItem
                        label={messages('trackOriginType.label')}
                        name="trackOriginTypeId"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <OriginalTypeSelect
                            id={`tracks.${index}.trackOriginTypeId`}
                            className="w-full"
                            allowClear
                            disabled={isReadMode}
                            // fallback={trackData?.trackOriginType?.name}
                            onChange={(value) => {
                                updateTrackDraft(
                                    { trackOriginTypeId: value },
                                    'trackOriginTypeId'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* Recording Country */}
                    <AppFormItem
                        label={messages('track.recordingCountry')}
                        name={['trackLanguage', 'recordingCountryId']}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <CountrySelect
                            id={`tracks.${index}.trackLanguage.recordingCountryId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            // fallback={
                            //     trackData?.trackLanguage
                            //         ?.recordingCountry?.name
                            // }
                            onChange={(value) => {
                                updateTrackDraft({
                                    trackLanguage: {
                                        ...trackData.trackLanguage,
                                        recordingCountryId: value,
                                    },
                                });
                            }}
                        />
                    </AppFormItem>

                    {/* Track Type */}
                    <AppFormItem
                        label={messages('trackType.label')}
                        name="trackTypeId"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <TrackTypesSelect
                            id={`tracks.${index}.trackTypeId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            // fallback={trackData?.trackType?.name}

                            onChange={(value) => {
                                form.setFieldValue(
                                    ['tracks', index, 'trackTypeId'],
                                    value
                                );
                                updateTrackDraft({
                                    trackTypeId: value,
                                });
                            }}
                        />
                    </AppFormItem>

                    {/* ISRC */}
                    <AppFormItem
                        label="ISRC"
                        name="isrc"
                        required
                        rules={[
                            {
                                min: 12,
                                max: 12,
                                message: messages('validation.mustBeLength', {
                                    number: 12,
                                    field: 'ISRC',
                                }),
                            },
                        ]}
                    >
                        <Input
                            id={`tracks.${index}.isrc`}
                            allowClear
                            disabled={isReadMode}
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                updateTrackDraft({ isrc: value }, 'isrc');
                            }}
                        />
                    </AppFormItem>

                    {/* P-Line Year */}
                    <AppFormItem
                        label={messages('formFields.pLineYear')}
                        name="pLineYear"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                        getValueFromEvent={(date: dayjs.Dayjs | null) =>
                            date ? date.year() : undefined
                        }
                        getValueProps={(value: number | undefined) => ({
                            value: value ? dayjs().year(value) : null,
                        })}
                    >
                        <DatePicker
                            id={`tracks.${index}.pLineYear`}
                            picker="year"
                            className="w-full"
                            disabled={isReadMode}
                            disabledDate={disabledYear}
                            allowClear
                            onChange={(date) => {
                                const value = date ? date.year() : undefined;
                                updateTrackDraft(
                                    { pLineYear: value },
                                    'pLineYear'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* P-Line Owner */}
                    <AppFormItem
                        label={messages('formFields.pLineOwner')}
                        name="pLineOwner"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            id={`tracks.${index}.pLineOwner`}
                            allowClear
                            disabled={isReadMode}
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                updateTrackDraft({
                                    pLineOwner: value,
                                });
                            }}
                        />
                    </AppFormItem>

                    {/* Lyrics */}
                    <AppFormItem
                        className="col-span-2"
                        label={messages('formFields.tracks.lyrics')}
                        name="lyric"
                    >
                        <TextArea
                            id={`tracks.${index}.lyric`}
                            rows={2}
                            autoSize={{ minRows: 2, maxRows: 20 }}
                            disabled={isReadMode}
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                updateTrackDraft({ lyric: value }, 'lyric');
                            }}
                        />
                    </AppFormItem>
                </div>
            </div>
        </ConfigProvider>
    );
}

