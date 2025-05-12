import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useLoading } from '@/hooks/use-loading';
import useModalStore, { CloseModalProps } from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

import DndImageUpload from '@/components/ui/input/dnd-Image-upload';
import DndVideoUpload from '@/components/ui/input/dnd-video-upload';
import { UPLOAD_TYPE } from '@/enums/common';
import { getImageDimensions, getMediaInfoVideo } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { uploadApi } from '@/modules/upload/apis';
import { CreateFile } from '@/types/api';
import TextArea from 'antd/es/input/TextArea';
import { useUploadProduct } from '../../hooks/use-upload-product';
import { ProductData } from '../../types';
import { CreateProduct } from '../../types/create-product';
import { SubmitProductFilePayload } from '../../types/update-product-file';
type Props = {
    dataEdit: ProductData | null;
    onClose: CloseModalProps;
} & Omit<AppModalProps, 'children'>;

export default function ProductUpload({ dataEdit, onClose, ...props }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const isUploadVideo = dataEdit?.productType?.code === UPLOAD_TYPE.VIDEO;
    const isUploadSource = dataEdit?.productType?.code === UPLOAD_TYPE.SOURCE;

    const { isActive, active, deActive } = useActive();
    const modalTitle =
        messages('product.uploadProduct') + ` ${dataEdit?.order.code}`;

    const { uploadProduct } = useUploadProduct();

    const onFinish = async () => {
        try {
            const value = await form.validateFields();
            active();

            let fieldData;
            if (value?.image) {
                fieldData = value.image;
            } else if (value?.video) {
                fieldData = value.video;
            }

            // if (!fieldData) {
            //     throw new Error('Không có dữ liệu image hoặc video.');
            // }

            let productData: CreateProduct;
            let fileData: CreateFile | undefined = undefined;

            if (fieldData) {
                const { fileList } = fieldData;
                if (!fileList) return;
                const fileObj = fileList[0].originFileObj;

                const fileId = await uploadApi.uploadFileToDriveV2(
                    fileObj,
                    dataEdit?.order?.googleDriveFolderId
                );
                fileData = {
                    key: '',
                    contentType: fileObj.type,
                    extension: fileObj.name.split('.').pop(),
                    fileSizeInByte: fileObj.size,
                    fileName: fileObj.name,
                    googleDriveFileId: fileId,
                };

                productData = value.image
                    ? await getImageDimensions(fileList[0].originFileObj)
                    : await getMediaInfoVideo(fileList[0].originFileObj);
            } else {
                productData = { source: value.source };
            }

            const payloadSubmit: SubmitProductFilePayload = {
                orderProductId: dataEdit?.id as ProductData['id'],
                payload: {
                    product: productData,
                    file: fileData,
                },
                onSuccess: () => {
                    form.resetFields();
                    onClose();
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            };

            uploadProduct(payloadSubmit);
        } catch (error) {
            deActive();
            showNotification(
                'error',
                messages('file.message.uploadFileFailed')
            );
        }
    };

    return (
        <AppModal
            {...props}
            title={modalTitle}
            onOk={form.submit}
            onCancel={onClose}
            confirmLoading={isActive}
            width={750}
            cancelButtonProps={{ disabled: isActive }}
            style={{ top: '1rem' }}
        >
            <AppForm
                form={form}
                layout="vertical"
                onFinish={onFinish}
                showSubmit={false}
                disabled={isActive}
            >
                {!isUploadVideo && !isUploadSource && (
                    <AppFormItem name="image" label={messages('common.image')}>
                        <DndImageUpload accept="image/*" />
                    </AppFormItem>
                )}

                {isUploadVideo && !isUploadSource && (
                    <AppFormItem
                        name="video"
                        label={messages('common.video')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.file'),
                            },
                        ]}
                    >
                        <DndVideoUpload />
                    </AppFormItem>
                )}

                {isUploadSource && (
                    <AppFormItem
                        name="source"
                        label={messages('common.source')}
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
                )}

                <AppFormItem
                    name="note"
                    label={messages('common.note')}
                    rules={[
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
                            }),
                        },
                    ]}
                >
                    <TextArea autoSize={{ minRows: 5, maxRows: 7 }} />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
