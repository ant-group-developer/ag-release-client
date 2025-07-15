import { LabelForm } from '@/components/ui/label/labelForm';
import LanguageSelect from '@/components/ui/select/language-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import ErrorText from '@/components/ui/text/error-text';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import useModalStore from '@/hooks/use-modal';
import { artistSchema } from '@/modules/artist/schema';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from '../../release-detail-form/artist-card';

export const releaseTrackSchema = (messages: any) =>
    z.object({
        trackName: z.string().nonempty(messages('validation.input')),
        version: z.string().optional(),
        isrc: z.string().optional(),
        trackOrigin: z.string().nonempty(messages('validation.input')),
        languageTrack: z.string().nonempty(messages('validation.input')),
        isAddArtistsFromRelease: z.boolean(),
        releaseArtists: z.array(artistSchema(messages)),
    });

type ReleaseTrackSchema = z.infer<ReturnType<typeof releaseTrackSchema>>;

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
};

export default function TracksForm({ trackData, updateTrackDraft }: Props) {
    const messages = useTranslations();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const formMethods = useForm<ReleaseTrackSchema>({
        defaultValues: {
            trackName: trackData.title ?? '',
            trackOrigin: trackData.originType,
            isrc: trackData.isrc ?? '',
            version: trackData.version ?? '',
            languageTrack: trackData.trackLanguage?.audioLanguageId,
        },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        setValue,
    } = formMethods;

    const isAddArtistsFromRelease = watch('isAddArtistsFromRelease');

    const originalSourceList = [
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    {messages('tracks.original.label')}
                    <IconInfoTooltip
                        title={messages('tracks.original.tooltip')}
                    />
                </span>
            ),
            value: 'original',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    {messages('tracks.cover.label')}
                    <IconInfoTooltip title={messages('tracks.cover.tooltip')} />
                </span>
            ),
            value: 'cover',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    {messages('tracks.remix.label')}
                    <IconInfoTooltip title={messages('tracks.remix.label')} />
                </span>
            ),
            value: 'remix',
        },
    ];

    // useEffect(() => {
    //     const updatedFormValues = {
    //         ...formValues,
    //         tracks: formValues?.tracks?.map((track: TrackData) =>
    //             track.id === trackData.id
    //                 ? {
    //                       ...track,
    //                       ...watchedAllFields,
    //                       //   artists: watchedAllFields.artists as ArtistData[],
    //                   }
    //                 : track
    //         ),
    //     };

    //     // setFormValues(updatedFormValues);
    // }, [watchedAllFields]);

    useEffect(() => {
        trigger();
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) =>
                track.id === trackData.id
                    ? {
                          ...track,
                          trackName: trackData.title,
                          //   artists: trackData.artists,
                          isAddArtistsFromRelease: false,
                          //   genres: trackData.genres,
                      }
                    : track
            ),
        });
    }, []);

    return (
        <FormProvider {...formMethods}>
            <form className="grid grid-cols-2 gap-4">
                <div>
                    <LabelForm
                        htmlFor="trackName"
                        required
                        label={messages('tracks.name')}
                    />
                    <Controller
                        control={control}
                        name="trackName"
                        render={({ field }) => (
                            <Input
                                id="trackName"
                                {...field}
                                allowClear
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    updateTrackDraft({
                                        title: value,
                                    });
                                }}
                                status={errors.trackName ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.trackName}
                        message={errors.trackName?.message}
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
                            <Input
                                id="version"
                                {...field}
                                allowClear
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    updateTrackDraft({
                                        version: value,
                                    });
                                }}
                                status={errors.version ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.trackName}
                        message={errors.trackName?.message}
                    />
                </div>

                {/* <div>
                    <LabelForm htmlFor="isrc" label="ISRC" />
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
                                    debouncedUpdate({
                                        isrc: value,
                                    });
                                }}
                                allowClear
                                status={errors.isrc ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.isrc}
                        message={errors.isrc?.message}
                    />
                </div> */}

                <div>
                    <LabelForm
                        htmlFor="trackOrigin"
                        required
                        label={`${messages('tracks.original.label')}`}
                    />
                    <Controller
                        control={control}
                        name="trackOrigin"
                        render={({ field }) => (
                            <OriginalTypeSelect
                                id="trackOrigin"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        originType: e,
                                    });
                                }}
                                className="w-full"
                                status={
                                    errors.trackOrigin ? 'error' : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.trackOrigin}
                        message={errors.trackOrigin?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="languageTrack"
                        required
                        label={messages('tracks.language')}
                    />
                    <Controller
                        control={control}
                        name="languageTrack"
                        render={({ field }) => (
                            <LanguageSelect
                                id="languageTrack"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        trackLanguage: {
                                            audioLanguageId: e,
                                        },
                                    });
                                }}
                                showSearch
                                className="w-full"
                                status={
                                    errors.languageTrack ? 'error' : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.languageTrack}
                        message={errors.languageTrack?.message}
                    />
                </div>

                <div className="col-span-2">
                    <LabelForm
                        htmlFor="isAddArtistsFromRelease"
                        label="Thêm tất cả nghệ sĩ từ phát hành ?"
                    />
                    <Controller
                        control={control}
                        name="isAddArtistsFromRelease"
                        render={({ field }) => (
                            <Switch {...field} checked={field.value} />
                        )}
                    />
                </div>

                {!isAddArtistsFromRelease && (
                    <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            {trackData?.trackArtists?.map(
                                (item: TrackArtistData, index: number) => (
                                    <ArtistCard
                                        key={index}
                                        data={{
                                            artist: item.artist,
                                            artistRole: item.artistRole,
                                        }}
                                        onDelete={() =>
                                            openModal(
                                                TYPE_MODAL_TRACK_ARTIST.DELETE,
                                                item
                                            )
                                        }
                                        onClick={() => {
                                            openModal(
                                                TYPE_MODAL_TRACK_ARTIST.UPDATE,
                                                item
                                            );
                                        }}
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                        <Button
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_TRACK_ARTIST.ADD,
                                    trackData
                                )
                            }
                            shape="round"
                            className="mt-4"
                        >
                            {messages('artist.add')}
                        </Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
