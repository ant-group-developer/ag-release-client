import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const otherMetadataSchema = (messages: any) =>
    z.object({
        genres: z.string().min(1, messages('validation.select')),
        subGenres: z.string().optional(),
        isSensitiveContent: z.boolean(messages('validation.input')),
        countryLanguage: z.string().min(1, messages('validation.select')),
        metadataLanguage: z.string().min(1, messages('validation.select')),
        lyrics: z.string().optional(),
        pLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nonempty(messages('validation.input')),
        isrc: z
            .string()
            .optional()
            .refine(
                (val) => val !== null,
                messages({
                    messages: messages('validation.input'),
                })
            ),
        // languageTrack: z.object({
        //     metadataLanguageId: z
        //         .string()
        //         .min(1, messages('validation.select')),
        //     metadataLanguageCountryId: z
        //         .string()
        //         .min(1, messages('validation.select')),
        //     // Nếu form con không dùng 2 trường còn lại thì có thể để optional hoặc nullable
        //     audioLanguageId: z.string().optional().nullable(),
        //     recordingCountryId: z.string().optional().nullable(),
        // }),
    });

export type OtherMetadataSchema = z.infer<
    ReturnType<typeof otherMetadataSchema>
>;

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
};

export default function OtherMetadataForm({
    trackData,
    updateTrackDraft,
}: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formMethods = useForm<OtherMetadataSchema>({
        defaultValues: {
            genres: trackData.primaryGenreId ?? '',
            subGenres: trackData?.subGenreId ?? '',
            isSensitiveContent: trackData?.isSensitiveContent ?? false,
            countryLanguage:
                trackData?.trackLanguage?.metadataLanguageCountryId ?? '',
            metadataLanguage:
                trackData?.trackLanguage?.metadataLanguageId ?? '',
            lyrics: trackData?.lyric ?? '',
            pLineOwner: trackData?.pLineOwner ?? `${dayjs().year()} `,
            isrc: trackData.isrc ?? '',
        },
        resolver: zodResolver(otherMetadataSchema(messages)),
        mode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        trigger,
    } = formMethods;

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: any) => {
                if (track.id === trackData.id) {
                    const { countryLanguage, metadataLanguage, ...restFields } =
                        watchedAllFields;

                    return {
                        ...track,
                        ...restFields,
                        trackLanguage: {
                            ...track.trackLanguage,
                            metadataLanguageCountryId: countryLanguage,
                            metadataLanguageId: metadataLanguage,
                        },
                    };
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

    return (
        <FormProvider {...formMethods}>
            <form
                className="grid grid-cols-2 gap-4"
                onSubmit={handleSubmit(() => {})}
            >
                <FormItem
                    name="genres"
                    label={messages('common.genres')}
                    required
                    ErrorMessage={errors.genres?.message}
                >
                    <Controller
                        name="genres"
                        control={control}
                        render={({ field }) => (
                            <GenresSelect
                                className="w-full"
                                showSearch
                                allowClear
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        primaryGenreId: e,
                                    });
                                }}
                                status={errors.genres ? 'error' : undefined}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    name="subGenres"
                    label={messages('common.subGenres')}
                    ErrorMessage={errors.subGenres?.message}
                >
                    <Controller
                        name="subGenres"
                        control={control}
                        render={({ field }) => (
                            <GenresSelect
                                className="w-full"
                                showSearch
                                allowClear
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        subGenreId: e,
                                    });
                                }}
                                status={errors.subGenres ? 'error' : undefined}
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
                                    updateTrackDraft({
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
                    name="countryLanguage"
                    label={messages('country.language')}
                    required
                    ErrorMessage={errors.countryLanguage?.message}
                >
                    <Controller
                        name="countryLanguage"
                        control={control}
                        render={({ field }) => (
                            <CountrySelect
                                className="w-full"
                                id="countryLanguage"
                                showSearch
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        trackLanguage: {
                                            metadataLanguageCountryId: e,
                                        },
                                    });
                                }}
                                status={
                                    errors.countryLanguage ? 'error' : undefined
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    name="metadataLanguage"
                    label="Metadata language"
                    required
                    ErrorMessage={errors.metadataLanguage?.message}
                >
                    <Controller
                        name="metadataLanguage"
                        control={control}
                        render={({ field }) => (
                            <LanguageSelect
                                className="w-full"
                                showSearch
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        trackLanguage: {
                                            metadataLanguageId: e,
                                        },
                                    });
                                }}
                                status={
                                    errors.metadataLanguage
                                        ? 'error'
                                        : undefined
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    name="pLineOwner"
                    label="Bản quyền ghi âm"
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
                                updateTrackDraft({
                                    pLineOwner: value,
                                });
                            };

                            const handleOwnerChange = (
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                const value =
                                    `${year} ${e.target.value}`.trim();
                                field.onChange(value);
                                updateTrackDraft({
                                    pLineOwner: value,
                                });
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
                    name="lyrics"
                    label="Lời bài hát"
                    ErrorMessage={errors.lyrics?.message}
                >
                    <Controller
                        name="lyrics"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                rows={1}
                                autoSize={{ minRows: 1, maxRows: 20 }}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        lyric: e.target.value,
                                    });
                                }}
                                status={errors.lyrics ? 'error' : undefined}
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    updateTrackDraft({
                                        isrc: value,
                                    });
                                }}
                                allowClear
                                status={errors.isrc ? 'error' : undefined}
                            />
                        )}
                    />
                </FormItem>
            </form>
        </FormProvider>
    );
}
