import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigProvider, Input, Select } from 'antd';
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
        isSensitiveContent: true,
        trackLanguage: true,
        lyric: true,
        pLineOwner: true,
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
            isSensitiveContent: trackData?.isSensitiveContent ?? false,
            trackLanguage: trackData?.trackLanguage ?? {},
            lyric: trackData?.lyric ?? '',
            pLineOwner: trackData?.pLineOwner ?? `${dayjs().year()} `,
            isrc: trackData.isrc ?? '',
            trackTypeId: trackData?.trackTypeId,
            trackOriginTypeId: trackData?.trackOriginTypeId,
        },
        resolver: zodResolver(otherMetadataSchema(messages)),
        mode: 'onChange',
    });
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );
    const isReadMode = releaseDetailAction === RELEASE_DETAIL_ACTION.READ;
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
                        name="isSensitiveContent"
                        label={messages('formFields.tracks.sensitiveContent')}
                        required
                        ErrorMessage={errors.isSensitiveContent?.message}
                    >
                        <Controller
                            name="isSensitiveContent"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    className="w-full"
                                    showSearch
                                    options={[
                                        {
                                            label: messages('common.yes'),
                                            value: true,
                                        },
                                        {
                                            label: messages('common.no'),
                                            value: false,
                                        },
                                    ]}
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            isSensitiveContent: e,
                                        });
                                    }}
                                    status={
                                        errors.isSensitiveContent
                                            ? 'error'
                                            : undefined
                                    }
                                />
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
                        label={messages('tracks.language')}
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
                        label={messages('tracks.recordingCountry')}
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
                        name="pLineOwner"
                        label={messages('formFields.pLine')}
                        required
                        ErrorMessage={errors.pLineOwner?.message}
                    >
                        <Controller
                            name="pLineOwner"
                            control={control}
                            render={({ field }) => {
                                const [year, ownerCopyRight] =
                                    field.value?.split(' ') || [];

                                const handleYearChange = (newYear: string) => {
                                    const value =
                                        `${newYear} ${ownerCopyRight ?? ''}`.trim();
                                    field.onChange(value);
                                    debouncedUpdateTrackDraft({
                                        pLineOwner: value,
                                    });
                                };

                                const handleOwnerChange = (
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    const value =
                                        `${year} ${e.target.value}`.trim();
                                    field.onChange(value);
                                    debouncedUpdateTrackDraft(
                                        {
                                            pLineOwner: value,
                                        },
                                        'pLineOwner'
                                    );
                                };

                                const copyRightYearList = () => {
                                    const currentYear = dayjs().year();
                                    const yearList = [
                                        {
                                            label: (currentYear - 1).toString(),
                                            value: (currentYear - 1).toString(),
                                        },
                                        {
                                            label: currentYear.toString(),
                                            value: currentYear.toString(),
                                        },
                                        {
                                            label: (currentYear + 1).toString(),
                                            value: (currentYear + 1).toString(),
                                        },
                                    ];
                                    return yearList;
                                };
                                const copyRightYears = copyRightYearList();
                                return (
                                    <Input
                                        id="pLineOwner"
                                        value={ownerCopyRight}
                                        onChange={handleOwnerChange}
                                        allowClear
                                        addonBefore={
                                            <Select
                                                defaultValue={'2025'}
                                                value={year}
                                                onChange={handleYearChange}
                                                options={copyRightYears}
                                                style={{ width: 90 }}
                                                placeholder={messages(
                                                    'common.year'
                                                )}
                                            />
                                        }
                                    />
                                );
                            }}
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
