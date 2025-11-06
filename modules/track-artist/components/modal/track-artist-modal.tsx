import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListArtistRole } from '@/modules/artist-role/hooks/use-get-list-artist-role';
import { ArtistRoleData } from '@/modules/artist-role/types';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ArtistProfilesList from '../../../artist/components/list/artist-profiles';
import { useCreateTrackArtist } from '../../hooks/use-create-track-artist';
import { useUpdateTrackArtist } from '../../hooks/use-update-track-artist';
import { TrackArtistData } from '../../types';
import {
    CreateTrackArtistPayload,
    UpdateTrackArtistPayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TrackArtistModal({ ...props }: Props) {
    const [form] = Form.useForm();
    const [showCreateArtist, setShowCreateArtist] = useState<boolean>(false);
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const watchArtistName = useWatch(['name'], form);
    const typeModal = useModalStore((state) => state.typeModal);
    const { active, deActive, isActive } = useActive();
    const formValues = useReleaseFormStore((state) => state.formValues);

    const isTrackArtistEditModal = typeModal === TYPE_MODAL_TRACK_ARTIST.UPDATE;
    const dataEdit = useModalStore((state) => state.dataEdit); // Nếu add artist thì dataEdit là TrackData, còn update thì là trackArtistData

    const trackData = formValues?.tracks?.find((item) => {
        if (isTrackArtistEditModal) {
            return item.id == dataEdit?.trackId;
        } else {
            return item.id == dataEdit.id;
        }
    });

    const { dspData } = useGetListDsp({});
    const { artistsRolesData } = useGetListArtistRole({});
    const { createTrackArtist } = useCreateTrackArtist();
    const { updateTrackArtist } = useUpdateTrackArtist();

    const mainArtist: ArtistRoleData = artistsRolesData.items.find(
        (item: ArtistRoleData) => item.code === MAIN_ARTIST_ROLE
    );

    const handleSubmit = async (values: any) => {
        active();
        if (!isTrackArtistEditModal) {
            const variables: CreateVariables<CreateTrackArtistPayload> = {
                payload: {
                    artistId: values.artistId,
                    artistRoleId: values.roleId ?? mainArtist.id,
                    trackId: dataEdit?.id,
                },
                onSuccess: () => {
                    closeModal();
                },
                onError: () => deActive(),
            };
            createTrackArtist(variables);
        } else {
            const variables: UpdateVariables<
                ReleaseArtist['id'],
                UpdateTrackArtistPayload
            > = {
                id: dataEdit.id,
                payload: {
                    artistId: values?.artistId,
                    artistRoleId: values.roleId,
                },
                onSuccess: () => deActive(),
                onError: () => deActive(),
            };
            updateTrackArtist(variables);
        }
    };

    // Handle disabled role that this artist already exists
    const watchArtistId = useWatch('artistId', form);
    const getExistingRoleIdsOfSelectedArtist = () => {
        return (
            trackData?.trackArtists
                ?.filter(
                    (item: TrackArtistData) => item.artist?.id === watchArtistId
                )
                .map(
                    (item: TrackArtistData) => item?.artistRole?.id as string
                ) || []
        );
    };
    const disabledRoleIds = getExistingRoleIdsOfSelectedArtist();
    const watchRoleId = useWatch('roleId', form);
    const getExistingArtistOfSelectedRole = () => {
        return (
            trackData?.trackArtists
                ?.filter(
                    (item: TrackArtistData) =>
                        item?.artistRole?.id === watchRoleId
                )
                .map((item: TrackArtistData) => item?.artist?.id as string) ||
            []
        );
    };
    const disabledArtistIds = getExistingArtistOfSelectedRole();

    useEffect(() => {
        if (isTrackArtistEditModal) {
            form.setFieldsValue({
                artistId: dataEdit?.artistId,
                roleId: dataEdit?.artistRoleId,
            });
        }
    }, [isTrackArtistEditModal, dataEdit, form]);

    return (
        <AppModal
            open
            title={
                isTrackArtistEditModal
                    ? messages('artist.update')
                    : messages('artist.add')
            }
            onCancel={closeModal}
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
                        disabledArtistIds={disabledArtistIds}
                        showSearch
                        placeholder={messages('artist.select')}
                        onCreateArtist={() => setShowCreateArtist(true)}
                    />
                </AppFormItem>

                {showCreateArtist && (
                    <ArtistFormModal
                        open
                        onCancel={() => setShowCreateArtist(false)}
                    />
                )}

                <AppFormItem
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
                    />
                </AppFormItem>

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
                <p className="text-xs text-gray-500">
                    * {messages('trackArtist.message.note')}.
                </p>
            </AppForm>

            {/* <LinkProfileArtist
                open={showLinkProfile}
                onClose={() => setShowLinkProfile(false)}
            /> */}
        </AppModal>
    );
}
