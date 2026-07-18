import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import { TYPE_MODAL_ROLES } from '../../enums';
import { useCreateRole } from '../../hooks/use-create-role';
import { useUpdateRole } from '../../hooks/use-update-role';
import { RolesData } from '../../types';
import { CreateRolePayload, UpdateRolesPayload } from '../../types/payload';
import PermissionTableItemForm from './permission-table-item-form';

type Props = Omit<AppModalProps, 'children'> & {};

export default function RolesFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<RolesData>((state) => state.dataEdit);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);

    // const
    const isUpdateForm = typeModal == TYPE_MODAL_ROLES.UPDATE;
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 20,
    };

    // apis
    const { createRole } = useCreateRole();
    const { updateRole } = useUpdateRole();
    // const { deleteRolePermission } = useDeleteRolePermission();

    // func
    const handleCreateRoles = (values: any) => {
        try {
            const { ...rest } = values;
            active();

            const payload = {
                ...rest,
            };
            const variables: CreateVariables<CreateRolePayload> = {
                payload,
                onSuccess: () => {
                    deActive();
                    form.resetFields();
                },
                onError: () => {
                    deActive();
                },
            };
            createRole(variables);
        } catch (error) {
            deActive();
        }
    };
    const handleUpdateRoles = (values: any) => {
        const variables: UpdateVariables<RolesData['id'], UpdateRolesPayload> =
            {
                id: dataEdit?.id,
                payload: values,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            };

        updateRole(variables);
    };
    const onFinish = (values: any) => {
        const { color, rolePermissions, ...rest } = values;

        const hexString =
            typeof color === 'string' ? color : color?.toHexString();

        const payload: CreateRolePayload = {
            ...rest,
            color: hexString,
            permissionIds: selectedRow,
        };

        active();
        return isUpdateForm
            ? handleUpdateRoles(payload)
            : handleCreateRoles(payload);
    };

    useEffect(() => {
        // map lại data để hiện ở form update
        const rolePermissionIds = Array.isArray(dataEdit?.rolePermissions)
            ? dataEdit?.rolePermissions
                  .map((rp) => rp?.permissionId || rp?.permission?.id)
                  .filter(Boolean)
            : [];
        const initialData = {
            ...dataEdit,
        };
        setSelectedRow(rolePermissionIds);
        form.setFieldsValue(initialData);
    }, [dataEdit, isUpdateForm, form]);

    return (
        <AppModal
            open
            width={1000}
            {...props}
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('roles.label').toLowerCase()} `}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
            className="!top-5"
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="horizontal"
                disabled={isActive}
            >
                <AppFormItem
                    name="name"
                    label={messages('roles.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('roles.name'),
                            }),
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
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: messages('common.code'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear showCount />
                </AppFormItem>
                <AppFormItem
                    name="color"
                    label={messages('common.color')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <AppColorPicker />
                </AppFormItem>

                <AppFormItem
                    name="note"
                    label={messages('common.note')}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: messages('common.note'),
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            minRows: 1,
                            maxRows: 5,
                        }}
                        showCount
                    />
                </AppFormItem>
                <AppFormItem
                    name="isActive"
                    label={messages('roles.isActive')}
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch />
                </AppFormItem>
                <AppFormItem
                    name="isDefault"
                    label={messages('roles.isDefault')}
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Switch />
                </AppFormItem>
                <div className="mt-8">
                    <PermissionTableItemForm
                        rowSelection={rowSelection}
                        className="rounded-lg border"
                    />
                </div>
            </AppForm>
        </AppModal>
    );
}
