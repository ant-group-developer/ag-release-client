import FormItem from '@/components/ui/react-hook-form/form-item';
import ErrorText from '@/components/ui/text/error-text';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { ReleaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { Button, Input, Switch, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ArtistCard from '../../../release-detail-form/artist-card';
const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function TrackAndArtistSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    // hook - state
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { action } = useGetReleaseDetailRoute();
    const [isOpenArtistForm, setOpenArtistForm] = useState(false);
    const {
        control,
        formState: { errors },
        watch,
        trigger,
        setValue,
    } = useFormContext<ReleaseTrackSchema>();

    // router
    const params = useParams();
    const router = useRouter();

    const isAddArtistsFromRelease = watch('copyArtistsFromRelease');
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;

    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            const isValid = await trigger(
                fieldName as keyof ReleaseTrackSchema
            );
            if (!isValid) return;
        }
        debouncedUpdateTrackDraft(data);
    };

    return (
        <>
            <CollapseItem
                defaultActiveKey={['track-and-artist']}
                items={[
                    {
                        key: 'track-and-artist',
                        label: (
                            <span className="text-base font-semibold">
                                {messages('track.label')} &{' '}
                                {messages('artist.label')}
                            </span>
                        ),
                        children: (
                            <div>
                                <div className="grid grid-cols-4 items-center gap-5">
                                    <div className="col-span-2">
                                        <FormItem
                                            label={messages('track.name')}
                                            ErrorMessage={errors.title?.message}
                                            required
                                            name="title"
                                        >
                                            <Controller
                                                control={control}
                                                name="title"
                                                render={({ field }) => (
                                                    <Input
                                                        id={`tracks.${index}.title`}
                                                        {...field}
                                                        allowClear
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            field.onChange(
                                                                value
                                                            );
                                                            updateTrackDraft(
                                                                {
                                                                    title: value,
                                                                },
                                                                'title'
                                                            );
                                                        }}
                                                        status={
                                                            errors.title
                                                                ? 'error'
                                                                : undefined
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="col-span-2">
                                        <FormItem
                                            label={messages('release.version')}
                                            ErrorMessage={
                                                errors.version?.message
                                            }
                                            name="version"
                                        >
                                            <Controller
                                                control={control}
                                                name="version"
                                                render={({ field }) => (
                                                    <Input
                                                        id={`tracks.${index}.version`}
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        allowClear
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            field.onChange(
                                                                value
                                                            );
                                                            updateTrackDraft(
                                                                {
                                                                    version:
                                                                        value,
                                                                },
                                                                'version'
                                                            );
                                                        }}
                                                        status={
                                                            errors.version
                                                                ? 'error'
                                                                : undefined
                                                        }
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="col-span-2">
                                        <FormItem
                                            label={`${messages('track.addAllArtistFromRelease')} ?`}
                                            ErrorMessage={
                                                errors.copyArtistsFromRelease
                                                    ?.message
                                            }
                                            name="copyArtistsFromRelease"
                                        >
                                            <Controller
                                                control={control}
                                                name="copyArtistsFromRelease"
                                                render={({ field }) => (
                                                    <Switch
                                                        {...field}
                                                        checked={!!field.value}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            debouncedUpdateTrackDraft(
                                                                {
                                                                    copyArtistsFromRelease:
                                                                        e,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                    </div>

                                    {!isAddArtistsFromRelease && (
                                        <div className="col-span-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                {trackData?.trackArtists?.map(
                                                    (
                                                        item: TrackArtistData,
                                                        index: number
                                                    ) => (
                                                        <ArtistCard
                                                            key={item.id}
                                                            data={{
                                                                artist: item.artist,
                                                                artistRole:
                                                                    item.artistRole,
                                                            }}
                                                            onDelete={() =>
                                                                openModal(
                                                                    TYPE_MODAL_TRACK_ARTIST.DELETE,
                                                                    item
                                                                )
                                                            }
                                                            onClick={() => {
                                                                // openModal(
                                                                //     TYPE_MODAL_TRACK_ARTIST.UPDATE,
                                                                //     item
                                                                // );
                                                                setOpenArtistForm(
                                                                    true
                                                                );
                                                            }}
                                                            index={index}
                                                            disabled={
                                                                isReadMode
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Button
                                                    id={`tracks.${index}.trackArtists`}
                                                    onClick={() =>
                                                        setOpenArtistForm(true)
                                                    }
                                                    className="mt-4"
                                                    danger={
                                                        errors.trackArtists
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    {messages('artist.add')}
                                                </Button>
                                                <ErrorText
                                                    isError={
                                                        !!errors.trackArtists
                                                    }
                                                    message={
                                                        errors.trackArtists
                                                            ?.message
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
            <TrackArtistModal
                open={isOpenArtistForm}
                onCancel={() => setOpenArtistForm(false)}
            />
        </>
    );
}
