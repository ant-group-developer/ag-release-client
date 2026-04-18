import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { ArtistData } from '@/modules/artist/types';
import { useCreateReleaseArtist } from '@/modules/release-artist/hooks/use-create-release-artist';
import { CreateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { CreateVariables } from '@/types/api';
import { Form, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useReleaseFormStore } from '../../hooks/release-form-store';

type Props = Omit<AppModalProps, 'children'> & {
    disabled?: boolean;
};

export default function AddArtistForm({ disabled = false, ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const [form] = Form.useForm();
    const releaseValues = useReleaseFormStore((state) => state.formValues);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const { createReleaseArtist } = useCreateReleaseArtist();

    // func
    const handleSubmit = async (values: any) => {
        active();
        const variables: CreateVariables<CreateReleaseArtistPayload> = {
            payload: {
                artistId: values.artistId,
                releaseId: releaseValues.id as string,
                addArtistToTracks: !!values?.addArtistToTracks,
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
        toastPromise(createReleaseArtist(variables), messages, {
            success: messages('common.success'),
        });
    };
    const handleCreateArtistSuccess = (data: ArtistData) => {
        closeModal();
        const variables: CreateVariables<CreateReleaseArtistPayload> = {
            payload: {
                artistId: data?.id,
                releaseId: releaseValues.id as string,
                addArtistToTracks: false,
            },
        };
        createReleaseArtist(variables);
    };

    return (
        <AppModal
            {...props}
            title={messages('artist.add')}
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
                    addArtistToTracks: true,
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
                        showSearch
                        placeholder={messages('artist.select')}
                        allowClear
                        onCreateSuccess={handleCreateArtistSuccess}
                    />
                </AppFormItem>

                <AppFormItem
                    className="flex-1"
                    label={messages('artist.addToTracks')}
                    name="addArtistToTracks"
                    valuePropName="checked"
                >
                    <Switch />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
