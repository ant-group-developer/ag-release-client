import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import { SIZE_ICON } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { TrackData } from '@/modules/releases/types';
import { useCreateTrackArtist } from '@/modules/track-artist/hooks/use-create-track-artist';
import { CreateTrackArtistPayload } from '@/modules/track-artist/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Form } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    trackData?: TrackData;
};

export default function AddTrackArtistForm({ trackData }: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();

    // apis
    const { createTrackArtist } = useCreateTrackArtist();

    // func
    const handleSubmit = async (values: any) => {
        active();
        const variables: CreateVariables<CreateTrackArtistPayload> = {
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
        createTrackArtist(variables);
    };
    return (
        <AppForm
            form={form}
            onFinish={(values) => handleSubmit(values)}
            layout="vertical"
            showSubmit={false}
            disabled={isActive}
        >
            <div className="grid grid-cols-2 gap-4">
                <AppFormItem
                    className="flex-2"
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
                    />
                </AppFormItem>

                {/* <AppFormItem
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
                    />
                </AppFormItem> */}

                <div className="mt-4 flex items-center justify-end">
                    <Button
                        disabled={isActive}
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
