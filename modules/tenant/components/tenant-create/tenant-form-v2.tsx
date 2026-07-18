import AppForm, { AppFormProps } from '@/components/ui/antd-form/form';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import UserSelect from '@/modules/user/components/user-select';
import {
    Form,
    Input,
    InputNumber,
    Space,
    Switch,
    theme,
    Typography,
} from 'antd';
import { useTranslations } from 'next-intl';
import { TENANT_TYPE } from '../../enums';
import { TenantData } from '../../types/data';
import TenantSelect from '../tenant-select';
import TenantTypeSelect from '../tenant-type-select';

type Props = {
    excludeIds?: Array<TenantData['id']>;
    wrapperClassName?: string;
    tenantId?: TenantData['id'];
} & AppFormProps;

function TenantFormV2({ excludeIds, wrapperClassName, ...props }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const {
        isAdmin,
        profile: { tenantId },
    } = useAuth();
    const { hasPermission } = usePermission();

    return (
        <AppForm {...props}>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <CollapseItem
                    defaultActiveKey={['general']}
                    items={[
                        {
                            key: 'general',
                            label: (
                                <Typography.Text strong>
                                    General
                                </Typography.Text>
                            ),
                            children: (
                                <>
                                    <AppForm.Item
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
                                        <Input
                                            placeholder={messages(
                                                'tenant.name'
                                            )}
                                            onChange={(e) => {
                                                const slug = e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, '-')
                                                    .replace(/-+/g, '-')
                                                    .replace(/^-|-$/g, '');
                                                props.form?.setFieldValue(
                                                    'code',
                                                    slug
                                                );
                                            }}
                                        />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages('tenant.code')}
                                        rules={[
                                            {
                                                max: 50,
                                                pattern: /^[a-z0-9-]+$/,
                                                message:
                                                    'Only lowercase letters, numbers, and hyphens',
                                            },
                                        ]}
                                        name="code"
                                        tooltip="Slug code used as SFTP watch folder name (e.g. ant-music)"
                                    >
                                        <Input placeholder="ant-music" />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages('tenant.type.title')}
                                        name="type"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <TenantTypeSelect disabled={!isAdmin} />
                                    </AppForm.Item>

                                    <Form.Item
                                        shouldUpdate={(pre, cur) =>
                                            pre.type !== cur.type
                                        }
                                        noStyle
                                    >
                                        {({ getFieldValue }) => {
                                            const type = getFieldValue('type');

                                            if (
                                                type === TENANT_TYPE.WHITE_LABEL
                                            )
                                                return null;

                                            return (
                                                <AppForm.Item
                                                    label={messages(
                                                        'tenant.parent.label'
                                                    )}
                                                    name="parentId"
                                                >
                                                    <TenantSelect
                                                        placeholder={messages(
                                                            'tenant.parent.placeholder'
                                                        )}
                                                        excludeIds={excludeIds}
                                                        type={[
                                                            TENANT_TYPE.WHITE_LABEL,
                                                        ]}
                                                        disabled={!isAdmin}
                                                        allowClear
                                                    />
                                                </AppForm.Item>
                                            );
                                        }}
                                    </Form.Item>

                                    <AppForm.Item
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
                                            disabled={
                                                !hasPermission(
                                                    PERMISSION.WORKSPACE
                                                        .UPDATE_OWNER
                                                )
                                            }
                                            externalOnChange={(
                                                value,
                                                option
                                            ) => {
                                                if (
                                                    props.form &&
                                                    !props.form?.getFieldValue(
                                                        'email'
                                                    )
                                                ) {
                                                    const email = Array.isArray(
                                                        option
                                                    )
                                                        ? option[0]?.email
                                                        : option?.email;
                                                    props.form.setFieldValue(
                                                        'email',
                                                        email
                                                    );
                                                }
                                            }}
                                        />
                                    </AppForm.Item>

                                    <AppForm.Item
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
                                        tooltip={messages(
                                            'tenant.email.tooltip'
                                        )}
                                    >
                                        <Input
                                            placeholder={messages(
                                                'common.email'
                                            )}
                                        />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages(
                                            'tenant.labels.max.label'
                                        )}
                                        rules={[
                                            {
                                                max: 2000,
                                                min: 0,
                                                type: 'number',
                                                transform: (value) =>
                                                    value !== null &&
                                                    value !== undefined &&
                                                    value !== ''
                                                        ? Number(value)
                                                        : value,
                                            },
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                        name="maxLabels"
                                    >
                                        <InputNumber
                                            placeholder={messages(
                                                'tenant.labels.max.label'
                                            )}
                                            disabled={
                                                !hasPermission(
                                                    PERMISSION.WORKSPACE
                                                        .UPDATE_CONFIG
                                                )
                                            }
                                            style={{ width: '100%' }}
                                        />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages('status.label')}
                                        name="isActive"
                                    >
                                        <Switch
                                            disabled={
                                                !hasPermission(
                                                    PERMISSION.WORKSPACE
                                                        .UPDATE_STATUS
                                                )
                                            }
                                        />
                                    </AppForm.Item>
                                </>
                            ),
                        },
                    ]}
                />
                <CollapseItem
                    defaultActiveKey={['metadata']}
                    items={[
                        {
                            key: 'metadata',
                            label: (
                                <Typography.Text strong>
                                    Metadata
                                </Typography.Text>
                            ),
                            children: (
                                <>
                                    <AppForm.Item
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
                                        <Input
                                            placeholder={messages(
                                                'tenant.title'
                                            )}
                                        />
                                    </AppForm.Item>

                                    {/* <AppForm.Item
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
                                        <Input
                                            placeholder={messages(
                                                'tenant.domain'
                                            )}
                                        />
                                    </AppForm.Item> */}

                                    <AppForm.Item
                                        label={messages('tenant.primaryColor')}
                                        name="primaryColor"
                                    >
                                        <AppColorPicker />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages('tenant.icon.label')}
                                        name="icon"
                                    >
                                        <ImageListUpload
                                            maxCount={1}
                                            accept=".png,.svg,.ico"
                                            maxSizeMB={1}
                                            description={
                                                <ul
                                                    className="space-y-1 text-xs"
                                                    style={{
                                                        color: token.colorTextDescription,
                                                    }}
                                                >
                                                    <li>
                                                        {messages(
                                                            'tenant.icon.tooltip1'
                                                        )}
                                                    </li>
                                                    <li>
                                                        {messages(
                                                            'tenant.icon.tooltip2'
                                                        )}
                                                    </li>
                                                    <li>
                                                        {messages(
                                                            'tenant.icon.tooltip3'
                                                        )}
                                                    </li>
                                                </ul>
                                            }
                                        />
                                    </AppForm.Item>

                                    <AppForm.Item
                                        label={messages('tenant.logo')}
                                        name="logo"
                                    >
                                        <ImageListUpload
                                            maxCount={1}
                                            accept=".png,.jpg,.jpeg"
                                            maxSizeMB={2}
                                            description={
                                                <div
                                                    className="space-y-1 text-xs"
                                                    style={{
                                                        color: token.colorTextDescription,
                                                    }}
                                                >
                                                    <p>
                                                        {messages(
                                                            'image.validation.supportImageFormat',
                                                            {
                                                                value: 'PNG, JPG, JPEG',
                                                            }
                                                        )}
                                                    </p>
                                                    <p>
                                                        {messages(
                                                            'image.validation.mustBeLessThanMB',
                                                            {
                                                                value: '2',
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </AppForm.Item>
                                </>
                            ),
                        },
                    ]}
                />
            </Space>
        </AppForm>
    );
}

export default TenantFormV2;
