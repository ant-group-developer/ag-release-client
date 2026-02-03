import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { useActive } from '@/hooks/use-active';
import { useApiNotify } from '@/hooks/use-api-notify';
import useModalStore from '@/hooks/use-modal';
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
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUpdateReleaseArtist } from '../../hooks/use-update-release-artist';

type Props = Omit<AppModalProps, 'children'> & {
    isSetMainArtist: boolean;
};

export default function ReleaseArtistModal({ isSetMainArtist }: Props) {
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    // const watchArtistName = useWatch('name', form);
    const typeModal = useModalStore((state) => state.typeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const releaseId = formValues?.id;
    // const { releaseData } = useGetDetailRelease(releaseId as string);
    const { handleError } = useApiNotify();

    const isArtistEditModal =
        typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST;
    const dataEdit = useModalStore((state) => state.dataEdit as ReleaseArtist);

    // const { dspData } = useGetListDsp({});
    const { createReleaseArtist } = useCreateReleaseArtist();
    // const { artistsRolesData } = useGetListArtistRole({});
    const { updateReleaseArtist } = useUpdateReleaseArtist();

    const handleSubmit = async (values: any) => {
        active();
        try {
            if (isArtistEditModal) {
                const variables: UpdateVariables<
                    ReleaseArtist['id'],
                    UpdateReleaseArtistPayload
                > = {
                    id: dataEdit.id,
                    payload: {
                        artistId: values?.artistId,
                        addArtistToTracks: !!values?.addArtistToTracks,
                    },
                    onSuccess: () => {
                        deActive();
                    },
                };
                updateReleaseArtist(variables);
            } else {
                const variables: CreateVariables<CreateReleaseArtistPayload> = {
                    payload: {
                        artistId: values.artistId,
                        releaseId: formValues.id as string,
                        addArtistToTracks: !!values?.addArtistToTracks,
                    },
                    onSuccess: () => {
                        closeModal();
                    },
                };
                createReleaseArtist(variables);
            }
        } catch (error) {
            deActive();
            handleError(error);
        }
    };

    useEffect(() => {
        if (dataEdit?.id) {
            form.setFieldsValue({
                artistId: dataEdit?.artistId,
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
            loading={isActive}
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
                    />
                </AppFormItem>

                {/* {showCreateArtistModal && (
                    <ArtistFormModal
                        open
                        onCancel={() => setShowCreateArtistModal(false)}
                    />
                )} */}

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
                        />
                    </AppFormItem>
                )}

                <AppFormItem name="addArtistToTracks" valuePropName="checked">
                    <Checkbox>
                        <span> {messages('artist.addToTracks')}</span>
                    </Checkbox>
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
