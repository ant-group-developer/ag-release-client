import { LabelForm } from '@/components/ui/label/labelForm';
import GenresSelect from '@/components/ui/select/genres-select';
import ErrorText from '@/components/ui/text/error-text';
import { languageList } from '@/constants/fakeData';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const otherMetadataSchema = z.object({
    genres: z.string().nonempty('Genres is required'),
    subGenres: z.string().optional(),
    isSensitiveContent: z.boolean(),
    countryLanguage: z.string().nonempty('Country language is required'),
    metadataLanguage: z.string().nonempty('Metadata language is required'),
    lyrics: z.string().optional(),
});

export type OtherMetadataSchema = z.infer<typeof otherMetadataSchema>;

type Props = {
    trackData: TrackData;
};

export default function OtherMetadataForm({ trackData }: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formMethods = useForm<OtherMetadataSchema>({
        defaultValues: {
            genres: trackData.genres,
            subGenres: trackData?.subGenres,
            isSensitiveContent: trackData?.isSensitiveContent,
            countryLanguage: trackData?.countryLanguage,
            metadataLanguage: trackData?.metadataLanguage,
            lyrics: trackData?.lyrics,
        },
        resolver: zodResolver(otherMetadataSchema),
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
        formMethods.setValue('genres', formValues?.genres || '');
        formMethods.setValue('subGenres', formValues?.subGenres || '');
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
                        label="Nội dung nhạy cảm"
                    />
                    <Controller
                        name="isSensitiveContent"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                showSearch
                                {...field}
                                options={[
                                    { label: 'Có', value: true },
                                    { label: 'Không', value: false },
                                ]}
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
                        label="Ngôn ngữ quốc gia"
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
            </form>
        </FormProvider>
    );
}
