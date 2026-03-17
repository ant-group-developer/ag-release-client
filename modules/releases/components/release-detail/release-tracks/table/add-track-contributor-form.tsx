import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { SIZE_ICON } from '@/constants/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useActive } from '@/hooks/use-active';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/releases/types';
import { useCreateTrackContributor } from '@/modules/track-contributor/hooks/use-create-track-contributor';
import { CreateTrackContributorPayload } from '@/modules/track-contributor/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Form } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    trackData?: TrackData;
};

export default function AddTrackContributorForm({ trackData }: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // apis
    const { createTrackContributor } = useCreateTrackContributor();

    // func
    const handleSubmit = async (values: any) => {
        active();
        const variables: CreateVariables<CreateTrackContributorPayload> = {
            payload: {
                artistId: values.artistId,
                artistRoleId: values.roleId,
                trackId: trackData?.id as string,
            },
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => deActive(),
        };
        createTrackContributor(variables);
    };
    return (
        <AppForm
            form={form}
            onFinish={(values) => handleSubmit(values)}
            layout="vertical"
            showSubmit={false}
            disabled={isActive}
            variant={isReadMode ? 'underlined' : 'outlined'}
        >
            <div className="grid grid-cols-4 gap-4">
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
                        // fallBack={dataEdit?.artist?.name}
                        placeholder={messages('artist.select')}
                        // disabledArtistIds={disabledArtistIds}
                        allowClear
                        disabled={isReadMode || isActive}
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
                        // fallBack={dataEdit?.artistRole?.name}
                        placeholder={messages('common.role')}
                        // disabledRoleIds={disabledRoleIds}
                        placement="topLeft"
                        allowClear
                        disabled={isReadMode || isActive}
                    />
                </AppFormItem>

                <div className="mt-4 flex items-center justify-end">
                    <Button
                        disabled={isActive || isReadMode}
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
