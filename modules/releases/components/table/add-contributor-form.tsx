import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { ArtistData } from '@/modules/artist/types';
import { useBulkCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-bulk-create-release-contributor';
import {
    BulkCreateReleaseContributorPayload,
    CreateReleaseContributorPayload,
} from '@/modules/release-contributor/types/payload';
import { CreateVariables } from '@/types/api';
import { Form, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useReleaseFormStore } from '../../hooks/release-form-store';

type Props = Omit<AppModalProps, 'children'> & {
    disabled?: boolean;
};

export default function AddContributorForm({
    disabled = false,
    ...props
}: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();
    const releaseValues = useReleaseFormStore((state) => state.formValues);
    // const closeModal = useModalStore((state) => state.closeModal);
    const artistIdValue = Form.useWatch('artistId', form);

    // apis
    const { bulkCreateReleaseContributor } = useBulkCreateReleaseContributor();

    // func
    const handleSubmit = async (values: {
        artistId: string;
        roleId: string[];
        addContributorToTracks: boolean;
    }) => {
        active();
        const roleIds = values.roleId;
        const items: CreateReleaseContributorPayload[] =
            roleIds?.map((id) => {
                return {
                    artistId: values.artistId,
                    artistRoleId: id,
                    releaseId: releaseValues?.id as string,
                    addContributorToTracks: values.addContributorToTracks,
                };
            }) ?? [];
        const variables: CreateVariables<BulkCreateReleaseContributorPayload> =
            {
                payload: { items },
                onSuccess: () => {
                    form.resetFields();
                    deActive();
                },
                onError(e) {
                    deActive();
                },
            };
        props.onCancel?.({} as any);
        toastPromise(bulkCreateReleaseContributor(variables), messages, {
            success: messages('common.success'),
        });
    };
    const handleCreateArtistSuccess = (data: ArtistData) => {
        form.setFieldValue('artistId', data.id);
    };

    return (
        <AppModal
            {...props}
            title={messages('release.contributors')}
            onOk={() => form.submit()}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={(values) => handleSubmit(values)}
                layout="vertical"
                showSubmit={false}
                disabled={disabled || isActive}
                variant={disabled ? 'underlined' : 'outlined'}
                initialValues={{
                    addContributorToTracks: true,
                }}
            >
                <AppFormItem
                    className="col-span-2"
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
                        artistId={artistIdValue}
                        showSearch
                        placeholder={messages('artist.select')}
                        allowClear
                        onCreateSuccess={handleCreateArtistSuccess}
                    />
                </AppFormItem>

                <AppFormItem
                    className="flex-1"
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
                        placeholder={messages('common.role')}
                        placement="topLeft"
                        allowClear
                        mode="multiple"
                    />
                </AppFormItem>

                <AppFormItem
                    className="flex-1"
                    label={messages('artist.addToTracks')}
                    name="addContributorToTracks"
                    valuePropName="checked"
                >
                    <Switch />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
