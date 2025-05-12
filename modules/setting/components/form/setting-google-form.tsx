import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useActive } from '@/hooks/use-active';
import { useUpdateSetting } from '@/modules/setting/hooks/use-update-setting';
import {
    SettingData,
    SettingPayload,
    UpdateSetting,
} from '@/modules/setting/types';
import { Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

interface Props extends AppFormProps {
    initialData?: SettingData;
}

export const SettingGoogleForm = ({ initialData, ...props }: Props) => {
    const { updateSetting } = useUpdateSetting();
    const [form] = useForm();
    const { active, deActive, isActive } = useActive();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
            });
        }
    }, [initialData, form]);

    const onFinish = async (values: any) => {
        active();
        values = await form.validateFields();

        const dataUpdate: SettingPayload = {
            ...values,
        };

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
                <AppFormItem name="googleClientId" label="Client ID">
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="googleClientSecret" label="Client secret">
                    <Input.Password allowClear />
                </AppFormItem>
                <AppFormItem name="googleRedirectUri" label="Redirect Uri">
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="googleOauthScope" label="Oauth scope">
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="googleIllustrativeFolderId"
                    label="Illustrative folder ID"
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="googleThumbnailFolderId"
                    label="Thumbnail folder ID"
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="googleRootFolderId" label="Root folder ID">
                    <Input allowClear />
                </AppFormItem>
            </AppForm>
        </div>
    );
};
