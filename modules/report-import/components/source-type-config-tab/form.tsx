import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { ACCEPT_IMAGE } from '@/constants/validate';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { Form, Input, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useUpdateSourceTypeConfig } from '../../hooks/use-update';
import { SourceTypeConfigData } from '../../types';
import { UpdateSourceTypeConfigPayload } from '../../types/payload';

type FormValues = UpdateSourceTypeConfigPayload & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'>;

export default function SourceTypeConfigForm({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<FormValues>();
    const [uploading, setUploading] = useState(false);

    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<SourceTypeConfigData>(
        (state) => state.dataEdit
    );

    const { updateSourceTypeConfig, isPending } = useUpdateSourceTypeConfig();

    useEffect(() => {
        if (dataEdit) {
            form.setFieldsValue({
                label: dataEdit.label,
                imageUrl: dataEdit.imageUrl,
                pictureFile: dataEdit.imageUrl
                    ? {
                          fileList: [
                              {
                                  uid: dataEdit.sourceType,
                                  name: dataEdit.label,
                                  status: 'done',
                                  url: dataEdit.imageUrl,
                              },
                          ],
                      }
                    : undefined,
            });
        }
    }, [form, dataEdit]);

    const onFinish = async (values: FormValues) => {
        if (!dataEdit?.sourceType) return;

        let finalImageUrl: string | null = null;

        const fileList = values.pictureFile?.fileList;
        const file = fileList?.[0]?.originFileObj;

        if (file) {
            setUploading(true);
            try {
                const publicUrl = await uploadApi.uploadFile({
                    infoFile: {
                        entityType: ENTITY_TYPE_PICTURE.DSP,
                        fileName: file.name,
                        contentType: file.type,
                        fileSize: file.size,
                    },
                    file: file,
                });
                if (publicUrl) {
                    finalImageUrl = publicUrl;
                }
            } catch (error) {
                showNotification(
                    'error',
                    messages('file.message.uploadFileFailed')
                );
                setUploading(false);
                return;
            } finally {
                setUploading(false);
            }
        } else if (fileList && fileList.length > 0) {
            finalImageUrl = fileList[0].url || dataEdit.imageUrl || null;
        } else {
            finalImageUrl = null;
        }

        updateSourceTypeConfig({
            sourceType: dataEdit.sourceType,
            payload: {
                label: values.label,
                imageUrl: finalImageUrl,
            },
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const isLoadingState = isPending || uploading;

    return (
        <AppModal
            {...props}
            open
            centered
            title={messages('reportConfigs.sourceTypeConfigs.action.update')}
            width={520}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isLoadingState}
        >
            <Spin spinning={isLoadingState}>
                <AppForm
                    form={form}
                    showSubmit={false}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <AppFormItem
                        name="label"
                        label={messages(
                            'reportConfigs.sourceTypeConfigs.nameLabel'
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="pictureFile"
                        label={messages('reportConfigs.sourceTypeConfigs.image')}
                    >
                        <ImageListUpload
                            maxCount={1}
                            accept={ACCEPT_IMAGE}
                            maxSizeMB={5}
                        />
                    </AppFormItem>

                    {/* <AppFormItem
                        name="imageUrl"
                        label={messages(
                            'reportConfigs.sourceTypeConfigs.imageUrl'
                        )}
                    >
                        <Input
                            allowClear
                            placeholder="https://example.com/image.png"
                        />
                    </AppFormItem> */}
                </AppForm>
            </Spin>
        </AppModal>
    );
}
