import { LabelForm } from '@/components/ui/label/labelForm';
import GenresSelect from '@/components/ui/select/genres-select';
import ErrorText from '@/components/ui/text/error-text';
import { languageList, yearList } from '@/constants/fakeData';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
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
        pLine: z
            .object({
                year: z.string().nonempty(messages('validation.input')),
                name: z.string().nonempty(messages('validation.input')),
            })
            .refine(
                (val) =>
                    val &&
                    typeof val === 'object' &&
                    val.year !== undefined &&
                    val.name !== undefined,
                {
                    message: messages('validation.input'),
                }
            ),
    });

export type OtherMetadataSchema = z.infer<
    ReturnType<typeof otherMetadataSchema>
>;

type Props = {
    trackData: TrackData;
};

export default function OtherMetadataForm({ trackData }: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formMethods = useForm<OtherMetadataSchema>({
        defaultValues: {
            genres: trackData.genres ?? '',
            subGenres: trackData?.subGenres,
            isSensitiveContent: trackData?.isSensitiveContent ?? false,
            countryLanguage: trackData?.countryLanguage ?? '',
            metadataLanguage: trackData?.metadataLanguage ?? '',
            lyrics: trackData?.lyrics,
            pLine: trackData?.pLine ?? { year: '', name: '' },
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
                    return {
                        ...track,
                        ...watchedAllFields,
                    };
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

    useEffect(() => {
        trigger();
    }, [trackData]);

    return (
        <FormProvider {...formMethods}>
            <form
                className="grid grid-cols-2 gap-4"
                onSubmit={handleSubmit(() => {})}
            >
                <div>
                    <LabelForm
                        htmlFor="genres"
                        required
                        label={messages('common.genres')}
                    />
                    <Controller
                        name="genres"
                        control={control}
                        render={({ field }) => (
                            <GenresSelect
                                className="w-full"
                                showSearch
                                allowClear
                                {...field}
                                status={errors.genres ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.genres}
                        message={errors.genres?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="subGenres"
                        label={messages('common.subGenres')}
                    />
                    <Controller
                        name="subGenres"
                        control={control}
                        render={({ field }) => (
                            <GenresSelect
                                className="w-full"
                                showSearch
                                allowClear
                                {...field}
                                status={errors.subGenres ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.subGenres}
                        message={errors.subGenres?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="isSensitiveContent"
                        required
                        label={messages('formFields.tracks.sensitiveContent')}
                    />
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
                                status={
                                    errors.isSensitiveContent
                                        ? 'error'
                                        : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.isSensitiveContent}
                        message={errors.isSensitiveContent?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="countryLanguage"
                        required
                        label={messages('country.language')}
                    />
                    <Controller
                        name="countryLanguage"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                showSearch
                                options={languageList}
                                {...field}
                                status={
                                    errors.countryLanguage ? 'error' : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.countryLanguage}
                        message={errors.countryLanguage?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="metadataLanguage"
                        required
                        label="Metadata language"
                    />
                    <Controller
                        name="metadataLanguage"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                showSearch
                                options={languageList}
                                {...field}
                                status={
                                    errors.metadataLanguage
                                        ? 'error'
                                        : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.metadataLanguage}
                        message={errors.metadataLanguage?.message}
                    />
                </div>

                <div>
                    <LabelForm htmlFor="lyrics" label="Lời bài hát" />
                    <Controller
                        name="lyrics"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                rows={1}
                                autoSize={{ minRows: 1, maxRows: 20 }}
                                status={errors.lyrics ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.lyrics}
                        message={errors.lyrics?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="pLine"
                        required
                        label="Bản quyền ghi âm"
                    />
                    <Controller
                        name="pLine"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="pLine"
                                value={field.value?.name || ''}
                                onChange={(e) =>
                                    field.onChange({
                                        ...field.value,
                                        name: e.target.value,
                                    })
                                }
                                allowClear
                                addonBefore={
                                    <Select
                                        defaultValue={
                                            field.value?.year || '2026'
                                        }
                                        value={field.value?.year}
                                        options={yearList}
                                        onChange={(year) =>
                                            field.onChange({
                                                ...field.value,
                                                year,
                                            })
                                        }
                                        style={{ width: 90 }}
                                    />
                                }
                                status={
                                    errors.pLine?.name ? 'error' : undefined
                                }
                            />
                        )}
                    />
                    {/* <ErrorText
                        isError={!!errors.pLine?.year}
                        message={errors.pLine?.year?.message}
                    /> */}
                    <ErrorText
                        isError={!!errors.pLine?.name}
                        message={errors.pLine?.name?.message}
                    />
                </div>
            </form>
        </FormProvider>
    );
}
