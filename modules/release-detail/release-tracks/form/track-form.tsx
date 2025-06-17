import { LabelForm } from '@/components/ui/label/labelForm';
import ErrorText from '@/components/ui/text/error-text';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { languageList } from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import { ArtistData } from '@/modules/artist/types';
import { TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import ArtistCard from '../../release-detail-form/artist-card';

export const releaseTrackSchema = z.object({
    trackName: z.string().nonempty('Track name is required'),
    isrc: z.string().optional(),
    source: z.string().nonempty('Source is required'),
    languageTrack: z.string().nonempty('Language is required'),
    isAddArtistsFromRelease: z.boolean(),
    artists: z.array(
        z.object({
            id: z.string(),
            name: z.string().nonempty('Artist name is required'),
            role: z.string().nonempty('Artist role is required'),
            // artistId: z.string().optional(),
            // thumbnail: z.string().optional(),
            // trackCount: z.number().optional(),
            // createdAt: z.date().optional(),
        })
    ),
});

type ReleaseTrackSchema = z.infer<typeof releaseTrackSchema>;

type Props = {
    trackData: TrackData;
};

export default function TracksForm({ trackData }: Props) {
    const messages = useTranslations();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const openModal = useModalStore((state) => state.openModal);
    const thisTrackData = formValues?.tracks?.find(
        (track: TrackData) => track.id === trackData.id
    );

    const formMethods = useForm<ReleaseTrackSchema>({
        defaultValues: {
            trackName: trackData.title,
            artists: trackData.artists,
            isAddArtistsFromRelease: false,
            source: thisTrackData?.source,
            languageTrack: thisTrackData?.languageTrack,
        },
        resolver: zodResolver(releaseTrackSchema),
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
                    Tác phẩm gốc{' '}
                    <IconInfoTooltip title="Tác phẩm gốc là tác phẩm được tạo ra đầu tiên, không phải bất kỳ bản cover hoặc remix nào." />
                </span>
            ),
            value: 'original',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản cover{' '}
                    <IconInfoTooltip title="Bản cover là bản nhạc được cover lại từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'cover',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản remix{' '}
                    <IconInfoTooltip title="Bản remix là bản nhạc được tạo ra từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'remix',
        },
    ];

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        const updatedFormValues = {
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) =>
                track.id === trackData.id
                    ? {
                          ...track,
                          ...watchedAllFields,
                          artists: watchedAllFields.artists as ArtistData[],
                      }
                    : track
            ),
        };

        setFormValues(updatedFormValues);
    }, [watchedAllFields]);

    useEffect(() => {
        trigger();
        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) =>
                track.id === trackData.id
                    ? {
                          ...track,
                          trackName: trackData.title,
                          artists: trackData.artists,
                          isAddArtistsFromRelease: false,
                          genres: trackData.genres,
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
                        label="Tên bài hát"
                    />
                    <Controller
                        control={control}
                        name="trackName"
                        render={({ field }) => (
                            <Input
                                id="trackName"
                                {...field}
                                allowClear
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
                    <LabelForm htmlFor="isrc" label="ISRC" />
                    <Controller
                        control={control}
                        name="isrc"
                        render={({ field }) => (
                            <Input
                                id="isrc"
                                {...field}
                                allowClear
                                status={errors.isrc ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.isrc}
                        message={errors.isrc?.message}
                    />
                </div>

                <div>
                    <LabelForm htmlFor="source" required label="Nguồn gốc" />
                    <Controller
                        control={control}
                        name="source"
                        render={({ field }) => (
                            <Select
                                id="source"
                                {...field}
                                options={originalSourceList}
                                allowClear
                                className="w-full"
                                status={errors.source ? 'error' : undefined}
                            />
                        )}
                    />
                    <ErrorText
                        isError={!!errors.source}
                        message={errors.source?.message}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="languageTrack"
                        required
                        label="Ngôn ngữ bài hát"
                    />
                    <Controller
                        control={control}
                        name="languageTrack"
                        render={({ field }) => (
                            <Select
                                id="languageTrack"
                                {...field}
                                options={languageList}
                                allowClear
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
                        <Button
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST,
                                    trackData
                                )
                            }
                            shape="round"
                            className="mb-4"
                        >
                            Thêm nghệ sĩ
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            {trackData.artists.map(
                                (artist: any, index: number) => (
                                    <ArtistCard
                                        key={index}
                                        data={artist}
                                        onDelete={() =>
                                            openModal(
                                                TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST,
                                                {
                                                    trackData,
                                                    artist,
                                                }
                                            )
                                        }
                                        onClick={() =>
                                            openModal(
                                                TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST,
                                                artist
                                            )
                                        }
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
