import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { ArtistData } from '@/modules/artist/types';
import { TrackData } from '@/modules/releases/types';
import { useBulkCreateTrackContributor } from '@/modules/track-contributor/hooks/use-bulk-create-track-contributor';
import {
    BulkCreateTrackContributorPayload,
    CreateTrackContributorPayload,
} from '@/modules/track-contributor/types/payload';
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
    const { bulkCreateTrackContributor } = useBulkCreateTrackContributor();

    // const
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // func
    const handleSubmit = async (values: {
        artistId: string;
        roleId: string[];
    }) => {
        active();
        const roleIds = values.roleId;
        const items: CreateTrackContributorPayload[] =
            roleIds?.map((id) => {
                return {
                    artistId: values.artistId,
                    artistRoleId: id,
                    trackId: trackData?.id as string,
                };
            }) ?? [];
            
        const variables: CreateVariables<BulkCreateTrackContributorPayload> = {
            payload: { items },
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => deActive(),
        };
        props.onCancel?.({} as any);
        toastPromise(bulkCreateTrackContributor(variables), messages, {
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
                        disabled={isReadMode || isActive}
                        mode="multiple"
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
