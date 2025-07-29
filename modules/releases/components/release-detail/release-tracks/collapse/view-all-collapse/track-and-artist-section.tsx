import FormItem from '@/components/ui/react-hook-form/form-item';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import {
    releaseTrackSchema,
    ReleaseTrackSchema,
} from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Switch, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ArtistCard from '../../../release-detail-form/artist-card';
const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any, fieldName?: string) => void;
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

    const formMethods = useForm<ReleaseTrackSchema>({
        defaultValues: {
            title: trackData?.title,
            version: trackData?.version,
            trackArtists: trackData?.trackArtists,
            copyArtistsFromRelease: trackData?.copyArtistsFromRelease,
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
        reset,
        setValue,
    } = formMethods;

    // router
    const params = useParams();
    const router = useRouter();

    const isAddArtistsFromRelease = watch('copyArtistsFromRelease');

    useEffect(() => {
        setValue('title', trackData?.title);
    }, [trackData]);

    return (
        <CollapseItem
            defaultActiveKey={['track-and-artist']}
            items={[
                {
                    key: 'track-and-artist',
                    label: (
                        <Title level={5} className="!mb-0">
                            {messages('tracks.label')} &{' '}
                            {messages('artist.label')}
                        </Title>
                    ),
                    children: (
                        <div>
                            <div className="grid grid-cols-4 items-center gap-5">
                                <div className="col-span-2">
                                    <FormItem
                                        label={messages('tracks.name')}
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
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdateTrackDraft(
                                                            { title: value },
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
                                        label={messages('releases.version')}
                                        ErrorMessage={errors.version?.message}
                                        name="version"
                                    >
                                        <Controller
                                            control={control}
                                            name="version"
                                            render={({ field }) => (
                                                <Input
                                                    id={`tracks.${index}.version`}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    allowClear
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdateTrackDraft(
                                                            { version: value },
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
                                        label={`${messages('tracks.addAllArtistFromRelease')} ?`}
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
                                                        key={index}
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
                                            id={`tracks.${index}.trackArtists`}
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_TRACK_ARTIST.ADD,
                                                    trackData
                                                )
                                            }
                                            className="mt-4"
                                        >
                                            {messages('artist.add')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
