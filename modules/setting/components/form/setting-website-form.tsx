import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { useActive } from '@/hooks/use-active';
import { useGetUrlUpload } from '@/hooks/use-get-url-upload';
import { useUpdateSetting } from '@/modules/setting/hooks/use-update-setting';
import {
    SettingData,
    SettingPayload,
    UpdateSetting,
} from '@/modules/setting/types';
import { Button, Input, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCodeSort } from '../../hooks/use-gen-code-sort';

interface Props extends AppFormProps {
    initialData?: SettingData;
}

export const SettingWebSiteForm = ({ initialData, ...props }: Props) => {
    const messages = useTranslations();
    const { updateSetting } = useUpdateSetting();
    const { getUrlUpload } = useGetUrlUpload();
    const { genCodeSort, isPending } = useCodeSort();
    const [form] = useForm();
    const { active, deActive, isActive } = useActive();

    const handleGenCodeSort = async () => {
        genCodeSort();
    };

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
                logo: initialData?.logo
                    ? {
                          fileList: [
                              {
                                  uid: '1',
                                  name: 'image.png',
                                  url: initialData.logo,
                              },
                          ],
                      }
                    : undefined,
            });
        }
    }, [initialData, form]);

    const onFinish = async (values: any) => {
        active();
        values = await form.validateFields();
        const { logo, ...res } = values;
        const logoImage = values?.logo?.fileList[0]?.originFileObj;

        const submitKey = logoImage
            ? await getUrlUpload({
                  payload: {
                      infoFile: {
                          fileName: logoImage.name,
                          fileSizeInByte: logoImage.size,
                          extension: logoImage.name.split('.').pop(),
                          contentType: logoImage.type,
                      },
                      file: logoImage,
                  },
                  onError: () => {
                      deActive();
                  },
              })
            : '';

        const dataUpdate: SettingPayload = {
            ...res,
            telegramSupport:
                values.telegramSupport === '' ? null : values.telegramSupport,
            tokenTelegramBot:
                values.tokenTelegramBot === '' ? null : values.tokenTelegramBot,
            linkStartBot:
                values.linkStartBot === '' ? null : values.linkStartBot,
            heartbeatReceiverIds:
                values.heartbeatReceiverIds === ''
                    ? null
                    : values.heartbeatReceiverIds,
        };

        if (logoImage) {
            dataUpdate.logo = submitKey;
        } else if (logo?.fileList?.length < 1) {
            dataUpdate.logo = null;
        }

        const variables: UpdateSetting = {
            payload: dataUpdate,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateSetting(variables);
    };

    return (
        <div className="px-2 lg:w-[800px]">
            <AppForm
                {...props}
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                disabled={isActive}
            >
                <AppFormItem
                    name="website"
                    label="Website"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="deadline"
                    label="Deadline"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </AppFormItem>
                <AppFormItem
                    name="telegramSupport"
                    label={messages('setting.telegramSupportLink')}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="tokenTelegramBot" label="Token telegram">
                    <Input.Password allowClear />
                </AppFormItem>
                <AppFormItem name="linkStartBot" label="Link chat bot">
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="heartbeatReceiverIds" label="Telegram ID">
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem label="Gen code sort">
                    <Button
                        onClick={() => handleGenCodeSort()}
                        type="primary"
                        loading={isPending}
                    >
                        Generate
                    </Button>
                </AppFormItem>

                <AppFormItem
                    name="guideFileGoogleDriveId"
                    label={`${messages('common.guide')} file ID`}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="logo"
                    label="Logo"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <ImageListUpload maxCount={1} />
                </AppFormItem>
            </AppForm>
        </div>
    );
};
