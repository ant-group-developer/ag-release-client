import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useActive } from '@/hooks/use-active';
import { GroupSelect } from '@/modules/group/components';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUpdateSetting } from '../../hooks/use-update-setting';
import { SettingData, SettingPayload, UpdateSetting } from '../../types';

interface Props extends AppFormProps {
    initialData?: SettingData;
}

export default function SettingStatisticForm({ initialData, ...props }: Props) {
    const messages = useTranslations();
    const { updateSetting } = useUpdateSetting();
    const [form] = useForm();
    const { active, deActive, isActive } = useActive();

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

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
            });
        }
    }, [initialData, form]);

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
                    name="statisticOrderGroupIds"
                    label={messages('order.orderGroup')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    {/* <TextArea allowClear /> */}
                    <GroupSelect mode="multiple" allowClear />
                </AppFormItem>
                <AppFormItem
                    name="statisticProductGroupIds"
                    label={messages('product.productGroup')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    {/* <TextArea allowClear /> */}
                    <GroupSelect mode="multiple" allowClear />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
