import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';

import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { genPreset, rgbaToHex } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import {
    blue,
    cyan,
    gold,
    green,
    grey,
    magenta,
    purple,
    red,
    volcano,
} from '@ant-design/colors';
import { Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_PRIORITY } from '../../enums';
import { useCreatePriority } from '../../hooks/use-create-priority';
import { useUpdatePriority } from '../../hooks/use-update-priority';
import { PriorityData } from '../../types';

type Props = {
    open?: boolean;
    data?: PriorityData;
} & Omit<AppModalProps, 'children'>;

export default function PrioritiesForm({ open, data }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const { isActive, active, deActive } = useActive();
    const { createPriority } = useCreatePriority();
    const modalType = useModalStore((state) => state.typeModal);
    const isUpdateModal = modalType === TYPE_MODAL_PRIORITY.UPDATE;
    const { updatePriority } = useUpdatePriority();

    const presetColors = genPreset({
        purple,
        green,
        magenta,
        blue,
        volcano,
        red,
        cyan,
        gold,
        grey,
    });

    const handleSubmit = async (values: any) => {
        try {
            active();

            if (isUpdateModal && data) {
                updatePriority({
                    priorityId: data.id,
                    payload: {
                        ...values,
                        color:
                            typeof values.color === 'string'
                                ? values.color
                                : rgbaToHex(
                                      values.color.metaColor.r,
                                      values.color.metaColor.g,
                                      values.color.metaColor.b
                                  ),
                    },
                    onSuccess: () => {
                        deActive();
                        closeModal();
                    },
                });
            } else {
                createPriority({
                    payload: {
                        ...values,
                        color:
                            typeof values.color === 'string'
                                ? values.color
                                : rgbaToHex(
                                      values.color.metaColor.r,
                                      values.color.metaColor.g,
                                      values.color.metaColor.b
                                  ),
                    },
                    onSuccess: () => {
                        form.resetFields();
                        deActive();
                        closeModal();
                    },
                });
            }
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        form.setFieldsValue({ ...data, color: data?.color || '#1677ff' });
    }, [data, form]);

    return (
        <AppModal
            open={open}
            onCancel={closeModal}
            title={
                data
                    ? messages('priority.action.update')
                    : messages('priority.action.create')
            }
            onOk={form.submit}
            confirmLoading={isActive}
        >
            <AppForm
                form={form}
                layout="vertical"
                showSubmit={false}
                onFinish={handleSubmit}
            >
                <AppFormItem
                    name="nameVi"
                    label={messages('priority.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="nameEn"
                    label={messages('priority.name') + ' (EN)'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem name="order" label={messages('topic.order')}>
                    <InputNumber className="!w-full" />
                </AppFormItem>

                <AppFormItem
                    name="color"
                    label={messages('priority.color')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <AppColorPicker />
                    {/* <ColorPicker
                        presets={presetColors}
                        format="hex"
                        showText
                        placement="right"
                    /> */}
                </AppFormItem>

                <AppFormItem
                    name="note"
                    label={messages('priority.note')}
                    rules={[
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
                            }),
                        },
                    ]}
                >
                    <TextArea
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 7 }}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
