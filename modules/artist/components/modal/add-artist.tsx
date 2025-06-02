import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import useModalStore from '@/hooks/use-modal';
import { fakeDspData } from '@/modules/dashboard/constants/mockData';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { roleArtist } from '../../constants';
import { TYPE_MODAL_ARTIST } from '../../enum';
import ArtistProfilesList from '../list/artist-profiles';

type Props = {};

// Dữ liệu mẫu cho các platform đã liên kết
const fakeLinkedPlatforms = [
    { id: '2', name: 'Apple Music' },
    { id: '5', name: 'Youtube Music' },
];

export default function AddArtistModal({}: Props) {
    const [form] = Form.useForm();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const watchArtistName = useWatch(['name'], form);
    const typeModal = useModalStore((state) => state.typeModal);
    const isContributorModal = typeModal === TYPE_MODAL_ARTIST.ADD_CONTRIBUTOR;

    return (
        <AppModal open title={messages('artist.add')} onCancel={closeModal}>
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
                    <ArtistSelect placeholder={messages('artist.select')} />
                </AppFormItem>

                {isContributorModal && (
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
                            list={fakeDspData.map((item) => ({
                                icon: item.image,
                                name: item.name,
                                id: item.id.toString(),
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
