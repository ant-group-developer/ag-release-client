import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import PermissionSelect from '@/components/ui/select/permission-select';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import { TYPE_MODAL_ROLES } from '../../enums';
import { useCreateRole } from '../../hooks/use-create-role';
import { useDeleteRolePermission } from '../../hooks/use-delete-role-permission';
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
    const { deleteRolePermission } = useDeleteRolePermission();

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

        const rolePermissionObjs = selectedRow.map((id: Key) => ({
            permissionId: id,
        }));

        const payload = {
            ...rest,
            color: hexString,
            rolePermissions: rolePermissionObjs,
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
            rolePermissions: rolePermissionIds,
        };
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
        >
            <div className="max-h-[580px] overflow-auto">
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                >
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
                                message: messages('validation.stringMax', {
                                    number: 100,
                                    field: messages('permission.name'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
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
                        name="rolePermissions"
                        label={messages('permission.label')}
                        required
                    >
                        <PermissionSelect mode="multiple" allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="note"
                        label={messages('common.note')}
                        rules={[
                            {
                                max: 1000,
                                message: messages('validation.stringMax', {
                                    number: 1000,
                                    field: messages('common.note'),
                                }),
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
                    <div>
                        <PermissionTableItemForm rowSelection={rowSelection} />
                    </div>
                </AppForm>
            </div>
        </AppModal>
    );
}
