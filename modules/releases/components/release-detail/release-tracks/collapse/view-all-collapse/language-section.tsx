import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any, fieldName?: string) => void;
    trackData: TrackData;
};

export default function LanguageSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();
    const formMethods = useForm({
        defaultValues: {
            trackLanguage: {
                metadataLanguageCountryId:
                    trackData.trackLanguage?.metadataLanguageCountryId ?? '',
                audioLanguageId: trackData.trackLanguage?.audioLanguageId ?? '',
            },
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
            defaultActiveKey={['language']}
            items={[
                {
                    key: 'language',
                    label: (
                        <Title level={5} className="!mb-0">
                            Ngôn ngữ
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormItem
                                    label={messages('country.language')}
                                    ErrorMessage={
                                        errors.trackLanguage
                                            ?.metadataLanguageCountryId?.message
                                    }
                                    required
                                    name="trackLanguage.metadataLanguageCountryId"
                                >
                                    <Controller
                                        name="trackLanguage.metadataLanguageCountryId"
                                        control={control}
                                        render={({ field }) => (
                                            <CountrySelect
                                                id={`tracks.${index}.metadataLanguageCountryId`}
                                                className="w-full"
                                                showSearch
                                                {...field}
                                                fallBack={
                                                    trackData?.trackLanguage
                                                        ?.metadataLanguageCountry
                                                        ?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdateTrackDraft(
                                                        {
                                                            trackLanguage: {
                                                                ...trackData.trackLanguage,
                                                                metadataLanguageCountryId:
                                                                    e,
                                                            },
                                                        },
                                                        'trackLanguage.metadataLanguageCountryId'
                                                    );
                                                }}
                                                status={
                                                    errors.trackLanguage
                                                        ?.metadataLanguageCountryId
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    label={messages('tracks.language')}
                                    ErrorMessage={
                                        errors.trackLanguage?.audioLanguageId
                                            ?.message
                                    }
                                    required
                                    name="trackLanguage.audioLanguageId"
                                >
                                    <Controller
                                        name="trackLanguage.audioLanguageId"
                                        control={control}
                                        render={({ field }) => (
                                            <LanguageSelect
                                                id={`tracks.${index}.audioLanguageId`}
                                                {...field}
                                                fallBack={
                                                    trackData?.trackLanguage
                                                        ?.audioLanguage?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdateTrackDraft(
                                                        {
                                                            trackLanguage: {
                                                                ...trackData.trackLanguage,
                                                                audioLanguageId:
                                                                    e,
                                                            },
                                                        },
                                                        'trackLanguage.audioLanguageId'
                                                    );
                                                }}
                                                showSearch
                                                className="w-full"
                                                status={
                                                    errors.trackLanguage
                                                        ?.audioLanguageId
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    name="trackLanguage.metadataLanguageId"
                                    required
                                    label={`${messages('language.label')} metadata`}
                                    ErrorMessage={
                                        errors.trackLanguage?.audioLanguageId
                                            ?.message
                                    }
                                >
                                    <Controller
                                        control={control}
                                        name="trackLanguage.metadataLanguageId"
                                        render={({ field }) => (
                                            <LanguageSelect
                                                id={`tracks.${index}.metadataLanguageId`}
                                                {...field}
                                                // fallBack={
                                                //     trackData?.trackLanguage?.metadataLanguage
                                                //         ?.name
                                                // }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdateTrackDraft({
                                                        trackLanguage: {
                                                            metadataLanguageId:
                                                                e,
                                                        },
                                                    });
                                                }}
                                                showSearch
                                                className="w-full"
                                                status={
                                                    errors.trackLanguage
                                                        ?.audioLanguageId
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
