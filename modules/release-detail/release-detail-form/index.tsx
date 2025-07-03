// React Hook Form version using Controller
import { LabelForm } from '@/components/ui/label/labelForm';
import FormItem from '@/components/ui/react-hook-form/form-item';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import ErrorText from '@/components/ui/text/error-text';
import { languageList, yearList } from '@/constants/fakeData';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { ArtistData } from '@/modules/artist/types';
import {
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { ReleaseFormValuesData } from '@/modules/releases/types';
import { GENRES } from '@/modules/tracks/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Radio, Select } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from './artist-card';

export const releaseDetailSchema = (messages: any) =>
    z.object({
        releaseType: z
            .nativeEnum(RELEASES_TYPE, {
                required_error: messages('validation.select'),
            })
            .nullable(),
        nameRelease: z.string().nonempty(messages('validation.input')),
        version: z.string().optional(),
        isMoreThan4Artists: z.boolean(),
        // artists: z.array(artistSchema(messages)),
        genres: z.nativeEnum(GENRES).nullable(),
        subGenres: z.nativeEnum(GENRES).nullable().optional(),
        metaDataLanguage: z.string().nonempty(messages('validation.select')),
        label: z.string().optional(),
        upc: z.string().optional(),
        catalogId: z.string().optional(),
        cLine: z.object({
            year: z.string().nonempty(messages('validation.input')),
            name: z.string().nonempty(messages('validation.input')),
        }),
        pLine: z.object({
            year: z.string().nonempty(messages('validation.input')),
            name: z.string().nonempty(messages('validation.input')),
        }),
    });

export type ReleaseDetailSchema = z.infer<
    ReturnType<typeof releaseDetailSchema>
>;

export default function ReleaseDetailForm() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formUpdateRef = useRef(false);

    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === 'create';

    const formMethods = useForm<ReleaseDetailSchema>({
        // defaultValues: isEmptyFormValues ? undefined : formValues,
        resolver: zodResolver(releaseDetailSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        reset,
    } = formMethods;

    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const isMoreThan4Artists = watch('isMoreThan4Artists');
    const artists = formValues.artists || [];
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );

    const handleNext = async (data: ReleaseDetailSchema) => {
        setFormValues(data as Partial<ReleaseFormValuesData>);
        router.push('/releases/detail/123456/tracks');
    };

    // Thêm handler để debug form errors
    const handleFormError = (errors: any) => {
        console.log('❌ Form có lỗi validation:', errors);
    };

    const handleApplyAllTracks = (checked: boolean, artist: ArtistData) => {
        if (!checked) {
            setFormValues({
                ...formValues,
                artistsApplyAllTracks:
                    formValues?.artistsApplyAllTracks?.filter(
                        (item) => item.name !== artist.name
                    ),
            });
            return;
        }

        const isArtistExists = formValues?.artistsApplyAllTracks?.some(
            (item) => item.name === artist.name
        );

        const updatedTracks = formValues?.tracks?.map((track) => {
            const isArtistExistsInTrack = track.artists?.some(
                (item) => item.name === artist.name
            );
            if (isArtistExistsInTrack) return track;
            return {
                ...track,
                artists: [...track.artists, artist as ArtistData],
            };
        });

        setFormValues({
            ...formValues,
            artistsApplyAllTracks: isArtistExists
                ? formValues?.artistsApplyAllTracks
                : [
                      ...(formValues?.artistsApplyAllTracks || []),
                      artist as ArtistData,
                  ],
            tracks: updatedTracks,
        });

        showNotification('success', 'Đã thêm nghệ sĩ vào tất cả bài hát');
    };

    const debouncedSetFormValues = useMemo(
        () =>
            debounce((values: ReleaseDetailSchema) => {
                setFormValues({
                    ...formValues,
                    ...(values as Partial<ReleaseFormValuesData>),
                });
            }, 300),
        [setFormValues, formValues.artists]
    );

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        if (formUpdateRef.current) {
            formUpdateRef.current = false; // Reset flag khi form đã được reset
            // Không cần set lại giá trị trong store khi form đang được reset
            return;
        }

        // Chỉ update các trường khác ngoài artists
        // const { artists, ...otherFields } = watchedAllFields;
        const { ...otherFields } = watchedAllFields;
        const {
            artists: currentArtists,
            artistsApplyAllTracks,
            ...currentOtherFields
        } = formValues;

        if (
            JSON.stringify(otherFields) !== JSON.stringify(currentOtherFields)
        ) {
            debouncedSetFormValues({
                ...watchedAllFields,
                artistsApplyAllTracks,
            } as ReleaseDetailSchema);
        }

        // Cleanup function
        return () => {
            debouncedSetFormValues.cancel();
        };
    }, [watchedAllFields]);

    useEffect(() => {
        // console.log(
        //     '🚀 ~ useEffect ~ isCreateReleasePage:',
        //     isCreateReleasePage
        // );

        if (isCreateReleasePage) {
            reset();
        } else {
            // console.log('formvalue', formValues);
            reset(formValues);
        }
        formUpdateRef.current = true;
    }, [releaseId, formValues?.id]);

    return (
        <FormProvider {...formMethods}>
            <form
                className="px-4 pt-4"
                onSubmit={handleSubmit(handleNext, handleFormError)}
            >
                <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="col-span-2 flex flex-col">
                            <FormItem
                                name="releaseType"
                                label={messages('releases.type')}
                                required
                                ErrorMessage={errors.releaseType?.message}
                            >
                                <Controller
                                    control={control}
                                    name="releaseType"
                                    render={({ field }) => (
                                        <Radio.Group {...field}>
                                            {Object.values(RELEASES_TYPE).map(
                                                (type) => (
                                                    <Radio
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type}
                                                    </Radio>
                                                )
                                            )}
                                        </Radio.Group>
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div>
                            <LabelForm
                                htmlFor="nameRelease"
                                required
                                label={messages('releases.name')}
                            />
                            <Controller
                                control={control}
                                name="nameRelease"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="nameRelease"
                                            {...field}
                                            allowClear
                                            status={
                                                errors.nameRelease
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.nameRelease}
                                message={errors.nameRelease?.message}
                            />
                        </div>

                        <FormItem
                            name="version"
                            label={messages('releases.version')}
                            ErrorMessage={errors.version?.message}
                        >
                            <Controller
                                control={control}
                                name="version"
                                render={({ field }) => (
                                    <Input
                                        id="version"
                                        {...field}
                                        allowClear
                                        status={
                                            errors.version ? 'error' : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="col-span-2">
                            <div className="flex items-center justify-between">
                                <FormItem
                                    name="isMoreThan4Artists"
                                    label={messages(
                                        'releases.isMoreThan4Artists'
                                    )}
                                    required
                                    ErrorMessage={
                                        errors.isMoreThan4Artists?.message
                                    }
                                >
                                    <Controller
                                        control={control}
                                        name="isMoreThan4Artists"
                                        render={({ field }) => (
                                            <div className="pb-2 pt-1">
                                                <Radio.Group {...field}>
                                                    <Radio value={false}>
                                                        {messages('common.no')}
                                                    </Radio>
                                                    <Radio value={true}>
                                                        {messages('common.yes')}
                                                        {` (${messages(
                                                            'artist.descriptionVariantArtists'
                                                        )})`}
                                                    </Radio>
                                                </Radio.Group>
                                            </div>
                                        )}
                                    />
                                </FormItem>
                                {!isMoreThan4Artists && (
                                    <div className="pt-5">
                                        <Button
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST
                                                )
                                            }
                                        >
                                            {messages('artist.add')}
                                        </Button>
                                        {/* <ErrorText
                                                isError={
                                                    errors.artists?.length === 0
                                                }
                                                message={errors.artists?.message}
                                            /> */}
                                    </div>
                                )}
                            </div>

                            {!isMoreThan4Artists && (
                                <div className="grid grid-cols-2 gap-8">
                                    {artists.map((artist, index) => (
                                        <ArtistCard
                                            key={index}
                                            index={index}
                                            data={artist}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST,
                                                    artist
                                                );
                                            }}
                                            onDelete={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                                                    artist
                                                )
                                            }
                                            showApplyToAllTracks
                                            onApplyToAllTracks={(checked) =>
                                                handleApplyAllTracks(
                                                    checked,
                                                    artist
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <FormItem
                            name="genres"
                            label={messages('common.genres')}
                            required
                            ErrorMessage={errors.genres?.message}
                        >
                            <Controller
                                control={control}
                                name="genres"
                                render={({ field }) => (
                                    <GenresSelect
                                        showSearch
                                        className="w-full"
                                        id="genres"
                                        {...field}
                                        status={
                                            errors.genres ? 'error' : undefined
                                        }
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
                                control={control}
                                name="subGenres"
                                render={({ field }) => (
                                    <GenresSelect
                                        className="w-full"
                                        allowClear
                                        showSearch
                                        id="subGenres"
                                        {...field}
                                        status={
                                            errors.subGenres
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="metaDataLanguage"
                            label={`${messages('common.language')} metadata`}
                            required
                            ErrorMessage={errors.metaDataLanguage?.message}
                        >
                            <Controller
                                control={control}
                                name="metaDataLanguage"
                                render={({ field }) => (
                                    <Select
                                        className="w-full"
                                        id="metaDataLanguage"
                                        showSearch
                                        {...field}
                                        options={languageList}
                                        status={
                                            errors.metaDataLanguage
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="label"
                            label="Label"
                            ErrorMessage={errors.label?.message}
                        >
                            <Controller
                                control={control}
                                name="label"
                                render={({ field }) => (
                                    <LabelSelect
                                        className="w-full"
                                        showSearch
                                        allowClear
                                        id="label"
                                        {...field}
                                        status={
                                            errors.label ? 'error' : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="upc"
                            label="UPC/EAN/JAN"
                            ErrorMessage={errors.upc?.message}
                        >
                            <Controller
                                control={control}
                                name="upc"
                                render={({ field }) => (
                                    <Input
                                        id="upc"
                                        {...field}
                                        allowClear
                                        status={
                                            errors.upc ? 'error' : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="catalogId"
                            label="ID category"
                            ErrorMessage={errors.catalogId?.message}
                        >
                            <Controller
                                control={control}
                                name="catalogId"
                                render={({ field }) => (
                                    <Input
                                        id="catalogId"
                                        {...field}
                                        allowClear
                                        status={
                                            errors.catalogId
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="cLine"
                            label="Bản quyền tác phẩm"
                            required
                            tooltipInfor={messages(
                                'releases.cLineYearDescription'
                            )}
                            ErrorMessage={errors.cLine?.message}
                        >
                            <Controller
                                control={control}
                                name="cLine"
                                render={({ field }) => (
                                    <Input
                                        id="cLine"
                                        value={field.value?.name || ''}
                                        onChange={(e) =>
                                            field.onChange({
                                                ...field.value,
                                                name: e.target.value,
                                                year:
                                                    field.value?.year || '2026',
                                            })
                                        }
                                        allowClear
                                        addonBefore={
                                            <Select
                                                value={
                                                    field.value?.year || '2026'
                                                }
                                                onChange={(year) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        year: year || '2026',
                                                        name:
                                                            field.value?.name ||
                                                            '',
                                                    })
                                                }
                                                options={yearList}
                                                style={{ width: 90 }}
                                            />
                                        }
                                        status={
                                            errors.cLine?.name
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="pLine"
                            label="Bản quyền ghi âm"
                            required
                            tooltipInfor={messages(
                                'releases.pLineYearDescription'
                            )}
                            ErrorMessage={errors.pLine?.message}
                        >
                            <Controller
                                control={control}
                                name="pLine"
                                render={({ field }) => (
                                    <Input
                                        id="pLine"
                                        value={field.value?.name || ''}
                                        onChange={(e) =>
                                            field.onChange({
                                                ...field.value,
                                                name: e.target.value,
                                                year:
                                                    field.value?.year || '2026',
                                            })
                                        }
                                        allowClear
                                        addonBefore={
                                            <Select
                                                value={
                                                    field.value?.year || '2026'
                                                }
                                                onChange={(year) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        year: year || '2026',
                                                        name:
                                                            field.value?.name ||
                                                            '',
                                                    })
                                                }
                                                options={yearList}
                                                style={{ width: 90 }}
                                            />
                                        }
                                        status={
                                            errors.pLine?.name
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </div>

                <div className="flex w-full justify-end">
                    <Button type="primary" className="my-8" htmlType="submit">
                        {messages('common.next')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
