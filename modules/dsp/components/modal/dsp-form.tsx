import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateDsp } from '../../hooks/use-create-dsp';
import { useUpdateDsp } from '../../hooks/use-update-dsp';
import { DspData } from '../../types';
import { CreateDspPayload, UpdateDspPayload } from '../../types/payload';

type DspFormValues = Omit<DspData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function DspFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const { active, isActive, deActive } = useActive();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as DspData);
    const isUpdate = !!dataEdit?.id;

    const { createDsp } = useCreateDsp();
    const { updateDsp } = useUpdateDsp();

    const handleCreateDsp = (values: DspFormValues) => {
        const variables: CreateVariables<CreateDspPayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createDsp(variables);
    };

    const handleUpdateDsp = (values: DspFormValues) => {
        const variables: UpdateVariables<DspData['id'], UpdateDspPayload> = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateDsp(variables);
    };

    const onFinish = async (values: any) => {
        const { pictureFile, link, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        const formatLinks = link
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean);
        active();
        const payloadValues = { formatLinks, ...res };
        if (file) {
            const dataPayload = {
                entityType: 'dsps',
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
                return;
            }
        } else if (!file && !oldFile) {
            // payloadValues.picture = null;
            payloadValues.picture = getAvatarUrl(values?.name);
        }

        return isUpdate
            ? handleUpdateDsp(payloadValues)
            : handleCreateDsp(payloadValues);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
            link: dataEdit?.formatLinks,
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
            title={`${isUpdate ? messages('common.update') : messages('common.create')} DSP`}
            open
            onCancel={closeModal}
            onOk={form.submit}
            className="!top-4"
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
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
                            accept="image/*"
                            maxSizeMB={2}
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
                    label={messages('dsp.name')}
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
                    name="link"
                    label={'Format links'}
                    tooltip={messages('dsp.oneLinkPerLine')}
                >
                    <TextArea
                        allowClear
                        autoSize={{
                            maxRows: 7,
                            minRows: 3,
                        }}
                    />
                </AppFormItem>

                <AppFormItem
                    name="canLinkArtistProfile"
                    label={messages('artist.canLinkArtistProfile')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value={true}>{messages('common.yes')}</Radio>
                        <Radio value={false}>{messages('common.no')}</Radio>
                    </Radio.Group>
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
