import { LabelForm } from '@/components/ui/label/labelForm';
import ErrorText from '@/components/ui/text/error-text';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Switch } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from '../../release-detail-form/artist-card';

export const trackAndArtistSchema = (messages: any) =>
    releaseTrackSchema(messages).pick({
        title: true,
        version: true,
        trackArtists: true,
        copyArtistsFromRelease: true,
    });

export type TrackAndArtistSchema = z.infer<
    ReturnType<typeof trackAndArtistSchema>
>;

type Props = {
    trackData: TrackData;
    index: number;
};

export default function TracksForm({ trackData, index }: Props) {
    const messages = useTranslations();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);

    const formMethods = useForm<TrackAndArtistSchema>({
        defaultValues: {
            ...trackData,
        },
        resolver: zodResolver(trackAndArtistSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        reset,
        setValue,
    } = formMethods;

    const { updateTrackDraft } = useUpdateTrackDraft();
    const debouncedUpdateTrackDraft = useCallback(
        debounce(async (data: any, fieldName?: string) => {
            if (fieldName) {
                const isValid = await trigger(
                    fieldName as keyof TrackAndArtistSchema
                );
                if (!isValid) return;
            }
            if (!formValues.id) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id: trackData.id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 500),
        [formValues.id]
    );

    const isAddArtistsFromRelease = watch('copyArtistsFromRelease');

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) => {
                if (track.id === trackData.id) {
                    const { ...restFields } = watchedAllFields;

                    return {
                        ...track,
                        ...restFields,
                        title: restFields.title ?? track.title,
                    } as TrackData;
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

    useEffect(() => {
        reset({ ...trackData });
    }, [trackData, reset]);

    return (
        <FormProvider {...formMethods}>
            <form className="grid grid-cols-2 gap-4">
                <div>
                    <LabelForm
                        htmlFor="title"
                        required
                        label={messages('tracks.name')}
                    />
                    <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <Input
                                id={`tracks.${index}.title`}
                                {...field}
                                allowClear
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    debouncedUpdateTrackDraft(
                                        {
                                            title: value,
                                        },
                                        'title'
                                    );
                                }}
                                status={errors.title ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.title}
                        message={errors.title?.message}
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
                                value={field.value ?? ''}
                                allowClear
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    debouncedUpdateTrackDraft(
                                        {
                                            version: value,
                                        },
                                        'version'
                                    );
                                }}
                                status={errors.version ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.version}
                        message={errors.version?.message}
                    />
                </div>

                <div className="col-span-2">
                    <LabelForm
                        htmlFor="copyArtistsFromRelease"
                        label="Thêm tất cả nghệ sĩ từ phát hành ?"
                    />
                    <Controller
                        control={control}
                        name="copyArtistsFromRelease"
                        render={({ field }) => {
                            return (
                                <Switch
                                    {...field}
                                    checked={!!field.value}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdateTrackDraft({
                                            copyArtistsFromRelease: e,
                                        });
                                    }}
                                />
                            );
                        }}
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
