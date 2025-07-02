import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getAvatarUrl } from '@/helpers/link';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateArtist } from '../../hooks/use-create-artist';
import { useUpdateArtist } from '../../hooks/use-update-artist';
import { ArtistData } from '../../types';
import { CreateArtistPayload, UpdateArtistPayload } from '../../types/payload';

type ArtistFormValues = Omit<ArtistData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function ArtistFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ArtistData);
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = dataEdit?.id;

    const { createArtist } = useCreateArtist();
    const { updateArtist } = useUpdateArtist();

    const handleCreateArtist = (values: ArtistFormValues) => {
        const variables: CreateVariables<CreateArtistPayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createArtist(variables);
    };

    const handleUpdateArtist = (values: ArtistFormValues) => {
        const variables: UpdateVariables<
            ArtistData['id'],
            UpdateArtistPayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };

        updateArtist(variables);
    };

    const onFinish = async (values: ArtistFormValues) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        active();
        const payloadValues = res;
        if (file) {
            const dataPayload = {
                entityType: 'artists',
                fileName: file.name,
                contentType: file.type,
                fileSize: file.size,
            };

            try {
                const urlPublic = await uploadApi.uploadFile({
                    infoFile: dataPayload,
                    file: file,
                });
                if (urlPublic) {
                    payloadValues.picture = urlPublic;
                }
            } catch (error) {
                deActive();
            }
        } else if (!file && !oldFile) {
            // payloadValues.picture = null;
            const defaultImage = getAvatarUrl(values.name);
            payloadValues.picture = defaultImage;
        }

        return isUpdateForm
            ? handleUpdateArtist(payloadValues)
            : handleCreateArtist(payloadValues);
    };

    const titleModal = isUpdateForm
        ? messages('artist.update')
        : messages('artist.create');

    useEffect(() => {
        const initialData = {
            ...dataEdit,
            pictureFile: dataEdit?.picture
                ? {
                      fileList: [
                          {
                              uid: dataEdit?.id,
                              thumbUrl: dataEdit?.picture,
                              url: dataEdit?.picture,
                              name: dataEdit?.name,
                          },
                      ],
                  }
                : undefined,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={600}
            {...props}
            title={titleModal}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
            >
                <div className="flex items-center gap-4">
                    <AppFormItem name="pictureFile" label={'Avatar'}>
                        <ImageListUpload
                            maxCount={1}
                            accept="image/*"
                            maxSizeMB={3}
                        />
                    </AppFormItem>
                    <p className="flex-1 text-sm text-gray-500">
                        {messages('image.validation.supportImageFormat', {
                            value: 'PNG, JPG, JPEG',
                        })}
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
                    label={messages('common.biography')}
                    // required
                    rules={[
                        // {
                        //     required: true,
                        //     message: messages('validation.input'),
                        // },
                        {
                            max: 250,
                            message: messages('validation.max', {
                                number: 250,
                            }),
                        },
                    ]}
                >
                    <TextArea
                        showCount
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        allowClear
                        className="mb-2"
                    />
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
