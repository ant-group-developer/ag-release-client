// React Hook Form version using Controller
import { LabelForm } from '@/components/ui/label/labelForm';
import FormItem from '@/components/ui/react-hook-form/form-item';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import LanguageSelect from '@/components/ui/select/language-select';
import ErrorText from '@/components/ui/text/error-text';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { ArtistData } from '@/modules/artist/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import {
    RELEASES_TABS,
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleaseCoverArt, ReleasesData } from '@/modules/releases/types';
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
import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from './artist-card';

export const releaseDetailSchema = (messages: any) =>
    z.object({
        upc: z.string().optional(),
        primaryGenreId: z.string().nonempty(messages('validation.input')),
        subGenreId: z.string().optional(),
        releaseLanguage: z.object({
            metadataLanguageId: z
                .string()
                .nonempty(messages('validation.input')),
            metadataLanguageCountryId: z
                .string()
                .nonempty(messages('validation.input')),
            audioLanguageId: z.string().nonempty(messages('validation.input')),
            releaseId: z.string().nonempty(messages('validation.input')),
        }),
        labelId: z.string().optional(),
        catalogId: z.string().optional(),
        title: z
            .string()
            .min(1, messages('validation.input'))
            .max(100, messages('validation.input')),
        version: z.string().optional(),
        type: z.nativeEnum(RELEASES_TYPE, {
            required_error: messages('validation.select'),
        }),
        releaseArtists: z.array(z.custom<ReleaseArtist>()),
        coverArtThumbnails: z.custom<ReleaseCoverArt>(),
        pLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nonempty(messages('validation.input')),
        cLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nonempty(messages('validation.input')),
        isVariousArtist: z.boolean(),
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

    // zustand store
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const openModal = useModalStore((state) => state.openModal);

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
    const version = watch('version');
    const type = watch('type');
    const title = watch('title');
    const isEnableCreateDraftBtn = (!!type && !!title) === true;
    const releaseArtist = formValues.releaseArtists || [];

    const handleNext = async (data: any) => {
        const valid = await trigger();
        if (valid) {
            router.push(
                getReleaseDetailTabRoute(
                    formValues.id as string,
                    RELEASES_TABS.TRACKS
                )
            );
        }
    };
    const handleFormError = (errors: any) => {};
    const handleApplyAllTracks = (checked: boolean, artist: ArtistData) => {
        // if (!checked) {
        //     setFormValues({
        //         ...formValues,
        //         artistsApplyAllTracks:
        //             formValues?.artistsApplyAllTracks?.filter(
        //                 (item) => item.name !== artist.name
        //             ),
        //     });
        //     return;
        // }
        // const isArtistExists = formValues?.artistsApplyAllTracks?.some(
        //     (item) => item.name === artist.name
        // );
        // const updatedTracks = formValues?.tracks?.map((track) => {
        //     const isArtistExistsInTrack = track.artists?.some(
        //         (item) => item.name === artist.name
        //     );
        //     if (isArtistExistsInTrack) return track;
        //     return {
        //         ...track,
        //         artists: [...track.artists, artist as ArtistData],
        //     };
        // });
        // setFormValues({
        //     ...formValues,
        //     artistsApplyAllTracks: isArtistExists
        //         ? formValues?.artistsApplyAllTracks
        //         : [
        //               ...(formValues?.artistsApplyAllTracks || []),
        //               artist as ArtistData,
        //           ],
        //     tracks: updatedTracks,
        // });
        // showNotification('success', 'Đã thêm nghệ sĩ vào tất cả bài hát');
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
                title: title,
                version: version,
                type: type,
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
        debounce(async (data) => {
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
                            formValues.releaseLanguage?.metadataLanguageId ||
                            '',
                        metadataLanguageCountryId:
                            formValues.releaseLanguage
                                ?.metadataLanguageCountryId || '',
                        audioLanguageId:
                            formValues.releaseLanguage?.audioLanguageId || '',
                        releaseId: formValues.id || '',
                    },
                    // metadataLanguageId:
                    //     formValues.releaseLanguage?.metadataLanguageId ?? '',
                    coverArtThumbnails: {
                        '75x75': null,
                        '100x100': null,
                        '160x160': null,
                        '300x300': null,
                        '900x900': null,
                        original: null,
                    },
                };
                setFormValues(initialFormValue);
                reset(initialFormValue);
            }
        }
    }, [isCreateReleasePage, releaseId]);

    return (
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
                                                const value = e.target.value;
                                                field.onChange(value);
                                                debouncedUpdate({
                                                    type: value,
                                                });
                                            }}
                                        >
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
                                htmlFor="title"
                                required
                                label={messages('releases.name')}
                            />
                            <Controller
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="title"
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value);
                                                debouncedUpdate({
                                                    title: value,
                                                });
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
                            <ErrorText
                                isError={!!errors.title}
                                message={errors.title?.message}
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value);
                                            debouncedUpdate({
                                                version: value,
                                            });
                                        }}
                                        allowClear
                                        status={
                                            errors.version ? 'error' : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        {isCreateReleasePage && (
                            <div className="col-span-2 flex w-full justify-end">
                                <Button
                                    type="primary"
                                    onClick={() => handleCreateReleaseDraft()}
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
                                                        field.onChange(value);
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
                                                    // onApplyToAllTracks={(checked) =>
                                                    //     handleApplyAllTracks(
                                                    //         checked,
                                                    //         releaseArtist
                                                    //     )
                                                    // }
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
                                                errors.releaseArtists
                                                    ?.length === 0
                                            }
                                            message={
                                                errors.releaseArtists?.message
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <FormItem
                            name="primaryGenreId"
                            label={messages('common.genres')}
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
                                render={({ field }) => (
                                    <LanguageSelect
                                        className="w-full"
                                        id="metaDataLanguage"
                                        showSearch
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
                                            errors.releaseLanguage
                                                ?.metadataLanguageId
                                                ? 'error'
                                                : undefined
                                        }
                                        disabled={isCreateReleasePage}
                                    />
                                )}
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
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debouncedUpdate({
                                                labelId: e,
                                            });
                                        }}
                                        status={
                                            errors.labelId ? 'error' : undefined
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
                            label="Bản quyền tác phẩm"
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
                                        debouncedUpdate({ cLineOwner: value });
                                    };

                                    const handleOwnerChange = (
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        const value =
                                            `${year} ${e.target.value}`.trim();
                                        field.onChange(value);
                                        debouncedUpdate({ cLineOwner: value });
                                    };
                                    return (
                                        <Input
                                            id="cLineOwner"
                                            value={ownerCopyRight}
                                            onChange={handleOwnerChange}
                                            disabled={isCreateReleasePage}
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
                                                    disabled={
                                                        isCreateReleasePage
                                                    }
                                                />
                                            }
                                            // status={
                                            //     errors.cLine?.name
                                            //         ? 'error'
                                            //         : undefined
                                            // }
                                        />
                                    );
                                }}
                            />
                        </FormItem>

                        <FormItem
                            name="pLineOwner"
                            label="Bản quyền ghi âm"
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
                                        debouncedUpdate({ pLineOwner: value });
                                    };

                                    const handleOwnerChange = (
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        const value =
                                            `${year} ${e.target.value}`.trim();
                                        field.onChange(value);
                                        debouncedUpdate({ pLineOwner: value });
                                    };

                                    return (
                                        <Input
                                            id="pLineOwner"
                                            value={ownerCopyRight}
                                            onChange={handleOwnerChange}
                                            disabled={isCreateReleasePage}
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
                                                    disabled={
                                                        isCreateReleasePage
                                                    }
                                                />
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
                    >
                        {messages('common.next')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
