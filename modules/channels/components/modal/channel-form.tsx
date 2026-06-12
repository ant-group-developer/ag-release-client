import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TenantSelect from '@/components/ui/select/tenant-select';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateChannel } from '../../hooks/use-create-channel';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelsData } from '../../types';
import {
    CreateChannelPayload,
    UpdateChannelPayload,
} from '../../types/payload';

type ChannelFormValues = UpdateChannelPayload & {
    thumbFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function ChannelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<ChannelFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ChannelsData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();
    const { linkReadFile: thumbUrl } = useGetLinkReadFile(
        dataEdit?.thumbId ?? ''
    );

    const { createChannel, isPending: isCreatePending } = useCreateChannel();
    const { updateChannel, isPending: isUpdatePending } = useUpdateChannel();

    const handleCreateChannel = (values: ChannelFormValues) => {
        const payload = {
            name: values.name,
            tenantId: values.tenantId,
            youtubeChannelId: values.youtubeChannelId,
            thumbId: values.thumbId,
        } as CreateChannelPayload;

        const variables: CreateVariables<CreateChannelPayload> = {
            payload,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createChannel(variables);
    };

    const handleUpdateChannel = (values: ChannelFormValues) => {
        const variables: UpdateVariables<
            ChannelsData['id'],
            UpdateChannelPayload
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
        updateChannel(variables);
    };

    const onfinish = async (values: ChannelFormValues) => {
        active();

        try {
            const { thumbFile, ...payloadValues } = values;
            const file = thumbFile?.fileList?.[0]?.originFileObj as
                | File
                | undefined;

            if (file) {
                const payload: CreateBucketFile = {
                    folderBucket: {
                        uploadPurpose: TYPE_UPLOAD_BUCKET.CHANNEL_THUMB,
                    },
                    file: {
                        fileName: file.name,
                        contentType: file.type,
                        extension: file.name.split('.').pop() || '',
                        fileSize: file.size,
                    },
                };
                const thumbId = await bucketApi.createBucket(file, payload);

                if (!thumbId) {
                    deActive();
                    return;
                }

                await bucketApi.submit({ ids: [thumbId] });
                payloadValues.thumbId = thumbId;
            }

            return isUpdateForm
                ? handleUpdateChannel(payloadValues)
                : handleCreateChannel(payloadValues);
        } catch (error) {
            deActive();
        }
    };

    const modalTitle = () => {
        return `${isUpdateForm ? messages('common.update') : messages('common.create')} ${messages('channel.label').toLocaleLowerCase()}`;
    };

    useEffect(() => {
        const initialData: ChannelFormValues = {
            name: dataEdit?.name,
            tenantId: dataEdit?.tenantId,
            youtubeChannelId: dataEdit?.youtubeChannelId ?? undefined,
            thumbId: dataEdit?.thumbId ?? undefined,
            thumbFile:
                dataEdit?.thumbId && thumbUrl
                    ? {
                          fileList: [
                              {
                                  uid: dataEdit?.thumbId,
                                  url: thumbUrl,
                                  thumbUrl,
                                  name: dataEdit?.name,
                                  status: 'done',
                              },
                          ],
                      }
                    : undefined,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit, form, thumbUrl]);

    return (
        <AppModal
            width={500}
            {...props}
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onfinish}
                layout="vertical"
                disabled={isActive}
            >
                <AppFormItem name="thumbFile" label="Thumbnail">
                    <ImageListUpload
                        maxCount={1}
                        accept={ACCEPT_IMAGE}
                        maxSizeMB={3}
                        placeholder={messages('common.uploadImage')}
                        disabled={isActive}
                    />
                </AppFormItem>

                <AppFormItem
                    name="tenantId"
                    label={messages('tenant.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TenantSelect
                        placeholder={messages('tenant.selectTitle')}
                    />
                </AppFormItem>

                <AppFormItem
                    name="name"
                    label={messages('channel.name')}
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
                                field: messages('channel.name'),
                            }),
                        },
                        {
                            pattern: /^[A-Za-z0-9]+VEVO$/,
                            message: messages('channel.validation.nameFormat'),
                        },
                    ]}
                >
                    <Input placeholder={messages('channel.name')} allowClear />
                </AppFormItem>

                <AppFormItem
                    name="youtubeChannelId"
                    label="YouTube channel ID"
                    rules={[
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'YouTube channel ID',
                            }),
                        },
                    ]}
                >
                    <Input placeholder="UC..." allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
