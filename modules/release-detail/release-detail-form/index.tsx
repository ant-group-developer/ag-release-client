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
import {
    RELEASES_TABS,
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { CreateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { CreateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

export const releaseDetailSchema = (messages: any) =>
    z.object({
        upc: z.string().optional(),
        primaryGenreId: z.string().nonempty(messages('validation.input')),
        subGenreId: z.string().optional(),
        metadataLanguageId: z.string().nonempty(messages('validation.input')),
        labelId: z.string().optional(),
        catalogId: z.string().optional(),
        title: z.string().nonempty(messages('validation.input')),
        version: z.string().optional(),
        type: z.nativeEnum(RELEASES_TYPE, {
            required_error: messages('validation.select'),
        }),
        releaseArtists: z.array(z.unknown()), // Check lại type
        coverArtThumbnails: z.any(), // Check lại type
        pLineOwner: z.string().nonempty(messages('validation.input')),
        cLineOwner: z.string().nonempty(messages('validation.input')),
        isMoreThan4Artists: z.string().nonempty(messages('validation.input')),
    });

export type ReleaseDetailSchema = z.infer<
    ReturnType<typeof releaseDetailSchema>
>;

export default function ReleaseDetailForm() {
    const messages = useTranslations();

    //hook
    const { createReleaseDraft, isPending: isOnCreatingDraft } =
        useCreateReleaseDraft();

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
        // defaultValues: initialFormValue,
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

    const isMoreThan4Artists = watch('isMoreThan4Artists');
    const version = watch('version');
    const type = watch('type');
    const title = watch('title');
    const isEnableCreateDraftBtn = (!!type && !!title) === true;
    const artists = formValues.releaseArtists || [];

    const handleNext = async (data: any) => {
        console.log('🚀 ~ handleNext ~ data:', data);
        // setFormValues(data as Partial<ReleaseFormValuesData>);
        // router.push('/releases/detail/123456/tracks');
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
                console.log('🚀 ~ handleCreateReleaseDraft ~ data:', data);
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

    // const debouncedSetFormValues = useMemo(
    //     () =>
    //         debounce((values: ReleaseDetailSchema) => {
    //             setFormValues({
    //                 ...formValues,
    //                 ...(values as Partial<ReleaseFormValuesData>),
    //             });
    //         }, 300),
    //     [setFormValues, formValues.artists]
    // );

    useEffect(() => {
        if (isCreateReleasePage) {
            reset();
        } else {
            if (releaseId && formValues) {
                const initialFormValue: ReleaseDetailSchema = {
                    primaryGenreId: formValues.primaryGenreId ?? '',
                    subGenreId: formValues.subGenreId ?? '',
                    metadataLanguageId: '',
                    title: formValues.title ?? '',
                    type: formValues.type ?? RELEASES_TYPE.ALBUM,
                    releaseArtists: formValues.releaseArtists ?? [],
                    pLineOwner: formValues.pLineOwner ?? '',
                    cLineOwner: formValues.cLineOwner ?? '',
                    isMoreThan4Artists: '',
                    upc: formValues.upc ?? '',
                    labelId: formValues.labelId ?? '',
                    catalogId: formValues.catalogId ?? '',
                    version: formValues.version ?? '',
                };
                reset(initialFormValue);
            }
        }
    }, [isCreateReleasePage, releaseId, formValues]);

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
                                name="type"
                                label={messages('releases.type')}
                                required
                                ErrorMessage={errors.type?.message}
                            >
                                <Controller
                                    control={control}
                                    name="type"
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
                                    name="isMoreThan4Artists"
                                    label={messages(
                                        'releases.isMoreThan4Artists'
                                    )}
                                    required
                                    ErrorMessage={''}
                                >
                                    <Controller
                                        control={control}
                                        name="isMoreThan4Artists"
                                        render={({ field }) => (
                                            <div className="pb-2 pt-1">
                                                <Radio.Group
                                                    {...field}
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
                                {!isMoreThan4Artists && (
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
                                        {/* <ErrorText
                                                isError={
                                                    errors.artists?.length === 0
                                                }
                                                message={errors.artists?.message}
                                            /> */}
                                    </div>
                                )}
                            </div>

                            {/* {!isMoreThan4Artists && (
                                <div className="grid grid-cols-2 gap-8">
                                    {artists.map(
                                        (
                                            artist: ReleaseArtists,
                                            index: number
                                        ) => (
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
                                        )
                                    )}
                                </div>
                            )} */}
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
                            name="metadataLanguageId"
                            label={`${messages('common.language')} metadata`}
                            required
                            ErrorMessage={errors.metadataLanguageId?.message}
                        >
                            <Controller
                                control={control}
                                name="metadataLanguageId"
                                render={({ field }) => (
                                    <LanguageSelect
                                        className="w-full"
                                        id="metaDataLanguage"
                                        showSearch
                                        {...field}
                                        status={
                                            errors.metadataLanguageId
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
                                    return (
                                        <Input
                                            id="cLineOwner"
                                            value={ownerCopyRight}
                                            disabled={isCreateReleasePage}
                                            // onChange={(e) =>
                                            //     field.onChange({
                                            //         ...field.value,
                                            //         name: e.target.value,
                                            //         year:
                                            //             field.value?.year || '2026',
                                            //     })
                                            // }
                                            allowClear
                                            addonBefore={
                                                <Select
                                                    value={year}
                                                    // onChange={(year) =>
                                                    //     field.onChange({
                                                    //         ...field.value,
                                                    //         year: year || '2026',
                                                    //         name:
                                                    //             field.value?.name ||
                                                    //             '',
                                                    //     })
                                                    // }
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
                                    return (
                                        <Input
                                            id="cLineOwner"
                                            value={ownerCopyRight}
                                            disabled={isCreateReleasePage}
                                            // onChange={(e) =>
                                            //     field.onChange({
                                            //         ...field.value,
                                            //         name: e.target.value,
                                            //         year:
                                            //             field.value?.year || '2026',
                                            //     })
                                            // }
                                            allowClear
                                            addonBefore={
                                                <Select
                                                    value={year}
                                                    // onChange={(year) =>
                                                    //     field.onChange({
                                                    //         ...field.value,
                                                    //         year: year || '2026',
                                                    //         name:
                                                    //             field.value?.name ||
                                                    //             '',
                                                    //     })
                                                    // }
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
                                            //     errors.pLine?.name
                                            //         ? 'error'
                                            //         : undefined
                                            // }
                                        />
                                    );
                                }}
                            />
                        </FormItem>
                    </div>
                </div>

                {/* <div className="flex w-full justify-end">
                    <Button type="primary" className="my-8" htmlType="submit">
                        {messages('common.next')}
                    </Button>
                </div> */}
            </form>
        </FormProvider>
    );
}
