'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackData } from '@/modules/tracks/types';
import { Form } from 'antd';
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
            defaultActiveKey={['language']}
            items={[
                {
                    key: 'language',
                    label: (
                        <span className="text-base font-semibold">
                            {messages('language.label')}
                        </span>
                    ),
                    children: (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Country Language */}
                            <AppFormItem
                                label={messages('country.language')}
                                name={[
                                    'trackLanguage',
                                    'metadataLanguageCountryId',
                                ]}
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
                                                    metadataLanguageCountryId:
                                                        value,
                                                },
                                            },
                                            'trackLanguage.metadataLanguageCountryId'
                                        );
                                    }}
                                />
                            </AppFormItem>

                            {/* Audio Language */}
                            <AppFormItem
                                label={messages('track.language')}
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
                                    status={
                                        form.getFieldError([
                                            'tracks',
                                            index,
                                            'trackLanguage',
                                            'audioLanguageId',
                                        ]).length
                                            ? 'error'
                                            : undefined
                                    }
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
                                label={`${messages('language.label')} metadata`}
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
                    ),
                },
            ]}
        />
    );
}
