import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import { ReleaseDetailSchema } from '..';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
};

export default function GenreLanguageSection({ debouncedUpdate }: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const messages = useTranslations();

    // router
    const params = useParams();

    // variables
    const isCreateReleasePage = params['action'] === 'create';

    return (
        <CollapseItem
            defaultActiveKey={['Genre & Language']}
            items={[
                {
                    key: 'Genre & Language',
                    label: (
                        <Title level={4} className="!mb-0">
                            {messages('genre.label')} &{' '}
                            {messages('language.label')}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-3 items-center gap-5">
                            <FormItem
                                name="primaryGenreId"
                                label={messages('genres.primary')}
                                required
                                ErrorMessage={errors.primaryGenreId?.message}
                                tooltipInfor={messages(
                                    'tooltipForm.primaryGenre'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="primaryGenreId"
                                    render={({ field }) => {
                                        return (
                                            <GenresSelect
                                                showSearch
                                                className="w-full"
                                                id="primaryGenreId"
                                                {...field}
                                                fallBack={
                                                    formValues?.primaryGenre
                                                        ?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdate({
                                                        primaryGenreId: e,
                                                    });
                                                }}
                                                status={
                                                    errors.primaryGenreId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={isCreateReleasePage}
                                            />
                                        );
                                    }}
                                />
                            </FormItem>

                            <FormItem
                                name="subGenreId"
                                label={messages('common.subGenres')}
                                ErrorMessage={errors.subGenreId?.message}
                                tooltipInfor={messages('tooltipForm.subGenre')}
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
                                            fallBack={
                                                formValues?.subGenre?.name
                                            }
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debouncedUpdate({
                                                    subGenreId: e,
                                                });
                                            }}
                                            status={
                                                errors.subGenreId
                                                    ? 'error'
                                                    : undefined
                                            }
                                            disabled={isCreateReleasePage}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                name="releaseLanguage.metadataLanguageId"
                                label={`${messages('common.language')} metadata`}
                                required
                                ErrorMessage={
                                    errors.releaseLanguage?.metadataLanguageId
                                        ?.message
                                }
                                tooltipInfor={messages(
                                    'tooltipForm.metadataLanguage'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="releaseLanguage.metadataLanguageId"
                                    render={({ field }) => {
                                        const fallBackLabel =
                                            formValues?.releaseLanguage
                                                ?.metadataLanguage?.name;
                                        return (
                                            <LanguageSelect
                                                className="w-full"
                                                id="releaseLanguage.metadataLanguageId"
                                                {...field}
                                                fallBack={fallBackLabel}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdate({
                                                        releaseLanguage: {
                                                            metadataLanguageId:
                                                                e,
                                                        },
                                                    });
                                                }}
                                                status={
                                                    errors.releaseLanguage
                                                        ?.metadataLanguageId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={isCreateReleasePage}
                                            />
                                        );
                                    }}
                                />
                            </FormItem>

                            <FormItem
                                name="releaseLanguage.audioLanguageId"
                                label={`${messages('tracks.language')}`}
                                required
                                ErrorMessage={
                                    errors.releaseLanguage?.audioLanguageId
                                        ?.message
                                }
                                tooltipInfor={messages(
                                    'tooltipForm.languageTrack'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="releaseLanguage.audioLanguageId"
                                    render={({ field }) => {
                                        const fallBackLabel =
                                            formValues?.releaseLanguage
                                                ?.audioLanguage?.name;
                                        return (
                                            <LanguageSelect
                                                className="w-full"
                                                id="releaseLanguage.audioLanguageId"
                                                showSearch
                                                {...field}
                                                fallBack={fallBackLabel}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdate({
                                                        releaseLanguage: {
                                                            audioLanguageId: e,
                                                        },
                                                    });
                                                }}
                                                status={
                                                    errors.releaseLanguage
                                                        ?.audioLanguageId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={isCreateReleasePage}
                                            />
                                        );
                                    }}
                                />
                            </FormItem>

                            <FormItem
                                name="releaseLanguage.metadataLanguageCountryId"
                                label={`Metadata ${messages('country.language').toLowerCase()}`}
                                required
                                ErrorMessage={
                                    errors.releaseLanguage
                                        ?.metadataLanguageCountryId?.message
                                }
                                tooltipInfor={messages(
                                    'tooltipForm.countryLanguage'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="releaseLanguage.metadataLanguageCountryId"
                                    render={({ field }) => {
                                        const fallBackLabel =
                                            formValues?.releaseLanguage
                                                ?.metadataLanguageCountry?.name;
                                        return (
                                            <CountrySelect
                                                className="w-full"
                                                id="releaseLanguage.metadataLanguageCountryId"
                                                showSearch
                                                {...field}
                                                fallBack={fallBackLabel}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUpdate({
                                                        releaseLanguage: {
                                                            metadataLanguageCountryId:
                                                                e,
                                                        },
                                                    });
                                                }}
                                                status={
                                                    errors.releaseLanguage
                                                        ?.metadataLanguageCountryId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={isCreateReleasePage}
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                        </div>
                    ),
                },
            ]}
        />
    );
}
