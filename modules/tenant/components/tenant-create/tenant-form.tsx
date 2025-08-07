import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import UserSelect from '@/modules/user/components/user-select';
import { Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import TenantSelect from '../tenant-select';
import TenantTypeSelect from '../tenant-type-select';

type Props = {
    isCreate?: boolean;
} & AppFormProps;

function TenantForm({ isCreate, ...props }: Props) {
    const messages = useTranslations();
    return (
        <AppForm layout="vertical" {...props}>
            <AppFormItem
                label={messages('tenant.name')}
                required
                rules={[
                    {
                        whitespace: true,
                        required: true,
                        max: 50,
                        min: 3,
                    },
                ]}
                name="name"
            >
                <Input placeholder={messages('tenant.name')} />
            </AppFormItem>

            <AppFormItem
                label={messages('tenant.parent.label')}
                name="parentId"
            >
                <TenantSelect
                    placeholder={messages('tenant.parent.placeholder')}
                />
            </AppFormItem>

            <AppFormItem
                label={messages('tenant.owner')}
                name="ownerId"
                required
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <UserSelect
                    externalOnChange={(value, option) => {
                        if (props.form && !props.form?.getFieldValue('email')) {
                            const email = Array.isArray(option)
                                ? option[0]?.email
                                : option?.email;
                            props.form.setFieldValue('email', email);
                        }
                    }}
                />
            </AppFormItem>

            <AppFormItem
                label={messages('common.email')}
                required
                rules={[
                    {
                        whitespace: true,
                        required: true,
                        type: 'email',
                    },
                ]}
                name="email"
                tooltip={messages('tenant.email.tooltip')}
            >
                <Input placeholder={messages('common.email')} />
            </AppFormItem>

            <AppFormItem
                label={messages('tenant.type.title')}
                name="type"
                required
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <TenantTypeSelect />
            </AppFormItem>

            <AppFormItem
                label={messages('tenant.title')}
                rules={[
                    {
                        whitespace: true,
                        max: 100,
                        min: 3,
                    },
                ]}
                name="title"
            >
                <Input placeholder={messages('tenant.title')} />
            </AppFormItem>

            <AppFormItem
                label={messages('tenant.domain')}
                rules={[
                    {
                        whitespace: true,
                        max: 50,
                        min: 3,
                    },
                ]}
                name="domain"
            >
                <Input placeholder={messages('tenant.domain')} />
            </AppFormItem>

            <AppFormItem label={messages('status.label')} name="isActive">
                <Switch />
            </AppFormItem>

            <div className="flex items-center gap-4">
                <AppFormItem label={messages('tenant.icon')} name="icon">
                    <ImageListUpload
                        maxCount={1}
                        accept=".png,.jpg,.jpeg"
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
                            value: '2',
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <AppFormItem label={messages('tenant.logo')} name="logo">
                    <ImageListUpload
                        maxCount={1}
                        accept=".png,.jpg,.jpeg"
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
                            value: '2',
                        })}
                    </p>
                </div>
            </div>

            <AppFormItem
                label={messages('tenant.primaryColor')}
                name="primaryColor"
            >
                <AppColorPicker />
            </AppFormItem>
        </AppForm>
    );
}

export default TenantForm;
