import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { SIZE_ICON } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { useCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-create-release-contributor';
import { CreateReleaseContributorPayload } from '@/modules/release-contributor/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Form, Switch } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useReleaseFormStore } from '../../hooks/release-form-store';

type Props = {
    disabled?: boolean;
};

export default function AddArtistContributorForm({ disabled = false }: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();
    const releaseValues = useReleaseFormStore((state) => state.formValues);
    const params = useParams();
    // const isCreateReleasePage = params['action'] === 'create';

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
        createReleaseContributor(variables);
    };
    return (
        <AppForm
            form={form}
            onFinish={(values) => handleSubmit(values)}
            layout="vertical"
            showSubmit={false}
            disabled={disabled || isActive}
            variant={disabled ? 'underlined' : 'outlined'}
        >
            <div className="grid grid-cols-5 gap-4">
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
                        disabled={disabled || isActive}
                        showSearch
                        // fallBack={dataEdit?.artist?.name}
                        placeholder={messages('artist.select')}
                        // disabledArtistIds={disabledArtistIds}
                        allowClear
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
                        disabled={disabled || isActive}
                        // fallBack={dataEdit?.artistRole?.name}
                        placeholder={messages('common.role')}
                        // disabledRoleIds={disabledRoleIds}
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
                    <Switch disabled={disabled || isActive} />
                </AppFormItem>

                <div className="mt-4 flex items-center justify-end space-x-2">
                    <Button
                        disabled={disabled || isActive}
                        loading={isActive}
                        onClick={() => form.submit()}
                        icon={
                            <div>
                                <Plus size={SIZE_ICON} />
                            </div>
                        }
                        type="primary"
                    >
                        {messages('common.add')}
                    </Button>
                </div>
            </div>
        </AppForm>
    );
}
