import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-create-release-contributor';
import { CreateReleaseContributorPayload } from '@/modules/release-contributor/types/payload';
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

    // apis
    const { createReleaseContributor } = useCreateReleaseContributor();

    // func
    const handleSubmit = async (values: any) => {
        active();
        const variables: CreateVariables<CreateReleaseContributorPayload> = {
            payload: {
                artistId: values.artistId,
                artistRoleId: values.roleId,
                releaseId: releaseValues.id as string,
                addContributorToTracks: !!values?.addContributorToTracks,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError(e) {
                deActive();
            },
        };
        props.onCancel?.({} as any);
        toastPromise(createReleaseContributor(variables), messages, {
            success: messages('common.success'),
        });
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
                        showSearch
                        placeholder={messages('artist.select')}
                        allowClear
                        isAddReleaseContributor
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
