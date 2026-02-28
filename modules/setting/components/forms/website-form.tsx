import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import {
    ACCEPT_IMAGE,
    MAX_NAME_LENGTH,
    MAX_NOTE_LENGTH,
} from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function WebsiteForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const websiteData = settingConfig?.website;

    const onFinish = async (values: any) => {
        try {
            active();
            const { logo, ...rest } = values;
            const hasFileList = logo?.fileList && logo.fileList.length > 0;
            const file = hasFileList ? logo?.fileList[0].originFileObj : null;

            let logoUrl = '';
            if (file) {
                logoUrl = await uploadApi.uploadFile({
                    file,
                    infoFile: {
                        contentType: file.type,
                        entityType: ENTITY_TYPE_PICTURE.LOGO,
                        fileName: file.name,
                        fileSize: file.size,
                    },
                });
            }

            const payload: UpdateSettingPayload = {
                website: {
                    ...rest,
                    logo: logoUrl ? logoUrl : null,
                },
            };
            if (hasFileList && !file && payload.website) {
                delete (payload.website as { logo?: string }).logo;
            }

            updateSetting({
                payload,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            });
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            ...websiteData,
            logo: websiteData?.logo
                ? {
                      fileList: [
                          {
                              uid: websiteData?.name,
                              thumbUrl: websiteData?.logo,
                              url: websiteData?.logo,
                              name: websiteData?.name,
                          },
                      ],
                  }
                : undefined,
        });
    }, [form, websiteData]);
    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem name="logo" label="Logo">
                    <ImageListUpload
                        maxCount={1}
                        accept={ACCEPT_IMAGE}
                        maxSizeMB={2}
                        disabled={isActive}
                    />
                </AppFormItem>
                <AppFormItem
                    name="name"
                    label={messages('common.name')}
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
                                field: messages('common.name'),
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="title"
                    label={messages('common.title')}
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
                                field: messages('common.title'),
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: messages('common.note'),
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            maxRows: 7,
                            minRows: 3,
                        }}
                    />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
