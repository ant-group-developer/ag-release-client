import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateLabel } from '../../hooks/use-create-label';
import { useUpdateLabel } from '../../hooks/use-update-label';
import { LabelData } from '../../types';
import { CreateLabelPayload, UpdateLabelPayload } from '../../types/payload';

type labelFormValues = Omit<LabelData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function LabelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    // const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as LabelData);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createLabel } = useCreateLabel();
    const { updateLabel } = useUpdateLabel();

    const handleUpdateLabel = (value: labelFormValues) => {
        const variables: UpdateVariables<LabelData['id'], UpdateLabelPayload> =
            {
                id: dataEdit?.id,
                payload: value,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            };
        updateLabel(variables);
    };

    const handleCreateLabel = (value: labelFormValues) => {
        const variables: CreateVariables<CreateLabelPayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createLabel(variables);
    };

    const onFinish = async (values: labelFormValues) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        active();
        const payloadValues = res;
        if (file) {
            const dataPayload = {
                entityType: ENTITY_TYPE_PICTURE.LABEL,
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

        return isUpdateModal
            ? handleUpdateLabel(payloadValues)
            : handleCreateLabel(payloadValues);
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
    }, [JSON.stringify(dataEdit)]);

    return (
        <AppModal
            width={600}
            {...props}
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} label`}
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
            >
                <div className="flex items-center gap-4">
                    <AppFormItem
                        name="pictureFile"
                        label={'Logo'}
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
                            accept={ACCEPT_IMAGE}
                            maxSizeMB={2}
                            disabled={isActive}
                            description={
                                <ul className="space-y-1 text-xs">
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.supportImageFormat',
                                            {
                                                value: 'PNG, JPG, WEBP, SVG, ICON',
                                            }
                                        )}
                                    </li>
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.mustBeLessThanMB',
                                            {
                                                value: '3',
                                            }
                                        )}
                                    </li>
                                </ul>
                            }
                        />
                    </AppFormItem>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('label.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('label.name'),
                            }),
                        },
                        {
                            validator: (_, value) => {
                                if (value && value.includes('_')) {
                                    return Promise.reject(
                                        messages('validation.noUnderscore', {
                                            field: messages('label.name'),
                                        })
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    // required
                    rules={[
                        // {
                        //     required: true,
                        //     message: messages('validation.input'),
                        // },
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            minRows: 4,
                            maxRows: 6,
                        }}
                        allowClear
                        showCount
                        className="mb-4"
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
