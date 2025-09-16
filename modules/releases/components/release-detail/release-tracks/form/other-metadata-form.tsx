import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import SensitiveContentSelect from '@/components/ui/select/isSensitiveContent-select';
import LanguageSelect from '@/components/ui/select/language-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigProvider, Input, Radio, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const otherMetadataSchema = (messages: any) =>
    releaseTrackSchema(messages).pick({
        primaryGenreId: true,
        subGenreId: true,
        trackSensitiveId: true,
        isByAi: true,
        trackLanguage: true,
        lyric: true,
        pLineOwner: true,
        pLineYear: true,
        trackOriginTypeId: true,
        trackTypeId: true,
        isrc: true,
    });

export type OtherMetadataSchema = z.infer<
    ReturnType<typeof otherMetadataSchema>
>;

type Props = {
    trackData: TrackData;
};

export default function OtherMetadataForm({ trackData }: Props) {
    // hooks - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formMethods = useForm<OtherMetadataSchema>({
        defaultValues: {
            primaryGenreId: trackData.primaryGenreId ?? '',
            subGenreId: trackData?.subGenreId ?? '',
            trackSensitiveId: trackData?.trackSensitiveId ?? '',
            isByAi: trackData?.isByAi ?? false,
            trackLanguage: trackData?.trackLanguage ?? {},
            lyric: trackData?.lyric ?? '',
            pLineOwner: trackData?.pLineOwner ?? '',
            pLineYear: trackData?.pLineYear ?? undefined,
            isrc: trackData.isrc ?? '',
            trackTypeId: trackData?.trackTypeId,
            trackOriginTypeId: trackData?.trackOriginTypeId,
        },
        resolver: zodResolver(otherMetadataSchema(messages)),
        mode: 'onChange',
    });
    const { action } = useGetReleaseDetailRoute();
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        trigger,
    } = formMethods;
    const watchedAllFields = useWatch({ control });

    // apis
    const { updateTrackDraft } = useUpdateTrackDraft();

    //func
    const debouncedUpdateTrackDraft = useCallback(
        debounce(async (data: any, fieldName?: string) => {
            if (fieldName) {
                const isValid = await trigger(
                    fieldName as keyof OtherMetadataSchema
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

    useEffect(() => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: any) => {
                if (track.id === trackData.id) {
                    const { ...restFields } = watchedAllFields;

                    return {
                        ...track,
                        ...restFields,
                        // trackLanguage: {
                        //     ...track.trackLanguage,
                        //     metadataLanguageCountryId: countryLanguage,
                        //     metadataLanguageId: metadataLanguage,
                        // },
                    };
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

    return (
        <ConfigProvider componentDisabled={isReadMode}>
            <FormProvider {...formMethods}>
                <form
                    className="grid grid-cols-2 gap-4"
                    onSubmit={handleSubmit(() => {})}
                >
                    <FormItem
                        name="primaryGenreId"
                        label={messages('genres.primary')}
                        required
                        ErrorMessage={errors.primaryGenreId?.message}
                    >
                        <Controller
                            name="primaryGenreId"
                            control={control}
                            render={({ field }) => (
                                <GenresSelect
                                    className="w-full"
                                    showSearch
                                    {...field}
                                    fallBack={trackData?.primaryGenre?.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            primaryGenreId: e,
                                        });
                                    }}
                                    status={
                                        errors.primaryGenreId
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="subGenreId"
                        label={messages('common.subGenres')}
                        ErrorMessage={errors.subGenreId?.message}
                    >
                        <Controller
                            name="subGenreId"
                            control={control}
                            render={({ field }) => (
                                <GenresSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                    {...field}
                                    fallBack={trackData?.subGenre?.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            subGenreId: e,
                                        });
                                    }}
                                    status={
                                        errors.subGenreId ? 'error' : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackSensitiveId"
                        label={messages('formFields.tracks.sensitiveContent')}
                        required
                        ErrorMessage={errors.trackSensitiveId?.message}
                    >
                        <Controller
                            name="trackSensitiveId"
                            control={control}
                            render={({ field }) => (
                                <SensitiveContentSelect
                                    className="w-full"
                                    showSearch
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackSensitiveId: e,
                                        });
                                    }}
                                    status={
                                        errors.trackSensitiveId
                                            ? 'error'
                                            : undefined
                                    }
                                />
                                // <Radio.Group
                                //     {...field}
                                //     onChange={(e) => {
                                //         field.onChange(e);
                                //         debouncedUpdateTrackDraft({
                                //             isSensitiveContent: e.target.value,
                                //         });
                                //     }}
                                // >
                                //     <Radio value={true}>
                                //         {messages('common.yes')}
                                //     </Radio>
                                //     <Radio value={false}>
                                //         {messages('common.no')}
                                //     </Radio>
                                // </Radio.Group>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={messages('common.isSongCreatedByAi')}
                        ErrorMessage={errors.isByAi?.message}
                        required
                        name="isByAi"
                    >
                        <Controller
                            name="isByAi"
                            control={control}
                            render={({ field }) => (
                                <Radio.Group
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            isByAi: e.target.value,
                                        });
                                    }}
                                >
                                    <Radio value={true}>
                                        {messages('common.yes')}
                                    </Radio>
                                    <Radio value={false}>
                                        {messages('common.no')}
                                    </Radio>
                                </Radio.Group>
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackOriginTypeId"
                        label={`${messages('trackOriginType.label')}`}
                        required
                        ErrorMessage={errors.trackOriginTypeId?.message}
                    >
                        <Controller
                            control={control}
                            name="trackOriginTypeId"
                            render={({ field }) => (
                                <OriginalTypeSelect
                                    id="trackOriginTypeId"
                                    {...field}
                                    fallBack={trackData?.trackOriginType?.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackOriginTypeId: e,
                                        });
                                    }}
                                    className="w-full"
                                    status={
                                        errors.trackOriginTypeId
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackLanguage.metadataLanguageCountryId"
                        label={messages('country.language')}
                        required
                        ErrorMessage={
                            errors.trackLanguage?.metadataLanguageCountryId
                                ?.message
                        }
                    >
                        <Controller
                            name="trackLanguage.metadataLanguageCountryId"
                            control={control}
                            render={({ field }) => (
                                <CountrySelect
                                    className="w-full"
                                    id="metadataLanguageCountryId"
                                    showSearch
                                    {...field}
                                    fallBack={
                                        trackData?.trackLanguage
                                            ?.metadataLanguageCountry?.name
                                    }
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackLanguage: {
                                                metadataLanguageCountryId: e,
                                            },
                                        });
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

                    <FormItem
                        name="trackLanguage.audioLanguageId"
                        required
                        label={messages('track.language')}
                        ErrorMessage={
                            errors.trackLanguage?.audioLanguageId?.message
                        }
                    >
                        <Controller
                            control={control}
                            name="trackLanguage.audioLanguageId"
                            render={({ field }) => (
                                <LanguageSelect
                                    id="languageTrack"
                                    {...field}
                                    fallBack={
                                        trackData?.trackLanguage?.audioLanguage
                                            ?.name
                                    }
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackLanguage: {
                                                audioLanguageId: e,
                                            },
                                        });
                                    }}
                                    showSearch
                                    className="w-full"
                                    status={
                                        errors.trackLanguage?.audioLanguageId
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackLanguage.metadataLanguageId"
                        required
                        label={`${messages('language.label')} metadata`}
                        ErrorMessage={
                            errors.trackLanguage?.audioLanguageId?.message
                        }
                    >
                        <Controller
                            control={control}
                            name="trackLanguage.metadataLanguageId"
                            render={({ field }) => (
                                <LanguageSelect
                                    id="trackLanguage.metadataLanguageId"
                                    {...field}
                                    // fallBack={
                                    //     trackData?.trackLanguage?.metadataLanguage
                                    //         ?.name
                                    // }
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackLanguage: {
                                                metadataLanguageId: e,
                                            },
                                        });
                                    }}
                                    showSearch
                                    className="w-full"
                                    status={
                                        errors.trackLanguage?.audioLanguageId
                                            ? 'error'
                                            : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackLanguage.recordingCountryId"
                        label={messages('track.recordingCountry')}
                        required
                        ErrorMessage={
                            errors.trackLanguage?.recordingCountryId?.message
                        }
                    >
                        <Controller
                            control={control}
                            name="trackLanguage.recordingCountryId"
                            render={({ field }) => (
                                <CountrySelect
                                    status={
                                        errors.trackLanguage?.recordingCountryId
                                            ? 'error'
                                            : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    fallBack={
                                        trackData?.trackLanguage
                                            ?.recordingCountry?.name
                                    }
                                    showSearch
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackLanguage: {
                                                recordingCountryId: e,
                                            },
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="trackTypeId"
                        label={messages('trackType.label')}
                        required
                        ErrorMessage={errors.trackTypeId?.message}
                    >
                        <Controller
                            control={control}
                            name="trackTypeId"
                            render={({ field }) => (
                                <TrackTypesSelect
                                    status={
                                        errors.trackTypeId ? 'error' : undefined
                                    }
                                    className="w-full"
                                    {...field}
                                    fallBack={trackData?.trackType?.name}
                                    value={field.value ?? ''}
                                    showSearch
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            trackTypeId: e,
                                        });
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="pLineYear"
                        label={messages('formFields.pLineYear')}
                        required
                        ErrorMessage={errors.pLineYear?.message}
                    >
                        <Controller
                            name="pLineYear"
                            control={control}
                            render={({ field }) => {
                                const currentYear = Number(dayjs().year());
                                const copyRightYearList = () => {
                                    const yearList = [
                                        {
                                            label: (currentYear - 1).toString(),
                                            value: currentYear - 1,
                                        },
                                        {
                                            label: currentYear.toString(),
                                            value: currentYear,
                                        },
                                        {
                                            label: (currentYear + 1).toString(),
                                            value: currentYear + 1,
                                        },
                                    ];
                                    return yearList;
                                };

                                return (
                                    <Select
                                        className="w-full"
                                        showSearch
                                        {...field}
                                        value={field.value}
                                        onChange={(newYear) => {
                                            const yearNumber = Number(newYear);
                                            field.onChange(yearNumber);
                                            debouncedUpdateTrackDraft(
                                                {
                                                    pLineYear: yearNumber,
                                                },
                                                'pLineYear'
                                            );
                                        }}
                                        options={copyRightYearList()}
                                        status={
                                            errors.pLineYear
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        />
                    </FormItem>

                    <FormItem
                        name="pLineOwner"
                        label={messages('formFields.pLineOwner')}
                        required
                        ErrorMessage={errors.pLineOwner?.message}
                    >
                        <Controller
                            name="pLineOwner"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="pLineOwner"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdateTrackDraft(
                                            {
                                                pLineOwner: value,
                                            },
                                            'pLineOwner'
                                        );
                                    }}
                                    allowClear
                                    status={
                                        errors.pLineOwner ? 'error' : undefined
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="lyric"
                        label={messages('formFields.tracks.lyrics')}
                        ErrorMessage={errors.lyric?.message}
                    >
                        <Controller
                            name="lyric"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    value={field.value ?? ''}
                                    rows={1}
                                    autoSize={{ minRows: 1, maxRows: 20 }}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        debouncedUpdateTrackDraft(
                                            {
                                                lyric: e.target.value,
                                            },
                                            'lyric'
                                        );
                                    }}
                                    status={errors.lyric ? 'error' : undefined}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        name="isrc"
                        label="ISRC"
                        ErrorMessage={errors.isrc?.message}
                    >
                        <Controller
                            control={control}
                            name="isrc"
                            render={({ field }) => (
                                <Input
                                    id="isrc"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdateTrackDraft(
                                            {
                                                isrc: value,
                                            },
                                            'isrc'
                                        );
                                    }}
                                    allowClear
                                    status={errors.isrc ? 'error' : undefined}
                                />
                            )}
                        />
                    </FormItem>
                </form>
            </FormProvider>
        </ConfigProvider>
    );
}
