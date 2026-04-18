import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ArtistSelect from '@/components/ui/select/artist-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { toastPromise } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { ArtistData } from '@/modules/artist/types';
import { TrackData } from '@/modules/releases/types';
import { useCreateTrackArtist } from '@/modules/track-artist/hooks/use-create-track-artist';
import { CreateTrackArtistPayload } from '@/modules/track-artist/types/payload';
import { CreateVariables } from '@/types/api';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {
    trackData?: TrackData;
    disabled?: boolean;
};

export default function AddTrackArtistForm({
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
    const { createTrackArtist } = useCreateTrackArtist();

    // const
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // func
    const handleSubmit = async (values: any) => {
        active();
        const variables: CreateVariables<CreateTrackArtistPayload> = {
            payload: {
                artistId: values.artistId,
                trackId: trackData?.id as string,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => deActive(),
        };
        props.onCancel?.({} as any);
        toastPromise(createTrackArtist(variables), messages, {
            success: messages('common.success'),
        });
    };
    const handleCreateArtistSuccess = (data: ArtistData) => {
        props.onCancel?.({} as any);
        const variables: CreateVariables<CreateTrackArtistPayload> = {
            payload: {
                artistId: data.id,
                trackId: trackData?.id as string,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => deActive(),
        };
        toastPromise(createTrackArtist(variables), messages, {
            success: messages('common.success'),
        });
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
            </AppForm>
        </AppModal>
    );
}
