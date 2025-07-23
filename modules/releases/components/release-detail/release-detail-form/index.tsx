// React Hook Form version using Controller
import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import LanguageSelect from '@/components/ui/select/language-select';
import ErrorText from '@/components/ui/text/error-text';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import {
    RELEASES_TABS,
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { releaseSchema } from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import {
    CreateReleaseDraftPayload,
    UpdateReleaseDraftPayload,
} from '@/modules/releases/types/payload';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from './artist-card';

export const releaseDetailSchema = (messages: any) =>
    releaseSchema(messages).pick({
        upc: true,
        primaryGenreId: true,
        subGenreId: true,
        releaseLanguage: true,
        labelId: true,
        catalogId: true,
        title: true,
        version: true,
        type: true,
        releaseArtists: true,
        coverArtThumbnails: true,
        pLineOwner: true,
        cLineOwner: true,
        isVariousArtist: true,
    });

export type ReleaseDetailSchema = z.infer<
    ReturnType<typeof releaseDetailSchema>
>;

export default function ReleaseDetailForm() {
    const messages = useTranslations();

    //hook
    const { createReleaseDraft, isPending: isOnCreatingDraft } =
        useCreateReleaseDraft();
    const { updateReleaseDraft } = useUpdateReleaseDraft();
    const { active, deActive, isActive } = useActive();
    const { updateReleaseArtist } = useUpdateReleaseArtist();

    // zustand store - state
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const openModal = useModalStore((state) => state.openModal);
    const [showCreateLabel, setShowCreateLabel] = useState<boolean>(false);

    //route
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === 'create';

    // form
    const formMethods = useForm<ReleaseDetailSchema>({
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
        getValues,
    } = formMethods;
    const isVariousArtist = watch('isVariousArtist');
    const version = watch('version') ?? '';
    const type = watch('type');
    const title = watch('title') ?? '';
    const isEnableCreateDraftBtn = (!!type && !!title) === true;
    const releaseArtist = formValues.releaseArtists || [];

    // function
    const handleNext = async () => {
        active();
        const valid = await trigger();
        if (valid) {
            router.push(
                getReleaseDetailTabRoute(
                    formValues.id as string,
                    RELEASES_TABS.TRACKS
                )
            );
        } else {
            deActive();
            showNotification('error', messages('validation.error'));
        }
    };
    const handleFormError = (errors: any) => {};
    const handleApplyAllTracks = (
        releaseArtist: ReleaseArtist,
        isAddArtistToTracks: boolean
    ) => {
        const variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        > = {
            id: releaseArtist.id,
            payload: {
                addArtistToTracks: isAddArtistToTracks,
            },
        };
        updateReleaseArtist(variables);
    };
    const copyRightYearList = () => {
        const currentYear = dayjs().year();
        const yearList = [
            {
                label: (currentYear - 1).toString(),
                value: (currentYear - 1).toString(),
            },
            { label: currentYear.toString(), value: currentYear.toString() },
            {
                label: (currentYear + 1).toString(),
                value: (currentYear + 1).toString(),
            },
        ];
        return yearList;
    };
    const copyRightYears = copyRightYearList();
    const handleCreateReleaseDraft = () => {
        const variables: CreateVariables<CreateReleaseDraftPayload> = {
            payload: {
                title: title ?? '',
                version: version ?? '',
                type: type ?? RELEASES_TYPE.ALBUM,
            },
            onSuccess: (data) => {
                router.push(
                    getReleaseDetailTabRoute(
                        data?.id,
                        RELEASES_TABS.CORE_DETAIL
                    )
                );
            },
        };
        createReleaseDraft(variables);
    };
    const debouncedUpdate = useCallback(
        debounce(async (data: any, fieldName?: string) => {
            if (fieldName) {
                const valid = await trigger(
                    fieldName as keyof ReleaseDetailSchema
                );
                if (!valid) return;
            }
            if (!formValues.id) return;
            const variables: UpdateVariables<
                ReleasesData['id'],
                UpdateReleaseDraftPayload
            > = {
                id: formValues.id ?? '',
                payload: data,
                onSuccess: (data: ReleasesData) => {
                    setFormValues(data);
                },
            };
            updateReleaseDraft(variables);
        }, 500),
        [formValues.id]
    );

    useEffect(() => {
        if (isCreateReleasePage) {
            reset();
        } else {
            if (releaseId && formValues) {
                const initialFormValue: ReleaseDetailSchema = {
                    primaryGenreId: formValues.primaryGenreId ?? '',
                    subGenreId: formValues.subGenreId ?? '',
                    title: formValues.title ?? '',
                    type: formValues.type ?? RELEASES_TYPE.ALBUM,
                    releaseArtists: formValues.releaseArtists ?? [],
                    pLineOwner: formValues.pLineOwner ?? `${dayjs().year()} `,
                    cLineOwner: formValues.cLineOwner ?? `${dayjs().year()} `,
                    isVariousArtist: formValues.isVariousArtist ?? false,
                    upc: formValues.upc ?? '',
                    labelId: formValues.labelId ?? '',
                    catalogId: formValues.catalogId ?? '',
                    version: formValues.version ?? '',
                    releaseLanguage: {
                        metadataLanguageId:
                            formValues.releaseLanguage?.metadataLanguageId ??
                            '',
                        audioLanguageId:
                            formValues.releaseLanguage?.audioLanguageId ?? '',
                        metadataLanguageCountryId:
                            formValues.releaseLanguage
                                ?.metadataLanguageCountryId ?? '',
                    },
                    coverArtThumbnails: formValues.coverArtThumbnails ?? {
                        '75x75': '',
                        '100x100': '',
                        '160x160': '',
                        '300x300': '',
                        '900x900': '',
                        original: '',
                    },
                };
                // setFormValues(initialFormValue);
                reset(initialFormValue);
            }
        }
    }, [isCreateReleasePage, releaseId, formValues]);

    return (
        <>
            <FormProvider {...formMethods}>
                <form
                    className="px-4 py-4"
                    onSubmit={handleSubmit(handleNext, handleFormError)}
                >
                    <div className="flex flex-col">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="col-span-2 flex flex-col">
                                <FormItem
                                    name="type"
                                    label={messages('releases.type')}
                                    required
                                    ErrorMessage={errors.type?.message}
                                >
                                    <Controller
                                        control={control}
                                        name="type"
                                        render={({ field }) => (
                                            <Radio.Group
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    debouncedUpdate({
                                                        type: value,
                                                    });
                                                }}
                                            >
                                                {Object.values(
                                                    RELEASES_TYPE
                                                ).map((type) => (
                                                    <Radio
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type}
                                                    </Radio>
                                                ))}
                                            </Radio.Group>
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    name="title"
                                    label={messages('releases.name')}
                                    required
                                    ErrorMessage={errors.title?.message}
                                >
                                    <Controller
                                        control={control}
                                        name="title"
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    id="title"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate(
                                                            {
                                                                title: value,
                                                            },
                                                            'title'
                                                        );
                                                    }}
                                                    allowClear
                                                    status={
                                                        errors.title
                                                            ? 'error'
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </FormItem>
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
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value);
                                                debouncedUpdate(
                                                    {
                                                        version: value,
                                                    },
                                                    'version'
                                                );
                                            }}
                                            allowClear
                                            status={
                                                errors.version
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            {isCreateReleasePage && (
                                <div className="col-span-2 flex w-full justify-end">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            handleCreateReleaseDraft()
                                        }
                                        disabled={!isEnableCreateDraftBtn}
                                        loading={isOnCreatingDraft}
                                    >
                                        {messages('common.next')}
                                    </Button>
                                </div>
                            )}

                            <div className="col-span-2">
                                <div className="flex items-center justify-between">
                                    <FormItem
                                        name="isVariousArtist"
                                        label={messages(
                                            'releases.isMoreThan4Artists'
                                        )}
                                        required
                                        ErrorMessage={''}
                                    >
                                        <Controller
                                            control={control}
                                            name="isVariousArtist"
                                            render={({ field }) => (
                                                <div className="pb-2 pt-1">
                                                    <Radio.Group
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            field.onChange(
                                                                value
                                                            );
                                                            debouncedUpdate({
                                                                isVariousArtist:
                                                                    value,
                                                            });
                                                        }}
                                                        disabled={
                                                            isCreateReleasePage
                                                        }
                                                    >
                                                        <Radio value={false}>
                                                            {messages(
                                                                'common.no'
                                                            )}
                                                        </Radio>
                                                        <Radio value={true}>
                                                            {messages(
                                                                'common.yes'
                                                            )}
                                                            {` (${messages(
                                                                'artist.descriptionVariantArtists'
                                                            )})`}
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            )}
                                        />
                                    </FormItem>
                                </div>

                                {!isVariousArtist && (
                                    <div>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                            {releaseArtist.map(
                                                (
                                                    releaseArtist: ReleaseArtist,
                                                    index: number
                                                ) => (
                                                    <ArtistCard
                                                        key={index}
                                                        index={index}
                                                        data={{
                                                            artist: releaseArtist.artist,
                                                            artistRole:
                                                                releaseArtist.artistRole,
                                                            addArtistToTracks:
                                                                releaseArtist.addArtistToTracks,
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openModal(
                                                                TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST,
                                                                releaseArtist
                                                            );
                                                        }}
                                                        onDelete={() =>
                                                            openModal(
                                                                TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                                                                releaseArtist
                                                            )
                                                        }
                                                        showApplyToAllTracks
                                                        onApplyToAllTracks={(
                                                            checked
                                                        ) =>
                                                            handleApplyAllTracks(
                                                                releaseArtist,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="pt-5">
                                            <Button
                                                onClick={() =>
                                                    openModal(
                                                        TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST
                                                    )
                                                }
                                                disabled={isCreateReleasePage}
                                            >
                                                {messages('artist.add')}
                                            </Button>
                                            <ErrorText
                                                isError={
                                                    !!errors.releaseArtists
                                                }
                                                message={
                                                    errors.releaseArtists
                                                        ?.message
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <FormItem
                                name="primaryGenreId"
                                label={messages('genres.primary')}
                                required
                                ErrorMessage={errors.primaryGenreId?.message}
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
                                                id="metaDataLanguage"
                                                showSearch
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
                                label={`${messages('country.language')}`}
                                required
                                ErrorMessage={
                                    errors.releaseLanguage
                                        ?.metadataLanguageCountryId?.message
                                }
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

                            <FormItem
                                name="labelId"
                                label="Label"
                                ErrorMessage={errors.labelId?.message}
                            >
                                <Controller
                                    control={control}
                                    name="labelId"
                                    render={({ field }) => (
                                        <LabelSelect
                                            className="w-full"
                                            showSearch
                                            allowClear
                                            id="labelId"
                                            {...field}
                                            fallBack={formValues?.label?.name}
                                            onCreateLabel={() =>
                                                setShowCreateLabel(true)
                                            }
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debouncedUpdate({
                                                    labelId: e,
                                                });
                                            }}
                                            status={
                                                errors.labelId
                                                    ? 'error'
                                                    : undefined
                                            }
                                            disabled={isCreateReleasePage}
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
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value);
                                                debouncedUpdate({
                                                    upc: value,
                                                });
                                            }}
                                            allowClear
                                            status={
                                                errors.upc ? 'error' : undefined
                                            }
                                            disabled={isCreateReleasePage}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                name="catalogId"
                                label="ID Catalog"
                                ErrorMessage={errors.catalogId?.message}
                            >
                                <Controller
                                    control={control}
                                    name="catalogId"
                                    render={({ field }) => (
                                        <Input
                                            id="catalogId"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value);
                                                debouncedUpdate({
                                                    catalogId: value,
                                                });
                                            }}
                                            allowClear
                                            status={
                                                errors.catalogId
                                                    ? 'error'
                                                    : undefined
                                            }
                                            disabled={isCreateReleasePage}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                name="cLineOwner"
                                label={messages('formFields.cLine')}
                                required
                                tooltipInfor={messages(
                                    'releases.cLineYearDescription'
                                )}
                                ErrorMessage={errors.cLineOwner?.message}
                            >
                                <Controller
                                    control={control}
                                    name="cLineOwner"
                                    render={({ field }) => {
                                        const [year, ownerCopyRight] =
                                            field.value?.split(' ') || [];

                                        const handleYearChange = (
                                            newYear: string
                                        ) => {
                                            const value =
                                                `${newYear} ${ownerCopyRight ?? ''}`.trim();
                                            field.onChange(value);
                                            debouncedUpdate({
                                                cLineOwner: value,
                                            });
                                        };

                                        const handleOwnerChange = (
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const value =
                                                `${year} ${e.target.value}`.trim();
                                            field.onChange(value);
                                            debouncedUpdate(
                                                { cLineOwner: value },
                                                'cLineOwner'
                                            );
                                        };
                                        return (
                                            <Input
                                                id="cLineOwner"
                                                {...field}
                                                value={ownerCopyRight}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleOwnerChange(e);
                                                }}
                                                disabled={isCreateReleasePage}
                                                allowClear
                                                addonBefore={
                                                    <Select
                                                        defaultValue={'2025'}
                                                        value={year}
                                                        onChange={
                                                            handleYearChange
                                                        }
                                                        options={copyRightYears}
                                                        style={{ width: 90 }}
                                                        placeholder={messages(
                                                            'common.year'
                                                        )}
                                                        disabled={
                                                            isCreateReleasePage
                                                        }
                                                    />
                                                }
                                                status={
                                                    errors.cLineOwner?.message
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
                                label={messages('formFields.pLine')}
                                required
                                tooltipInfor={messages(
                                    'releases.pLineYearDescription'
                                )}
                                ErrorMessage={errors.pLineOwner?.message}
                            >
                                <Controller
                                    control={control}
                                    name="pLineOwner"
                                    render={({ field }) => {
                                        const [year, ownerCopyRight] =
                                            field.value?.split(' ') || [];

                                        const handleYearChange = (
                                            newYear: string
                                        ) => {
                                            const value =
                                                `${newYear} ${ownerCopyRight ?? ''}`.trim();
                                            field.onChange(value);
                                            debouncedUpdate({
                                                pLineOwner: value,
                                            });
                                        };

                                        const handleOwnerChange = (
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const value =
                                                `${year} ${e.target.value}`.trim();
                                            field.onChange(value);
                                            debouncedUpdate(
                                                { pLineOwner: value },
                                                'pLineOwner'
                                            );
                                        };

                                        return (
                                            <Input
                                                id="pLineOwner"
                                                // {...field}
                                                value={ownerCopyRight}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleOwnerChange(e);
                                                }}
                                                disabled={isCreateReleasePage}
                                                allowClear
                                                addonBefore={
                                                    <Select
                                                        defaultValue={'2025'}
                                                        value={year}
                                                        onChange={
                                                            handleYearChange
                                                        }
                                                        options={copyRightYears}
                                                        style={{ width: 90 }}
                                                        placeholder={messages(
                                                            'common.year'
                                                        )}
                                                        disabled={
                                                            isCreateReleasePage
                                                        }
                                                    />
                                                }
                                                status={
                                                    errors.pLineOwner?.message
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex w-full justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={isCreateReleasePage}
                            type="primary"
                            className="my-8"
                            loading={isActive}
                        >
                            {messages('common.next')}
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {showCreateLabel && (
                <LabelFormModal
                    open={showCreateLabel}
                    onCancel={() => setShowCreateLabel(false)}
                />
            )}
        </>
    );
}
