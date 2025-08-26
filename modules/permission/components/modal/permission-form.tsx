import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Divider, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useBulkCreatePermission } from '../../hooks/use-bulk-create-permission';
import { useCreatePermission } from '../../hooks/use-create-permission';
import { useUpdatePermission } from '../../hooks/use-update-permission';
import { PermissionData } from '../../types';
import {
    BulkCreatePermissionPayload,
    UpdatePermissionPayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function PermissionFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PermissionData>((state) => state.dataEdit);

    // const
    const isUpdateForm = dataEdit?.id;

    // apis
    const { createPermission } = useCreatePermission();
    const { bulkCreatePermission } = useBulkCreatePermission();
    const { updatePermission } = useUpdatePermission();

    // func
    const handleCreatePermission = (values: any) => {
        const variables: CreateVariables<BulkCreatePermissionPayload> = {
            payload: values,
            onSuccess: () => {
                form.setFieldsValue({
                    permissions: [{ name: '', code: '' }],
                });
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        bulkCreatePermission(variables);
    };
    const handleUpdatePermission = (values: any) => {
        const variables: UpdateVariables<
            PermissionData['id'],
            UpdatePermissionPayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };

        updatePermission(variables);
    };
    const onFinish = (values: any) => {
        active();
        return isUpdateForm
            ? handleUpdatePermission(values)
            : handleCreatePermission(values);
    };

    useEffect(() => {
        if (isUpdateForm) {
            const initialData = {
                ...dataEdit,
            };
            form.setFieldsValue(initialData);
        } else {
            // Hiển thị 1 form đầu iên
            // Delay để đảm bảo Form.List đã render
            setTimeout(() => {
                form.setFieldsValue({
                    permissions: [{ name: '', code: '' }],
                });
            }, 0);
        }
    }, [dataEdit, isUpdateForm, form]);

    return (
        <AppModal
            open
            width={650}
            {...props}
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('permission.label').toLowerCase()} `}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <div className="max-h-[580px] overflow-auto">
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                >
                    {isUpdateForm ? (
                        <>
                            <AppFormItem
                                name="name"
                                label={messages('permission.name')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
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
                                <Input allowClear showCount />
                            </AppFormItem>
                            <AppFormItem
                                name="code"
                                label={messages('common.code')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                    {
                                        max: MAX_NAME_LENGTH,
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                max: MAX_NAME_LENGTH,
                                                field: messages('common.code'),
                                            }
                                        ),
                                    },
                                ]}
                            >
                                <Input allowClear showCount />
                            </AppFormItem>
                            <AppFormItem
                                name="note"
                                label={messages('common.note')}
                                rules={[
                                    {
                                        max: MAX_NOTE_LENGTH,
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                max: MAX_NOTE_LENGTH,
                                                field: messages('common.note'),
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
                                    showCount
                                />
                            </AppFormItem>
                        </>
                    ) : (
                        <>
                            <Form.List name="permissions">
                                {(fields, { add, remove }) => (
                                    <div className="pr-8">
                                        {fields.map(
                                            ({ key, name, ...resField }) => (
                                                <div
                                                    key={key}
                                                    className="relative"
                                                >
                                                    <div className="absolute right-[-32px] top-0">
                                                        {fields.length > 1 && (
                                                            <IconButton
                                                                onClick={() =>
                                                                    remove(name)
                                                                }
                                                            >
                                                                <Trash
                                                                    size={
                                                                        SIZE_ICON
                                                                    }
                                                                    className="text-red-500"
                                                                />
                                                            </IconButton>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <AppFormItem
                                                            {...resField}
                                                            name={[
                                                                name,
                                                                'name',
                                                            ]}
                                                            label={messages(
                                                                'permission.name'
                                                            )}
                                                            required
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        messages(
                                                                            'validation.input'
                                                                        ),
                                                                },
                                                                {
                                                                    max: MAX_NAME_LENGTH,
                                                                    message:
                                                                        messages(
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
                                                            name={[
                                                                name,
                                                                'code',
                                                            ]}
                                                            label={messages(
                                                                'common.code'
                                                            )}
                                                            required
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        messages(
                                                                            'validation.input'
                                                                        ),
                                                                },
                                                                {
                                                                    max: MAX_NAME_LENGTH,
                                                                    message:
                                                                        messages(
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
                                                            name="note"
                                                            label={messages(
                                                                'common.note'
                                                            )}
                                                            rules={[
                                                                {
                                                                    max: 1000,
                                                                    message:
                                                                        messages(
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
                                            )
                                        )}
                                        <AppFormItem label=" ">
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={
                                                    <div>
                                                        <Plus
                                                            size={SIZE_ICON}
                                                        />
                                                    </div>
                                                }
                                                className="mb-2 w-full"
                                            >
                                                {messages(
                                                    'action.create.button'
                                                )}{' '}
                                                {messages(
                                                    'permission.label'
                                                ).toLowerCase()}
                                            </Button>
                                        </AppFormItem>
                                    </div>
                                )}
                            </Form.List>
                        </>
                    )}
                </AppForm>
            </div>
        </AppModal>
    );
}
