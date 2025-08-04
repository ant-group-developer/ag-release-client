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
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateGenre } from '../../hooks/use-create-genre';
import { useUpdateGenre } from '../../hooks/use-update-genre';
import { GenresData } from '../../types';
import { CreateGenrePayload, UpdateGenrePayload } from '../../types/payload';

type GenreFormValues = Omit<GenresData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function GenresFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as GenresData);
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;
    const { createGenre } = useCreateGenre();
    const { updateGenre } = useUpdateGenre();

    function renderTitle() {
        const isUpdate = !!dataEdit?.id;
        return `${isUpdate ? messages('common.update') : messages('common.create')} ${messages('common.genres').toLocaleLowerCase()}`;
    }
    const titleModal = renderTitle();

    const handleUpdateGenre = (values: GenreFormValues) => {
        const variables: UpdateVariables<GenresData['id'], UpdateGenrePayload> =
            {
                id: dataEdit?.id,
                payload: values,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            };
        updateGenre(variables);
    };

    const handleCreateGenre = (values: GenreFormValues) => {
        const variables: CreateVariables<CreateGenrePayload> = {
            payload: values,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createGenre(variables);
    };

    const onFinish = async (values: GenreFormValues) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        active();
        const payloadValues = res;
        if (file) {
            const dataPayload = {
                entityType: 'genres',
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
            payloadValues.picture = getAvatarUrl(values?.name);
        }

        return isUpdateForm
            ? handleUpdateGenre(payloadValues)
            : handleCreateGenre(payloadValues);
    };

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
            width={500}
            {...props}
            title={titleModal}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
            className="!top-4"
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
            >
                <div className="flex items-center gap-4">
                    <AppFormItem
                        name="pictureFile"
                        label={messages('common.image')}
                        // required
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: messages('validation.input'),
                        //     },
                        // ]}
                    >
                        <ImageListUpload
                            maxCount={1}
                            maxSizeMB={2}
                            accept="image/*"
                        />
                    </AppFormItem>
                    <div>
                        <p className="flex-1 text-sm text-gray-500">
                            {messages('image.validation.supportImageFormat', {
                                value: 'PNG, JPG, JPEG',
                            })}
                        </p>
                        <p className="flex-1 text-sm text-gray-500">
                            {messages('image.validation.mustBeLessThanMB', {
                                value: '3',
                            })}
                        </p>
                    </div>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('formFields.genres')}
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
                    <Input
                        placeholder={messages('formFields.genres')}
                        allowClear
                    />
                </AppFormItem>

                <AppFormItem
                    name="value"
                    label={messages('common.value')}
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
                    <Input placeholder={messages('common.value')} allowClear />
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    rules={[
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
                            }),
                        },
                    ]}
                >
                    <Input.TextArea
                        className="!mb-2"
                        showCount
                        placeholder={messages('common.description')}
                        allowClear
                        autoSize={{ minRows: 4, maxRows: 6 }}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
