import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal from '@/components/ui/modal/normal-modal';
import { FIELD_TYPE } from '@/enums/common';
import { genPreset, rgbaToHex } from '@/helpers/common';
import { getLinkDriveImage } from '@/helpers/link';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { GOOGLE_THUMBNAIL_FOLDER_ID } from '@/modules/upload/constants/folder';
import { blue, green, purple, red, yellow } from '@ant-design/colors';
import { Form, Input, InputNumber, Select, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import {
    CreateProductTypePayload,
    useCreateProductType,
} from '../../hooks/use-create-product-type';
import {
    UpdateProductTypePayload,
    useUpdateProductType,
} from '../../hooks/use-update-product-type';
import { ProductTypeData } from '../../types';

type Props = {
    open: boolean;
    data?: ProductTypeData;
};

export default function ProductTypesForm({ open, data }: Props) {
    const messages = useTranslations();
    const { isActive, active, deActive } = useActive();
    const [form] = Form.useForm();
    const { createProductType } = useCreateProductType();
    const { updateProductType } = useUpdateProductType();

    const closeModal = useModalStore((state) => state.closeModal);

    const presetColors = genPreset({ blue, green, red, yellow, purple });

    const handleCreateProductType = async (values: any) => {
        active();

        const file = values?.googleDriveIconId?.fileList[0]?.originFileObj;

        let fileId: CreateProductTypePayload['googleDriveIconId'] = null;

        if (file) {
            fileId = await uploadApi.uploadFileToDriveV2(
                file,
                GOOGLE_THUMBNAIL_FOLDER_ID
            );
        }

        createProductType({
            payload: {
                ...values,
                code: values.code?.trim().replace(/\s+/g, ''),
                color:
                    typeof values.color === 'string'
                        ? values.color
                        : rgbaToHex(
                              values.color.metaColor.r,
                              values.color.metaColor.g,
                              values.color.metaColor.b
                          ),
                googleDriveIconId: fileId,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        });
    };

    const handleUpdateProductType = async ({ fileIcon, ...values }: any) => {
        active();
        const file = fileIcon?.fileList[0]?.originFileObj;

        const isDelete = fileIcon?.fileList.length < 1;

        let fileId: UpdateProductTypePayload['googleDriveIconId'] =
            values?.googleDriveIconId;

        if (file) {
            fileId = await uploadApi.uploadFileToDriveV2(
                file,
                GOOGLE_THUMBNAIL_FOLDER_ID
            );
        }
        const payload = {
            ...values,
            code: values.code?.trim().replace(/\s+/g, ''),
            color:
                typeof values.color === 'string'
                    ? values.color
                    : rgbaToHex(
                          values.color.metaColor.r,
                          values.color.metaColor.g,
                          values.color.metaColor.b
                      ),
            googleDriveIconId: fileId,
        };
        if (isDelete) {
            payload.googleDriveIconId = null;
        }

        updateProductType({
            id: data?.id as string,
            payload: {
                ...payload,
            },
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        });
    };

    const handleSubmit = (values: any) => {
        if (data) {
            handleUpdateProductType(values);
        } else {
            handleCreateProductType(values);
        }
    };

    const url = getLinkDriveImage(data?.googleDriveIconId as string);

    useEffect(() => {
        form.setFieldsValue({
            ...data,
            color: data?.color || '#1677ff',
            fileIcon: url
                ? {
                      fileList: [
                          {
                              uid: data?.id,
                              name: data?.nameVi,
                              url: url,
                              status: 'done',
                          },
                      ],
                  }
                : undefined,
        });
    }, [data, url, form]);

    return (
        <AppModal
            width={800}
            open={open}
            title={
                data
                    ? messages('productType.action.update')
                    : messages('productType.action.create')
            }
            onCancel={closeModal}
            onOk={() => form.submit()}
            confirmLoading={isActive}
        >
            <AppForm
                form={form}
                layout="horizontal"
                onFinish={handleSubmit}
                showSubmit={false}
            >
                <AppFormItem
                    name="nameVi"
                    label={messages('productType.name')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    required
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="nameEn"
                    label={messages('productType.name') + ' (EN)'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    required
                >
                    <Input />
                </AppFormItem>

                <AppFormItem
                    name="code"
                    label={messages('common.code')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    required
                >
                    <Input />
                </AppFormItem>

                <AppFormItem
                    name="color"
                    label={messages('common.color')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    required
                >
                    {/* <ColorPicker
                        presets={presetColors}
                        showText
                        format="hex"
                        placement="right"
                    /> */}
                    <AppColorPicker />
                </AppFormItem>
                <AppFormItem
                    name="isThumbnailable"
                    label={messages('productType.isUseThumbailable')}
                >
                    <Switch defaultValue={false} />
                </AppFormItem>
                <AppFormItem name="order" label={messages('topic.order')}>
                    <InputNumber className="!w-full" />
                </AppFormItem>
                <AppFormItem
                    name="fieldType"
                    label={messages('productType.field.fieldType')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                    required
                >
                    <Select>
                        {Object.values(FIELD_TYPE).map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </AppFormItem>
                <AppFormItem
                    name="acceptFile"
                    label={messages('productType.field.acceptFile')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    required
                >
                    {/* <Select>
                        {Object.values(ACCEPT_FILE).map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select> */}
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="note"
                    label={messages('productType.field.note')}
                >
                    <Input.TextArea />
                </AppFormItem>
                <AppFormItem
                    name="fileIcon"
                    label={messages('common.icon')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.image'),
                        },
                    ]}
                >
                    <ImageListUpload maxCount={1} accept="image/*" />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
