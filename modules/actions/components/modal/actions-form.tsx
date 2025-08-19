import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_ACTIONS } from '../../enums';
import { useCreateAction } from '../../hooks/use-create-action';
import { useUpdateAction } from '../../hooks/use-update-action';
import { ActionsData } from '../../types';
import { CreateActionPayload, UpdateActionPayload } from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function ActionsFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<ActionsData>((state) => state.dataEdit);
    // const [selectedRow, setSelectedRow] = useState<Key[]>([]);

    // const
    const isUpdateForm = typeModal == TYPE_MODAL_ACTIONS.UPDATE;
    // const handleSelectedRow = (selectedRowKeys: Key[]) => {
    //     setSelectedRow(selectedRowKeys);
    // };
    // const rowSelection = {
    //     selectedRowKeys: selectedRow,
    //     onChange: handleSelectedRow,
    //     columnWidth: 20,
    // };

    // apis
    const { createAction } = useCreateAction();
    const { updateAction } = useUpdateAction();

    // func
    const handleCreateActions = (values: any) => {
        try {
            const { ...rest } = values;
            active();

            const payload = {
                ...rest,
            };
            const variables: CreateVariables<CreateActionPayload> = {
                payload,
                onSuccess: () => {
                    deActive();
                    form.resetFields();
                },
                onError: () => {
                    deActive();
                },
            };
            createAction(variables);
        } catch (error) {
            deActive();
        }
    };
    const handleUpdateActions = (values: any) => {
        const variables: UpdateVariables<
            ActionsData['id'],
            UpdateActionPayload
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

        updateAction(variables);
    };
    const onFinish = (values: any) => {
        const { ...rest } = values;

        const payload: CreateActionPayload = {
            ...rest,
        };

        active();
        return isUpdateForm
            ? handleUpdateActions(payload)
            : handleCreateActions(payload);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit, isUpdateForm, form]);

    return (
        <AppModal
            open
            {...props}
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('actions.label').toLowerCase()} `}
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
                        label={messages('actions.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: 100,
                                message: messages('validation.stringMax', {
                                    max: 100,
                                    field: messages('actions.name'),
                                }),
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            onChange={(e) => {
                                const value = e.target.value;
                                form.setFieldValue(
                                    'code',
                                    getCodeFormatted(value)
                                );
                            }}
                        />
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
                                max: 100,
                                message: messages('validation.stringMax', {
                                    max: 100,
                                    field: messages('common.code'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="note"
                        label={messages('common.note')}
                        rules={[
                            {
                                max: 500,
                                message: messages('validation.stringMax', {
                                    max: 200,
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
                </AppForm>
            </div>
        </AppModal>
    );
}
