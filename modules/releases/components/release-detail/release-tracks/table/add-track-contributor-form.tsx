import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/releases/types';
import { useCreateTrackContributor } from '@/modules/track-contributor/hooks/use-create-track-contributor';
import { CreateTrackContributorPayload } from '@/modules/track-contributor/types/payload';
import { CreateVariables } from '@/types/api';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {
    trackData?: TrackData;
    disabled?: boolean;
};

export default function AddTrackContributorForm({
    trackData,
    disabled = false,
    ...props
}: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();
    const releaseAction = useReleaseActionStore((s) => s.action);

    // apis
    const { createTrackContributor } = useCreateTrackContributor();

    // const
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

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
                form.resetFields();
                deActive();
            },
            onError: () => deActive(),
        };
        props.onCancel?.({} as any);
        toastPromise(createTrackContributor(variables), messages, {
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
                variant={isReadMode ? 'underlined' : 'outlined'}
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
                        disabled={isReadMode || isActive}
                        showCreate={false}
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
                        disabled={isReadMode || isActive}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
