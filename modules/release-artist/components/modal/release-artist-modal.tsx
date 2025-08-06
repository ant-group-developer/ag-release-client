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
import { useCreateReleaseArtist } from '@/modules/release-artist/hooks/use-create-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import {
    CreateReleaseArtistPayload,
    UpdateReleaseArtistPayload,
} from '@/modules/release-artist/types/payload';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Checkbox, Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ArtistProfilesList from '../../../artist/components/list/artist-profiles';
import { useUpdateReleaseArtist } from '../../hooks/use-update-release-artist';

type Props = Omit<AppModalProps, 'children'> & {
    isSetMainArtist: boolean;
};

// Dữ liệu mẫu cho các platform đã liên kết
const fakeLinkedPlatforms = [
    { id: '2', name: 'Apple Music' },
    { id: '5', name: 'Youtube Music' },
];

export default function ReleaseArtistModal({ isSetMainArtist }: Props) {
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const [showCreateArtistModal, setShowCreateArtistModal] = useState(false);
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const watchArtistName = useWatch(['name'], form);
    const typeModal = useModalStore((state) => state.typeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const isArtistEditModal =
        typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST;
    const dataEdit = useModalStore((state) => state.dataEdit as ReleaseArtist);

    const { dspData } = useGetListDsp({});
    const { createReleaseArtist } = useCreateReleaseArtist();
    const { artistsRolesData } = useGetListArtistRole({});
    const { updateReleaseArtist } = useUpdateReleaseArtist();

    const mainArtist: ArtistRoleData = artistsRolesData.items.find(
        (item: ArtistRoleData) => item.value === MAIN_ARTIST_ROLE
    );

    const watchArtistId = useWatch('artistId', form);
    // Handle disabled role that this artist already exists
    const getExistingRoleIdsOfSelectedArtist = () => {
        return (
            formValues?.releaseArtists
                ?.filter(
                    (item: ReleaseArtist) => item.artist?.id === watchArtistId
                )
                .map((item: ReleaseArtist) => item?.artistRole?.id as string) ||
            []
        );
    };
    const disabledRoleIds = getExistingRoleIdsOfSelectedArtist();

    const watchRoleId = useWatch('roleId', form);
    const getExistingArtistOfSelectedRole = () => {
        return (
            formValues?.releaseArtists
                ?.filter(
                    (item: ReleaseArtist) =>
                        item?.artistRole?.id === watchRoleId
                )
                .map((item: ReleaseArtist) => item?.artist?.id as string) || []
        );
    };
    const disabledArtistIds = getExistingArtistOfSelectedRole();

    const handleSubmit = async (values: any) => {
        active();
        try {
            if (!isArtistEditModal) {
                const variables: CreateVariables<CreateReleaseArtistPayload> = {
                    payload: {
                        artistId: values.artistId,
                        artistRoleId: values.roleId ?? mainArtist.id,
                        releaseId: formValues.id as string,
                        addArtistToTracks: !!values?.addArtistToTracks,
                    },
                    onSuccess: () => {
                        closeModal();
                    },
                };
                createReleaseArtist(variables);
            } else {
                const variables: UpdateVariables<
                    ReleaseArtist['id'],
                    UpdateReleaseArtistPayload
                > = {
                    id: dataEdit.id,
                    payload: {
                        artistId: values?.artistId,
                        artistRoleId: values.roleId,
                        addArtistToTracks: !!values?.addArtistToTracks,
                    },
                    onSuccess: () => {
                        deActive();
                    },
                };
                updateReleaseArtist(variables);
            }
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        if (dataEdit?.id) {
            form.setFieldsValue({
                artistId: dataEdit?.artistId,
                roleId: dataEdit?.artistRoleId,
                addArtistToTracks: dataEdit?.addArtistToTracks ?? true,
            });
        } else {
            form.setFieldsValue({
                addArtistToTracks: true,
            });
        }
    }, [dataEdit]);

    return (
        <AppModal
            open
            title={
                isArtistEditModal
                    ? messages('artist.update')
                    : messages('artist.add')
            }
            onCancel={closeModal}
            onOk={form.submit}
            confirmLoading={isActive}
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
                        showSearch
                        // fallBack={dataEdit?.artist?.name}
                        placeholder={messages('artist.select')}
                        onCreateArtist={() => setShowCreateArtistModal(true)}
                        disabledArtistIds={disabledArtistIds}
                    />
                </AppFormItem>

                {showCreateArtistModal && (
                    <ArtistFormModal
                        open
                        onCancel={() => setShowCreateArtistModal(false)}
                    />
                )}

                {!isSetMainArtist && (
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
                            // fallBack={dataEdit?.artistRole?.name}
                            placeholder={messages('common.role')}
                            disabledRoleIds={disabledRoleIds}
                        />
                    </AppFormItem>
                )}

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
                            linkedPlatforms={fakeLinkedPlatforms}
                        />
                    </div>
                )}

                <AppFormItem name="addArtistToTracks" valuePropName="checked">
                    <Checkbox>
                        <span> {messages('artist.addToTracks')}</span>
                    </Checkbox>
                </AppFormItem>
            </AppForm>
            {/* <LinkProfileArtist
                open={showLinkProfile}
                onClose={() => setShowLinkProfile(false)}
            /> */}
        </AppModal>
    );
}
