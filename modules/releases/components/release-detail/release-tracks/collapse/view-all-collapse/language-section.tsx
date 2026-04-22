'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Form } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function LanguageSection({
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

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <div className="space-y-4">
                <p className="text-base font-semibold">
                    {messages('language.label')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {/* Country Language */}
                    <AppFormItem
                        label={messages('release.countryLanguage')}
                        name={['trackLanguage', 'metadataLanguageCountryId']}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <CountrySelect
                            id={`tracks.${index}.trackLanguage.metadataLanguageCountryId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            // fallback={
                            //     trackData?.trackLanguage
                            //         ?.metadataLanguageCountry?.name
                            // }
                            onChange={(value) => {
                                form.setFieldValue(
                                    [
                                        'tracks',
                                        index,
                                        'trackLanguage',
                                        'metadataLanguageCountryId',
                                    ],
                                    value
                                );
                                updateTrackDraft(
                                    {
                                        trackLanguage: {
                                            ...trackData.trackLanguage,
                                            metadataLanguageCountryId: value,
                                        },
                                    },
                                    'trackLanguage.metadataLanguageCountryId'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* Audio Language */}
                    <AppFormItem
                        label={messages('release.audioLanguage')}
                        name={['trackLanguage', 'audioLanguageId']}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <LanguageSelect
                            id={`tracks.${index}.trackLanguage.audioLanguageId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            // fallback={
                            //     trackData?.trackLanguage?.audioLanguage
                            //         ?.name
                            // }

                            onChange={(value) => {
                                form.setFieldValue(
                                    [
                                        'tracks',
                                        index,
                                        'trackLanguage',
                                        'audioLanguageId',
                                    ],
                                    value
                                );
                                updateTrackDraft(
                                    {
                                        trackLanguage: {
                                            ...trackData.trackLanguage,
                                            audioLanguageId: value,
                                        },
                                    },
                                    'trackLanguage.audioLanguageId'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* Metadata Language */}
                    <AppFormItem
                        label={messages('release.metadataLanguage')}
                        name={['trackLanguage', 'metadataLanguageId']}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <LanguageSelect
                            id={`tracks.${index}.trackLanguage.metadataLanguageId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            // fallback={
                            //     trackData?.trackLanguage
                            //         ?.metadataLanguage?.name
                            // }
                            onChange={(value) => {
                                updateTrackDraft(
                                    {
                                        trackLanguage: {
                                            ...trackData.trackLanguage,
                                            metadataLanguageId: value,
                                        },
                                    },
                                    'trackLanguage.metadataLanguageId'
                                );
                            }}
                        />
                    </AppFormItem>
                </div>
            </div>
        </ConfigProvider>
    );
}
