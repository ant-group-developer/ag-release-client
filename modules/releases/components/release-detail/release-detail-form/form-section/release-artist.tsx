import FormItem from '@/components/ui/react-hook-form/form-item';
import ErrorText from '@/components/ui/text/error-text';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { UpdateVariables } from '@/types/api';
import { Button, Radio } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ReleaseDetailSchema } from '..';
import ArtistCard from '../artist-card';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
};

export default function ReleaseArtistSection({ debouncedUpdate }: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateReleaseArtist } = useUpdateReleaseArtist();
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );

    // router - params
    const params = useParams();
    const isReadMode = useMemo(
        () => releaseDetailAction !== RELEASE_DETAIL_ACTION.EDIT,
        [releaseDetailAction]
    );

    // variables
    const isCreateReleasePage = params['action'] === 'create';
    const isVariousArtist = watch('isVariousArtist');
    const releaseArtist = formValues.releaseArtists || [];

    // func
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

    return (
        <CollapseItem
            defaultActiveKey={['Release Artists']}
            items={[
                {
                    key: 'Release Artists',
                    label: (
                        <Title level={5} className="!mb-0">
                            {' '}
                            {messages('releaseArtist.label')}{' '}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-3 items-center gap-5">
                            <div className="col-span-3">
                                <FormItem
                                    name="isVariousArtist"
                                    label={messages(
                                        'releases.isMoreThan4Artists'
                                    )}
                                    required
                                    ErrorMessage={''}
                                    tooltipInfor={messages(
                                        'tooltipForm.isMoreThan4Artists'
                                    )}
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
                                                        isCreateReleasePage ||
                                                        isReadMode
                                                    }
                                                >
                                                    <Radio value={false}>
                                                        {messages('common.no')}
                                                    </Radio>
                                                    <Radio value={true}>
                                                        {messages('common.yes')}{' '}
                                                        {` (${messages('artist.descriptionVariantArtists')})`}
                                                    </Radio>
                                                </Radio.Group>
                                            </div>
                                        )}
                                    />
                                </FormItem>
                            </div>
                            {!isVariousArtist && (
                                <div className="col-span-3">
                                    <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-4">
                                        {releaseArtist.map(
                                            (
                                                releaseArtist: ReleaseArtist,
                                                index: number
                                            ) => (
                                                <ArtistCard
                                                    key={index}
                                                    index={index}
                                                    disabled={
                                                        isCreateReleasePage ||
                                                        isReadMode
                                                    }
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
                                    <div className="relative">
                                        <Button
                                            id={'releaseArtists'}
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST
                                                )
                                            }
                                            disabled={
                                                isCreateReleasePage ||
                                                isReadMode
                                            }
                                            danger={!!errors.releaseArtists}
                                        >
                                            {messages('artist.add')}
                                        </Button>
                                        <ErrorText
                                            isError={!!errors.releaseArtists}
                                            message={
                                                errors.releaseArtists?.message
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
