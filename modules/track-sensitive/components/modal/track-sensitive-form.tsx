import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTrackSensitive } from '../../hooks/use-create-track-sensitive';
import { useUpdateTrackSensitive } from '../../hooks/use-update-track-sensitive';
import { TrackSensitiveData } from '../../types';
import {
    CreateTrackSensitivePayload,
    UpdateTrackSensitivePayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TrackSensitiveFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as TrackSensitiveData
    );
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createTrackSensitive } = useCreateTrackSensitive();
    const { updateTrackSensitive } = useUpdateTrackSensitive();

    const handleUpdateTrackSensitive = (value: any) => {
        const variables: UpdateVariables<
            TrackSensitiveData['id'],
            UpdateTrackSensitivePayload
        > = {
            id: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateTrackSensitive(variables);
    };

    const handleCreateTrackSensitive = (value: any) => {
        const variables: CreateVariables<CreateTrackSensitivePayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createTrackSensitive(variables);
    };

    const onFinish = async (values: any) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        active();
        const payloadValues = res;
        if (file) {
            const dataPayload = {
                entityType: ENTITY_TYPE_PICTURE.TRACK_SENSITIVE,
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
                    payloadValues.icon = urlPublic;
                }
            } catch (error) {
                deActive();
            }
        } else if (!file && !oldFile) {
            // payloadValues.picture = null;
            const defaultImage = getAvatarUrl(values.name);
            payloadValues.icon = defaultImage;
        }

        return isUpdateModal
            ? handleUpdateTrackSensitive(payloadValues)
            : handleCreateTrackSensitive(payloadValues);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
            pictureFile: dataEdit?.icon
                ? {
                      fileList: [
                          {
                              uid: dataEdit?.id,
                              thumbUrl: dataEdit?.icon,
                              url: dataEdit?.icon,
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
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('trackSensitive.label').toLowerCase()}`}
            open
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
                                                value: '2',
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
                    label={messages('trackSensitive.name')}
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
                                field: messages('trackSensitive.name'),
                            }),
                        },
                    ]}
                >
                    <Input
                        allowClear
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setFieldValue('code', getCodeFormatted(value));
                        }}
                    />
                </AppFormItem>
                <AppFormItem
                    name="code"
                    label={messages('common.code')}
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
                                field: messages('common.code'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
