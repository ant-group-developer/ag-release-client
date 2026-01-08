import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { TrackData } from '@/modules/releases/types';
import { useCreateTrackArtist } from '@/modules/track-artist/hooks/use-create-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import {
    CreateTrackArtistPayload,
    UpdateTrackArtistPayload,
} from '@/modules/track-artist/types/payload';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ArtistProfilesList from '../../../artist/components/list/artist-profiles';
import { useUpdateTrackArtist } from '../../hooks/use-update-track-contributor';

type Props = Omit<AppModalProps, 'children'> & {
    trackData?: TrackData;
    trackArtistData?: TrackArtistData;
    setCloseModal?: () => void;
};

export default function TrackArtistModal({
    trackData,
    trackArtistData,
    setCloseModal,
    ...props
}: Props) {
    const [form] = Form.useForm();
    const [showCreateArtist, setShowCreateArtist] = useState<boolean>(false);
    const messages = useTranslations();
    const watchArtistName = useWatch(['name'], form);
    const { active, deActive, isActive } = useActive();
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    // const formValues = useReleaseFormStore((state) => state.formValues);

    const isTrackArtistEditModal = !!trackArtistData?.id;

    // const trackData = formValues?.tracks?.find((item) => {
    //     if (isTrackArtistEditModal) {
    //         return item.id == dataEdit?.trackId;
    //     } else {
    //         return item.id == dataEdit.id;
    //     }
    // });

    const { dspData } = useGetListDsp({});
    // const { artistsRolesData } = useGetListArtistRole({});
    const { createTrackArtist } = useCreateTrackArtist();
    const { updateTrackArtist } = useUpdateTrackArtist();

    const handleSubmit = async (values: any) => {
        active();
        if (!isTrackArtistEditModal) {
            const variables: CreateVariables<CreateTrackArtistPayload> = {
                payload: {
                    artistId: values.artistId,
                    // artistRoleId: values.roleId,
                    trackId: trackData?.id ?? dataEdit?.id,
                },
                onSuccess: () => {
                    setCloseModal?.();
                    deActive();
                    form.resetFields();
                },
                onError: () => deActive(),
            };
            createTrackArtist(variables);
        } else {
            const variables: UpdateVariables<
                ReleaseArtist['id'],
                UpdateTrackArtistPayload
            > = {
                id: trackArtistData?.id as string,
                payload: {
                    artistId: values?.artistId,
                    // artistRoleId: values.roleId,
                },
                onSuccess: () => {
                    setCloseModal?.();
                    deActive();
                },
                onError: () => deActive(),
            };
            updateTrackArtist(variables);
        }
    };

    // Handle disabled role that this artist already exists
    const watchArtistId = useWatch('artistId', form);
    // const getExistingRoleIdsOfSelectedArtist = () => {
    //     return (
    //         trackData?.trackArtists
    //             ?.filter(
    //                 (item: TrackArtistData) => item.artist?.id === watchArtistId
    //             )
    //             .map(
    //                 (item: TrackArtistData) => item?.artistRole?.id as string
    //             ) || []
    //     );
    // };
    // const disabledRoleIds = getExistingRoleIdsOfSelectedArtist();
    // const watchRoleId = useWatch('roleId', form);
    // const getExistingArtistOfSelectedRole = () => {
    //     return (
    //         trackData?.trackArtists
    //             ?.filter(
    //                 (item: TrackArtistData) =>
    //                     item?.artistRole?.id === watchRoleId
    //             )
    //             .map((item: TrackArtistData) => item?.artist?.id as string) ||
    //         []
    //     );
    // };
    // const disabledArtistIds = getExistingArtistOfSelectedRole();

    useEffect(() => {
        if (trackArtistData?.id) {
            form.setFieldsValue({
                artistId: trackArtistData?.artistId,
                // roleId: trackArtistData?.artistRoleId, - on removing
            });
        } else {
            form.resetFields();
        }
    }, [isTrackArtistEditModal, trackArtistData, form]);

    return (
        <AppModal
            open
            title={
                isTrackArtistEditModal
                    ? messages('artist.update')
                    : messages('artist.add')
            }
            onOk={form.submit}
            // confirmLoading={isActive}
            loading={isActive}
            {...props}
        >
            <AppForm
                form={form}
                onFinish={(values) => handleSubmit(values)}
                layout="vertical"
                showSubmit={false}
                disabled={isActive}
            >
                <AppFormItem
                    name="artistId"
                    label={messages('artist.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <ArtistSelect
                        // disabledArtistIds={disabledArtistIds}
                        showSearch
                        placeholder={messages('artist.select')}
                        artistId={watchArtistId}
                        allowClear
                    />
                </AppFormItem>

                {showCreateArtist && (
                    <ArtistFormModal
                        open
                        onCancel={() => setShowCreateArtist(false)}
                    />
                )}

                {/* <AppFormItem
                    name="roleId"
                    label={messages('common.role')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <RoleArtistSelect
                        disabledRoleIds={disabledRoleIds}
                        placeholder={messages('common.role')}
                        allowClear
                    />
                </AppFormItem> */}

                {watchArtistName && (
                    <div>
                        <p className="mb-2 text-sm font-bold">
                            {messages('artist.profiles')}
                        </p>
                        <ArtistProfilesList
                            list={dspData?.items.map((item: DspData) => ({
                                icon: item.picture ?? '',
                                name: item.name,
                                id: item.id,
                            }))}
                            // linkedPlatforms={fakeLinkedPlatforms}
                        />
                    </div>
                )}
                {/* <p className="text-xs text-gray-500">
                    * {messages('trackArtist.message.note')}.
                </p> */}
            </AppForm>

            {/* <LinkProfileArtist
                open={showLinkProfile}
                onClose={() => setShowLinkProfile(false)}
            /> */}
        </AppModal>
    );
}
