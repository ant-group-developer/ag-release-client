import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {};

export default function ArtistFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    return (
        <AppModal
            width={600}
            {...props}
            title={messages('artist.create')}
            open
            onCancel={closeModal}
            onOk={form.submit}
        >
            <AppForm form={form} showSubmit={false} layout="vertical">
                <div className="flex items-center gap-4">
                    <AppFormItem name="thumbnail" label={'Avatar'}>
                        <ImageListUpload maxCount={1} accept="image/*" />
                    </AppFormItem>
                    <p className="flex-1 text-center text-sm text-gray-500">
                        Hỗ trợ định dạng ảnh PNG, JFIF, JPEG, or JPG
                    </p>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('artist.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="biography"
                    label={'Biography'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 250,
                            message: messages('validation.max', {
                                number: 250,
                            }),
                        },
                    ]}
                >
                    <TextArea allowClear />
                </AppFormItem>

                {/* <div className="space-y-4"> 
                    <AppFormItem name="profiles" label="Artist Profiles">
                        <div className="flex flex-col gap-2 rounded-md border p-2"> */}
                {/* <AppFormItem name="spotify" className="!mb-0">
                                <div className="flex cursor-pointer items-center justify-between rounded-md bg-card-bg p-3 hover:bg-card-bg-hover">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icon/platform-icon/spotify.svg"
                                            alt="Spotify"
                                            width={78}
                                            height={24}
                                        />
                                    </div>
                                    <Button
                                        type="default"
                                        className="font-medium"
                                    >
                                        Link Profile
                                    </Button>
                                </div>
                            </AppFormItem> */}

                {/* <ArtistProfilesList
                                list={fakeDspData.map((item) => ({
                                    icon: item.image,
                                    name: item.name,
                                    id: item.id.toString(),
                                }))}
                            />
                        </div>
                    </AppFormItem>
                </div> */}
            </AppForm>
        </AppModal>
    );
}
