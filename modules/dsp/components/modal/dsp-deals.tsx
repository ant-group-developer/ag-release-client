import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import DspTypeSelect from '@/modules/deal-types/components/select/dsp-type-select';
import { DSP_DEAL_VISIBILITY } from '@/modules/dsp-deal/enums';
import { Button, Card, Form, FormInstance, Radio, Switch } from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance<any>;
    isActive: boolean;
};

export default function DspDeals({ form, isActive }: Props) {
    const messages = useTranslations();

    return (
        <>
            <Form.List name="dspDeals">
                {(fields, { add, remove }) => (
                    <div className="max-h-[70vh] space-y-4 overflow-auto">
                        {/* <p className="mb-2 font-semibold">
                            {messages('common.policies')}
                        </p> */}

                        {fields.map(({ key, name, ...restField }, index) => (
                            <Card
                                key={key}
                                title={`#${++index}`}
                                extra={
                                    <IconButton
                                        onClick={() => {
                                            // const currentProfiles =
                                            //     form.getFieldValue(
                                            //         'dspActions'
                                            //     ) || [];
                                            remove(name);
                                        }}
                                        disabled={isActive}
                                    >
                                        <Trash
                                            size={SIZE_ICON}
                                            className="text-red-500"
                                        />
                                    </IconButton>
                                }
                            >
                                <div>
                                    {/* <AppFormItem
                                        {...restField}
                                        name={[name, 'dspId']}
                                        required
                                        label="DspId"
                                    >
                                        <ActionsSelect allowClear />
                                    </AppFormItem> */}
                                    <AppFormItem
                                        {...restField}
                                        name={[name, 'dealTypeId']}
                                        label={messages('dealType.label')}
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
                                        <DspTypeSelect allowClear />
                                    </AppFormItem>

                                    <AppFormItem
                                        {...restField}
                                        name={[name, 'visibility']}
                                        label={messages('common.displayMode')}
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
                                        <Radio.Group>
                                            <Radio
                                                value={
                                                    DSP_DEAL_VISIBILITY.ADMIN_ONLY
                                                }
                                            >
                                                {messages('user.admin')}
                                            </Radio>
                                            <Radio
                                                value={
                                                    DSP_DEAL_VISIBILITY.PUBLIC
                                                }
                                            >
                                                {messages('common.public')}
                                            </Radio>
                                        </Radio.Group>
                                    </AppFormItem>
                                    <AppFormItem
                                        {...restField}
                                        name={[name, 'enabled']}
                                        valuePropName="checked"
                                        label={messages('status.active')}
                                    >
                                        <Switch />
                                    </AppFormItem>
                                </div>
                            </Card>
                        ))}
                        <div>
                            <Button
                                className="w-full"
                                type="dashed"
                                onClick={() =>
                                    add({
                                        enabled: true,
                                    })
                                }
                            >
                                + {messages('action.create.button')}{' '}
                                {` ${messages('common.deal').toLowerCase()}`}
                            </Button>
                        </div>
                    </div>
                )}
            </Form.List>
        </>
    );
}
