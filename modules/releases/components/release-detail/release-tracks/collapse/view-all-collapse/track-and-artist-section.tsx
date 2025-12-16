import AppFormItem from '@/components/ui/antd-form/form-Item';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { TrackData } from '@/modules/tracks/types';
import { Button, Form, Input, Switch, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
    const form = Form.useFormInstance();
    // router
    // const params = useParams();
    // const router = useRouter();

    const isAddArtistsFromRelease = useWatch('copyArtistsFromRelease', form);
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;

    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            try {
                await form.validateFields([fieldName]);
            } catch {
                return;
            }
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
                                        <AppFormItem
                                            label={messages('track.name')}
                                            required
                                            name="title"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        messages(
                                                            'validation.input'
                                                        ),
                                                },
                                            ]}
                                        >
                                            <Input
                                                id={`tracks.${index}.title`}
                                                allowClear
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    updateTrackDraft(
                                                        {
                                                            title: value,
                                                        },
                                                        'title'
                                                    );
                                                }}
                                            />
                                        </AppFormItem>
                                    </div>
                                    <div className="col-span-2">
                                        <AppFormItem
                                            label={messages('release.version')}
                                            name="version"
                                        >
                                            <Input
                                                id={`tracks.${index}.version`}
                                                allowClear
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    updateTrackDraft(
                                                        {
                                                            version: value,
                                                        },
                                                        'version'
                                                    );
                                                }}
                                            />
                                        </AppFormItem>
                                    </div>
                                    <div className="col-span-2">
                                        <AppFormItem
                                            label={`${messages('track.addAllArtistFromRelease')} ?`}
                                            name="copyArtistsFromRelease"
                                        >
                                            <Switch
                                                onChange={(e) => {
                                                    debouncedUpdateTrackDraft({
                                                        copyArtistsFromRelease:
                                                            e,
                                                    });
                                                }}
                                            />
                                        </AppFormItem>
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
                                                    // danger={
                                                    //     errors.trackArtists
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                >
                                                    {messages('artist.add')}
                                                </Button>
                                                {/* <ErrorText
                                                    isError={
                                                        !!errors.trackArtists
                                                    }
                                                    message={
                                                        errors.trackArtists
                                                            ?.message
                                                    }
                                                /> */}
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
