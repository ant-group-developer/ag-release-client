import AppFormItem from '@/components/ui/antd-form/form-Item';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import DspSelect from '@/modules/dsp/components/select/dsp-select';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Typography,
} from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DISTRIBUTION_CHANNEL_PROTOCOL } from '../../enums';
type Props = {};

export default function DistributionChannels({}: Props) {
    const messages = useTranslations();
    // const
    const protocolOptions = Object.values(DISTRIBUTION_CHANNEL_PROTOCOL).map(
        (value) => ({
            label: value,
            value,
        })
    );

    const commonValidate = [
        {
            required: true,
            message: messages('validation.input'),
        },
        {
            max: MAX_NAME_LENGTH,
            message: messages('validation.max', {
                number: MAX_NAME_LENGTH,
            }),
        },
    ];

    return (
        <Form.List name="distributionChannels">
            {(fields, { add, remove }) => {
                return (
                    <div className="space-y-4">
                        <Typography.Text className="!text-base font-semibold">
                            Distribution Channels
                        </Typography.Text>
                        {fields?.map(({ key, name }, index) => (
                            <Card
                                title={`#${++index}`}
                                key={key}
                                extra={
                                    <Button
                                        onClick={() => remove(name)}
                                        danger
                                        icon={
                                            <div>
                                                <Trash size={SIZE_ICON} />
                                            </div>
                                        }
                                    />
                                }
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* <AppFormItem
                                        name={[name, 'tenantId']}
                                        label={messages('tenant.label')}
                                        className="col-span-2"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <TenantSelect />
                                    </AppFormItem> */}

                                    <AppFormItem
                                        name={[name, 'dspId']}
                                        label={'DSP'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <DspSelect />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'protocol']}
                                        label={'Protocol'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Select options={protocolOptions} />
                                    </AppFormItem>
                                    <AppFormItem
                                        name={[name, 'isActive']}
                                        label={messages('common.status')}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'isSystemDefault']}
                                        label={messages(
                                            'aggregator.systemDefault'
                                        )}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'credentials', 'host']}
                                        label="Host"
                                        required
                                        rules={commonValidate}
                                    >
                                        <Input allowClear />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'credentials', 'port']}
                                        label="Port"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <InputNumber />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'credentials', 'username']}
                                        label={messages('common.username')}
                                        required
                                        rules={commonValidate}
                                    >
                                        <Input allowClear />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'credentials', 'password']}
                                        label={messages('common.password')}
                                        required
                                        rules={commonValidate}
                                    >
                                        <Input.Password />
                                    </AppFormItem>

                                    <AppFormItem
                                        name={[name, 'credentials', 'path']}
                                        label={messages('common.path')}
                                        className="col-span-2"
                                        required
                                        rules={commonValidate}
                                    >
                                        <Input
                                            allowClear
                                            placeholder="/upload"
                                        />
                                    </AppFormItem>
                                </div>
                            </Card>
                        ))}

                        <Button
                            className="mt-4"
                            type="dashed"
                            block
                            onClick={() =>
                                add({
                                    isActive: false,
                                    isSystemDefault: false,
                                })
                            }
                        >
                            + {messages('common.add')}
                        </Button>
                    </div>
                );
            }}
        </Form.List>
    );
}
