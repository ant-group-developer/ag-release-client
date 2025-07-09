import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { roleArtist } from '../../constants';
import ArtistProfilesList from '../list/artist-profiles';

type Props = {
    onSubmit: (values: any) => void;
    isSetMainArtist?: boolean;
};

// Dữ liệu mẫu cho các platform đã liên kết
const fakeLinkedPlatforms = [
    { id: '2', name: 'Apple Music' },
    { id: '5', name: 'Youtube Music' },
];

export default function AddArtistModal({ isSetMainArtist, onSubmit }: Props) {
    const [form] = Form.useForm();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const watchArtistName = useWatch(['name'], form);
    const typeModal = useModalStore((state) => state.typeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const isArtistEditModal =
        typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST;
    const isAddArtistReleaseModal =
        typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST;
    const dataEdit = useModalStore((state) => state.dataEdit);

    const { dspData } = useGetListDsp({});

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (isSetMainArtist) {
                values.role = 'Main Artist';
            }
            onSubmit(values);
            closeModal();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    useEffect(() => {
        if (isArtistEditModal) {
            form.setFieldsValue({
                name: dataEdit?.name,
                role: dataEdit?.role,
            });
        }
    }, [isArtistEditModal, dataEdit, form]);

    return (
        <AppModal
            open
            title={
                isArtistEditModal
                    ? messages('artist.update')
                    : messages('artist.add')
            }
            onCancel={closeModal}
            onOk={handleSubmit}
        >
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <AppFormItem
                    name="name"
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
                        placeholder={messages('artist.select')}
                    />
                </AppFormItem>

                {!isSetMainArtist && (
                    <AppFormItem
                        name="role"
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
                            placeholder={messages('common.role')}
                            options={roleArtist}
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
            </AppForm>
            {/* <LinkProfileArtist
                open={showLinkProfile}
                onClose={() => setShowLinkProfile(false)}
            /> */}
        </AppModal>
    );
}
