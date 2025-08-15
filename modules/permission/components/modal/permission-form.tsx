import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { SIZE_ICON } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Form, Input } from 'antd';
import { Minus, Plus } from 'lucide-react';
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
                    permissions: [{ name: '', value: '' }],
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
                    permissions: [{ name: '', value: '' }],
                });
            }, 0);
        }
    }, [dataEdit, isUpdateForm]);

    return (
        <AppModal
            open
            width={600}
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
                    layout="vertical"
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
                                        max: 100,
                                        message: messages('validation.max', {
                                            number: 100,
                                        }),
                                    },
                                ]}
                            >
                                <Input allowClear />
                            </AppFormItem>
                            <AppFormItem
                                name="value"
                                label={messages('common.value')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                    {
                                        max: 100,
                                        message: messages('validation.max', {
                                            number: 100,
                                        }),
                                    },
                                ]}
                            >
                                <Input allowClear />
                            </AppFormItem>
                        </>
                    ) : (
                        <>
                            <Form.List name="permissions">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(
                                            ({ key, name, ...resField }) => (
                                                <div key={key}>
                                                    <div className="flex items-center justify-between">
                                                        <span>
                                                            {messages(
                                                                'permission.label'
                                                            )}
                                                            {' #'}
                                                            {name + 1}
                                                        </span>
                                                        {fields.length > 1 && (
                                                            <Button
                                                                danger
                                                                size="small"
                                                                icon={
                                                                    <div>
                                                                        <Minus
                                                                            size={
                                                                                SIZE_ICON
                                                                            }
                                                                        />
                                                                    </div>
                                                                }
                                                                onClick={() =>
                                                                    remove(name)
                                                                }
                                                            ></Button>
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
                                                                    max: 100,
                                                                    message:
                                                                        messages(
                                                                            'validation.max',
                                                                            {
                                                                                number: 100,
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
                                                                'value',
                                                            ]}
                                                            label={messages(
                                                                'common.value'
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
                                                                    max: 100,
                                                                    message:
                                                                        messages(
                                                                            'validation.max',
                                                                            {
                                                                                number: 100,
                                                                            }
                                                                        ),
                                                                },
                                                            ]}
                                                        >
                                                            <Input allowClear />
                                                        </AppFormItem>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <Form.Item>
                                            <Button
                                                onClick={() => add()}
                                                block
                                                icon={
                                                    <div>
                                                        <Plus
                                                            size={SIZE_ICON}
                                                        />
                                                    </div>
                                                }
                                                className="mb-2"
                                            >
                                                {messages(
                                                    'action.create.button'
                                                )}{' '}
                                                {messages(
                                                    'permission.label'
                                                ).toLowerCase()}
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </>
                    )}
                </AppForm>
            </div>
        </AppModal>
    );
}
