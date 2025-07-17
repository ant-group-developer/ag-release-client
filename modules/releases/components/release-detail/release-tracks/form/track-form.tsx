import { LabelForm } from '@/components/ui/label/labelForm';
import LanguageSelect from '@/components/ui/select/language-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import ErrorText from '@/components/ui/text/error-text';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import {
    releaseTrackSchema,
    ReleaseTrackSchema,
} from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import ArtistCard from '../../release-detail-form/artist-card';

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
};

export default function TracksForm({ trackData, updateTrackDraft }: Props) {
    const messages = useTranslations();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);

    const formMethods = useForm<ReleaseTrackSchema>({
        defaultValues: {
            ...trackData,
            audioFile: trackData.audioFile
                ? {
                      ...trackData.audioFile,
                      preview: trackData.audioFile.preview ?? undefined,
                  }
                : undefined,
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

    const isAddArtistsFromRelease = watch('copyArtistsFromRelease');

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) => {
                if (track.id === trackData.id) {
                    const { trackLanguage, ...restFields } = watchedAllFields;

                    return {
                        ...track,
                        ...restFields,
                        title: restFields.title ?? track.title,
                        isSensitiveContent:
                            restFields.isSensitiveContent ?? false,
                        trackLanguage: {
                            ...track.trackLanguage,
                            audioLanguageId: trackLanguage?.audioLanguageId,
                        },
                    } as TrackData;
                }
                return track;
            }),
        });
    }, [watchedAllFields]);

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
                                id="title"
                                {...field}
                                allowClear
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    updateTrackDraft({
                                        title: value,
                                    });
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
                                    updateTrackDraft({
                                        version: value,
                                    });
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

                <div>
                    <LabelForm
                        htmlFor="trackOriginTypeId"
                        required
                        label={`${messages('trackOrigin.label')}`}
                    />
                    <Controller
                        control={control}
                        name="trackOriginTypeId"
                        render={({ field }) => (
                            <OriginalTypeSelect
                                id="trackOriginTypeId"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        trackOriginTypeId: e,
                                    });
                                }}
                                className="w-full"
                                status={
                                    errors.trackOriginTypeId
                                        ? 'error'
                                        : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.trackOriginTypeId}
                        message={errors.trackOriginTypeId?.message}
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
                        name="trackLanguage.audioLanguageId"
                        render={({ field }) => (
                            <LanguageSelect
                                id="languageTrack"
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        trackLanguage: {
                                            ...formMethods.getValues(
                                                'trackLanguage'
                                            ),
                                            audioLanguageId: e,
                                        },
                                    });
                                }}
                                showSearch
                                className="w-full"
                                status={
                                    errors.trackLanguage?.audioLanguageId
                                        ? 'error'
                                        : undefined
                                }
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.trackLanguage?.audioLanguageId}
                        message={errors.trackLanguage?.audioLanguageId?.message}
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
                        render={({ field }) => (
                            <Switch
                                {...field}
                                checked={!!field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    updateTrackDraft({
                                        copyArtistsFromRelease: e,
                                    });
                                }}
                            />
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
