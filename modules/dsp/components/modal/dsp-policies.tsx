import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ActionsSelect from '@/components/ui/select/actions-select';
import { SIZE_ICON } from '@/constants/common';
import { Button, Form, FormInstance, Radio } from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance<any>;
    isActive: boolean;
};

export default function DspPolicies({ form, isActive }: Props) {
    const messages = useTranslations();
    const handleDefaultChange = (changedIndex: number) => {
        const currentActions = form.getFieldValue('dspActions') || [];
        form.setFieldsValue({
            dspActions: currentActions.map((a: any, i: number) => ({
                ...a,
                isDefault: i === changedIndex,
            })),
        });
    };
    return (
        <>
            <Form.List name="dspActions">
                {(fields, { add, remove }) => (
                    <div className="max-h-[70vh] overflow-auto">
                        {/* <p className="mb-2 font-semibold">
                            {messages('common.policies')}
                        </p> */}

                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key}>
                                <div className="relative flex items-center gap-x-4">
                                    <div className="w-3/6">
                                        <AppFormItem
                                            {...restField}
                                            name={[name, 'actionId']}
                                            required
                                        >
                                            <ActionsSelect allowClear />
                                        </AppFormItem>
                                        <IconButton
                                            onClick={() => {
                                                // const currentProfiles =
                                                //     form.getFieldValue(
                                                //         'dspActions'
                                                //     ) || [];
                                                remove(name);
                                            }}
                                            className="absolute right-0 top-0"
                                            disabled={isActive}
                                        >
                                            <Trash
                                                size={SIZE_ICON}
                                                className="text-red-500"
                                            />
                                        </IconButton>
                                    </div>
                                    <AppFormItem
                                        {...restField}
                                        name={[name, 'isDefault']}
                                    >
                                        <Radio
                                            defaultChecked={false}
                                            checked={form.getFieldValue([
                                                'dspActions',
                                                name,
                                                'isDefault',
                                            ])}
                                            onChange={(e) =>
                                                handleDefaultChange(name)
                                            }
                                        >
                                            {messages('common.setIsDefault')}
                                        </Radio>
                                    </AppFormItem>
                                </div>
                            </div>
                        ))}
                        <div className="mb-4">
                            <Button
                                className="w-full"
                                type="dashed"
                                onClick={() =>
                                    add({
                                        isDefault: false,
                                    })
                                }
                            >
                                + {messages('action.create.button')}{' '}
                                {` ${messages('policy.label').toLowerCase()}`}
                            </Button>
                        </div>
                    </div>
                )}
            </Form.List>
        </>
    );
}
