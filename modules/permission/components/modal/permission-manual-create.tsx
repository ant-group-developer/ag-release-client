'use client';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { Button, Divider, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PermissionManualCreate() {
    const messages = useTranslations();

    return (
        <Form.List name="permissions">
            {(fields, { add, remove }) => (
                <div className="pr-8">
                    {fields.map(({ key, name, ...resField }) => (
                        <div key={key} className="relative">
                            <div className="absolute right-[-32px] top-0">
                                {fields.length > 1 && (
                                    <IconButton onClick={() => remove(name)}>
                                        <Trash
                                            size={SIZE_ICON}
                                            className="text-red-500"
                                        />
                                    </IconButton>
                                )}
                            </div>
                            <div>
                                <AppFormItem
                                    {...resField}
                                    name={[name, 'name']}
                                    label={messages('permission.name')}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                        {
                                            max: MAX_NAME_LENGTH,
                                            message: messages(
                                                'validation.stringMax',
                                                {
                                                    max: MAX_NAME_LENGTH,
                                                    field: messages(
                                                        'permission.name'
                                                    ),
                                                }
                                            ),
                                        },
                                    ]}
                                >
                                    <Input allowClear />
                                </AppFormItem>
                                <AppFormItem
                                    {...resField}
                                    name={[name, 'code']}
                                    label={messages('common.code')}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                        {
                                            max: MAX_NAME_LENGTH,
                                            message: messages(
                                                'validation.stringMax',
                                                {
                                                    max: MAX_NAME_LENGTH,
                                                    field: messages(
                                                        'common.code'
                                                    ),
                                                }
                                            ),
                                        },
                                    ]}
                                >
                                    <Input allowClear />
                                </AppFormItem>
                                <AppFormItem
                                    name={[name, 'note']}
                                    label={messages('common.note')}
                                    rules={[
                                        {
                                            max: 1000,
                                            message: messages(
                                                'validation.stringMax',
                                                {
                                                    max: 1000,
                                                    field: messages(
                                                        'common.note'
                                                    ),
                                                }
                                            ),
                                        },
                                    ]}
                                >
                                    <TextArea
                                        autoSize={{
                                            minRows: 3,
                                            maxRows: 7,
                                        }}
                                    />
                                </AppFormItem>
                            </div>
                            <Divider />
                        </div>
                    ))}
                    <AppFormItem label=" ">
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={
                                <div>
                                    <Plus size={SIZE_ICON} />
                                </div>
                            }
                            className="mb-2 w-full"
                        >
                            {messages('action.create.button')}{' '}
                            {messages('permission.label').toLowerCase()}
                        </Button>
                    </AppFormItem>
                </div>
            )}
        </Form.List>
    );
}
