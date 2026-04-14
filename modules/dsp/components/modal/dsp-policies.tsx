import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ActionsSelect from '@/components/ui/select/actions-select';
import { SIZE_ICON } from '@/constants/common';
import { Button, Form, FormInstance, Radio, Table } from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance<any>;
    isActive: boolean;
};

export default function DspPolicies({ form, isActive }: Props) {
    const messages = useTranslations();
    const watchedActions = Form.useWatch('dspActions', form) || [];

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
                        <Table
                            dataSource={fields.map((field) => ({
                                ...field,
                                fieldKey: field.key,
                            }))}
                            rowKey="key"
                            pagination={false}
                            size="small"
                            bordered
                            columns={[
                                {
                                    title: '#',
                                    width: 50,
                                    align: 'center' as const,
                                    render: (
                                        _: any,
                                        __: any,
                                        index: number
                                    ) => <span>{index + 1}</span>,
                                },
                                {
                                    title: messages('policy.label'),
                                    render: (_: any, field: any) => (
                                        <AppFormItem
                                            name={[field.name, 'actionId']}
                                            required
                                            noStyle
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
                                            <ActionsSelect
                                                allowClear
                                                className="w-full"
                                            />
                                        </AppFormItem>
                                    ),
                                },
                                {
                                    title: messages('common.setIsDefault'),
                                    width: 140,
                                    align: 'center' as const,
                                    render: (_: any, field: any) => (
                                        <AppFormItem
                                            name={[field.name, 'isDefault']}
                                            noStyle
                                        >
                                            <Radio
                                                checked={
                                                    watchedActions[field.name]
                                                        ?.isDefault
                                                }
                                                onChange={() =>
                                                    handleDefaultChange(
                                                        field.name
                                                    )
                                                }
                                            />
                                        </AppFormItem>
                                    ),
                                },
                                {
                                    title: '',
                                    width: 50,
                                    align: 'center' as const,
                                    render: (_: any, field: any) => (
                                        <IconButton
                                            type="button"
                                            onClick={() => remove(field.name)}
                                            disabled={isActive}
                                        >
                                            <Trash
                                                size={SIZE_ICON}
                                                className="text-red-500"
                                            />
                                        </IconButton>
                                    ),
                                },
                            ]}
                        />

                        <div className="my-4">
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
