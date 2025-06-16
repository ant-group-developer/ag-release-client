// React Hook Form version using Controller
import { LabelForm } from '@/components/ui/label/labelForm';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Radio, Select } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from './artist-card';

export const releaseDetailSchema = z.object({
    releaseType: z
        .nativeEnum(RELEASES_TYPE, {
            required_error: 'Release type is required',
        })
        .nullable(),
    nameRelease: z.string().nonempty('Release name is required'),
    version: z.string().optional(),
    isMoreThan4Artists: z.boolean(),
    artists: z.array(
        z.object({
            id: z.string(),
            name: z.string().nonempty('Artist name is required'),
            role: z.string().nonempty('Artist role is required'),
            // artistId: z.string(),
            // thumbnail: z.string(),
            // createdAt: z.date(),
        })
    ),
    genres: z.string().nullable(),
    subGenres: z.string().nullable(),
    metaDataLanguage: z.string().nonempty('Metadata language is required'),
    label: z.string().optional(),
    upc: z.string().optional(),
    catalogId: z.string().optional(),
    cLineYear: z.string().nonempty('C line year is required'),
    pLineYear: z.string().nonempty('P line year is required'),
});

export type ReleaseDetailSchema = z.infer<typeof releaseDetailSchema>;

export default function ReleaseDetailForm() {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const isEmptyFormValues = Object.keys(formValues).length === 0;

    const formMethods = useForm<ReleaseDetailSchema>({
        defaultValues: isEmptyFormValues ? undefined : formValues,
        resolver: zodResolver(releaseDetailSchema),
    });

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = formMethods;

    const router = useRouter();
    const openModal = useModalStore((state) => state.openModal);
    const isMoreThan4Artists = watch('isMoreThan4Artists');
    const artists = formValues.artists || [];

    const handleNext = async (data: ReleaseDetailSchema) => {
        setFormValues(data as Partial<ReleaseFormValuesData>);
        router.push('/releases/detail/123456/tracks');
    };

    const handleApplyAllTracks = (
        checked: boolean,
        artist: Pick<ArtistData, 'id' | 'name' | 'role'>
    ) => {
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
                setFormValues(values as Partial<ReleaseFormValuesData>);
            }, 300),
        [setFormValues]
    );

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        // Chỉ update khi có thay đổi thực sự
        if (JSON.stringify(watchedAllFields) !== JSON.stringify(formValues)) {
            debouncedSetFormValues(watchedAllFields as ReleaseDetailSchema);
        }

        // Cleanup function
        return () => {
            debouncedSetFormValues.cancel();
        };
    }, [watchedAllFields, formValues, debouncedSetFormValues]);
    return (
        <FormProvider {...formMethods}>
            <form
                className="px-4 pt-4"
                onSubmit={handleSubmit(handleNext, (err) =>
                    console.log('❌ Errors:', err)
                )}
            >
                <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="col-span-2 flex flex-col">
                            <LabelForm
                                htmlFor="releaseType"
                                required
                                label="Thể loại phát hành"
                            />
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
                            <ErrorText
                                isError={!!errors.releaseType}
                                message={errors.releaseType?.message}
                            />
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
                        <div>
                            <LabelForm
                                htmlFor="version"
                                label={messages('releases.version')}
                            />
                            <Controller
                                control={control}
                                name="version"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="version"
                                            {...field}
                                            allowClear
                                            status={
                                                errors.version
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.version}
                                message={errors.version?.message}
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <LabelForm
                                        htmlFor="isMoreThan4Artists"
                                        required
                                        label="Có nhiều hơn 4 nghệ sĩ hay không?"
                                    />
                                    <Controller
                                        control={control}
                                        name="isMoreThan4Artists"
                                        render={({ field }) => (
                                            <div className="pb-2 pt-1">
                                                <Radio.Group {...field}>
                                                    <Radio value={false}>
                                                        Không
                                                    </Radio>
                                                    <Radio value={true}>
                                                        {`Có (Tên hiển thị sẽ là "Nhiều nghệ sĩ")`}
                                                    </Radio>
                                                </Radio.Group>
                                            </div>
                                        )}
                                    />
                                    <ErrorText
                                        isError={!!errors.isMoreThan4Artists}
                                        message={
                                            errors.isMoreThan4Artists?.message
                                        }
                                    />
                                </div>
                                {!isMoreThan4Artists && (
                                    <div className="pt-5">
                                        <Button
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST
                                                )
                                            }
                                        >
                                            Thêm nghệ sĩ chính
                                        </Button>
                                        <ErrorText
                                            isError={
                                                errors.artists?.length === 0
                                            }
                                            message={errors.artists?.message}
                                        />
                                    </div>
                                )}
                            </div>

                            {!isMoreThan4Artists && (
                                <div className="grid grid-cols-2 gap-4">
                                    {artists.map((artist, index) => (
                                        <ArtistCard
                                            key={index}
                                            index={index}
                                            data={artist}
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST,
                                                    artist
                                                )
                                            }
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

                        <div>
                            <LabelForm
                                htmlFor="genres"
                                required
                                label={messages('common.genres')}
                            />
                            <Controller
                                control={control}
                                name="genres"
                                render={({ field }) => (
                                    <div>
                                        <GenresSelect
                                            className="w-full"
                                            id="genres"
                                            {...field}
                                            status={
                                                errors.genres
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
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
                                control={control}
                                name="subGenres"
                                render={({ field }) => (
                                    <div>
                                        <GenresSelect
                                            className="w-full"
                                            id="subGenres"
                                            {...field}
                                            status={
                                                errors.subGenres
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.subGenres}
                                message={errors.subGenres?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="metaDataLanguage"
                                required
                                label={`${messages('common.language')} metadata`}
                            />
                            <Controller
                                control={control}
                                name="metaDataLanguage"
                                render={({ field }) => (
                                    <div>
                                        <Select
                                            className="w-full"
                                            id="metaDataLanguage"
                                            {...field}
                                            options={languageList}
                                            status={
                                                errors.metaDataLanguage
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.metaDataLanguage}
                                message={errors.metaDataLanguage?.message}
                            />
                        </div>

                        <div>
                            <LabelForm htmlFor="label" label="Label" />
                            <Controller
                                control={control}
                                name="label"
                                render={({ field }) => (
                                    <div>
                                        <LabelSelect
                                            className="w-full"
                                            id="label"
                                            {...field}
                                            status={
                                                errors.label
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.label}
                                message={errors.label?.message}
                            />
                        </div>

                        <div>
                            <LabelForm htmlFor="upc" label="UPC/EAN/JAN" />
                            <Controller
                                control={control}
                                name="upc"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="upc"
                                            {...field}
                                            allowClear
                                            status={
                                                errors.upc ? 'error' : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.upc}
                                message={errors.upc?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="catalogId"
                                label="ID category"
                            />
                            <Controller
                                control={control}
                                name="catalogId"
                                render={({ field }) => (
                                    <div>
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
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.catalogId}
                                message={errors.catalogId?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="cLineYear"
                                required
                                label="C Line year"
                            />
                            <Controller
                                control={control}
                                name="cLineYear"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="cLineYear"
                                            {...field}
                                            addonBefore={
                                                <Select
                                                    defaultValue={'2026'}
                                                    options={yearList}
                                                />
                                            }
                                            status={
                                                errors.cLineYear
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.cLineYear}
                                message={errors.cLineYear?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="pLineYear"
                                required
                                label="P Line year"
                            />
                            <Controller
                                control={control}
                                name="pLineYear"
                                render={({ field }) => (
                                    <div>
                                        <Input
                                            id="pLineYear"
                                            {...field}
                                            addonBefore={
                                                <Select
                                                    defaultValue={'2026'}
                                                    options={yearList}
                                                />
                                            }
                                            status={
                                                errors.pLineYear
                                                    ? 'error'
                                                    : undefined
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <ErrorText
                                isError={!!errors.pLineYear}
                                message={errors.pLineYear?.message}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-end">
                    <Button htmlType="submit" type="primary" className="my-8">
                        {messages('common.next')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
