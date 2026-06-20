import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    debouncedUpdate: (data: any) => void;
    isReadMode: boolean;
    isCreateReleasePage: boolean;
};

export default function GenreLanguageSectionV2({
    debouncedUpdate,
    isReadMode,
    isCreateReleasePage,
}: Props) {
    const {
        control,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<ReleaseDetailSchema>();
    const messages = useTranslations();
    const isInstrumental = watch('isInstrumental') ?? false;

    return (
        <div id="genre-language" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('genre.label')} & {messages('language.label')}
            </span>
            <div className="grid grid-cols-1 gap-x-16 gap-y-1 md:grid-cols-2 lg:grid-cols-2">
                <AppFormItem
                    label={messages('genres.primary')}
                    required
                    validateStatus={errors.primaryGenreId ? 'error' : ''}
                    help={errors.primaryGenreId?.message as string}
                    tooltip={messages('tooltipForm.primaryGenre')}
                >
                    <Controller
                        control={control}
                        name="primaryGenreId"
                        render={({ field }) => (
                            <GenresSelect
                                showSearch
                                className="w-full"
                                id="primaryGenreId"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    debouncedUpdate({
                                        primaryGenreId: e,
                                    });
                                }}
                                status={
                                    errors.primaryGenreId ? 'error' : undefined
                                }
                                disabled={isCreateReleasePage || isReadMode}
                            />
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={messages('common.subGenres')}
                    validateStatus={errors.subGenreId ? 'error' : ''}
                    help={errors.subGenreId?.message as string}
                    tooltip={messages('tooltipForm.subGenre')}
                >
                    <Controller
                        control={control}
                        name="subGenreId"
                        render={({ field }) => (
                            <GenresSelect
                                className="w-full"
                                allowClear
                                showSearch
                                id="subGenres"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    debouncedUpdate({
                                        subGenreId: e,
                                    });
                                }}
                                status={errors.subGenreId ? 'error' : undefined}
                                disabled={isCreateReleasePage || isReadMode}
                            />
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={`${messages('release.metadataLanguage')}`}
                    required
                    validateStatus={
                        errors.releaseLanguage?.metadataLanguageId
                            ? 'error'
                            : ''
                    }
                    help={
                        errors.releaseLanguage?.metadataLanguageId
                            ?.message as string
                    }
                    tooltip={messages('tooltipForm.metadataLanguage')}
                >
                    <Controller
                        control={control}
                        name="releaseLanguage.metadataLanguageId"
                        render={({ field }) => (
                            <LanguageSelect
                                className="w-full"
                                id="releaseLanguage.metadataLanguageId"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    debouncedUpdate({
                                        releaseLanguage: {
                                            metadataLanguageId: e,
                                        },
                                    });
                                }}
                                status={
                                    errors.releaseLanguage?.metadataLanguageId
                                        ? 'error'
                                        : undefined
                                }
                                disabled={isCreateReleasePage || isReadMode}
                            />
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={messages('formFields.tracks.lyrics')}
                    required
                    validateStatus={errors.isInstrumental ? 'error' : ''}
                    help={errors.isInstrumental?.message as string}
                >
                    <Controller
                        control={control}
                        name="isInstrumental"
                        render={({ field }) => (
                            <Radio.Group
                                {...field}
                                value={field.value ?? false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);

                                    if (value) {
                                        setValue(
                                            'releaseLanguage.audioLanguageId',
                                            null
                                        );
                                        debouncedUpdate({
                                            isInstrumental: value,
                                            releaseLanguage: {
                                                audioLanguageId: null,
                                            },
                                        });
                                        return;
                                    }

                                    debouncedUpdate({
                                        isInstrumental: value,
                                    });
                                }}
                                disabled={isCreateReleasePage || isReadMode}
                            >
                                <Radio value={false}>{messages('common.containsLyrics')}</Radio>
                                <Radio value={true}>{messages('common.instrumental')}</Radio>
                            </Radio.Group>
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={
                        <span className="block whitespace-normal leading-normal">
                            {messages('release.countryLanguage')}
                        </span>
                    }
                    required
                    validateStatus={
                        errors.releaseLanguage?.metadataLanguageCountryId
                            ? 'error'
                            : ''
                    }
                    help={
                        errors.releaseLanguage?.metadataLanguageCountryId
                            ?.message as string
                    }
                    tooltip={messages('tooltipForm.countryLanguage')}
                >
                    <Controller
                        control={control}
                        name="releaseLanguage.metadataLanguageCountryId"
                        render={({ field }) => (
                            <CountrySelect
                                className="w-full"
                                id="releaseLanguage.metadataLanguageCountryId"
                                showSearch
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    debouncedUpdate({
                                        releaseLanguage: {
                                            metadataLanguageCountryId: e,
                                        },
                                    });
                                }}
                                status={
                                    errors.releaseLanguage
                                        ?.metadataLanguageCountryId
                                        ? 'error'
                                        : undefined
                                }
                                disabled={isCreateReleasePage || isReadMode}
                            />
                        )}
                    />
                </AppFormItem>

                {!isInstrumental && (
                    <AppFormItem
                        label={`${messages('release.audioLanguage')}`}
                        required
                        validateStatus={
                            errors.releaseLanguage?.audioLanguageId
                                ? 'error'
                                : ''
                        }
                        help={
                            errors.releaseLanguage?.audioLanguageId
                                ?.message as string
                        }
                        tooltip={messages('tooltipForm.languageTrack')}
                    >
                        <Controller
                            control={control}
                            name="releaseLanguage.audioLanguageId"
                            render={({ field }) => (
                                <LanguageSelect
                                    className="w-full"
                                    id="releaseLanguage.audioLanguageId"
                                    showSearch
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdate({
                                            releaseLanguage: {
                                                audioLanguageId: e,
                                            },
                                        });
                                    }}
                                    status={
                                        errors.releaseLanguage?.audioLanguageId
                                            ? 'error'
                                            : undefined
                                    }
                                    disabled={isCreateReleasePage || isReadMode}
                                />
                            )}
                        />
                    </AppFormItem>
                )}
            </div>
        </div>
    );
}
