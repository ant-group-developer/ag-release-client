import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import NewsCategoryTreeSelect from '@/components/ui/select/news-category-tree-select';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { SCREEN } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateNewsCategory } from '../../hooks/use-create';
import { useUpdateNewsCategory } from '../../hooks/use-update';
import { NewsCategoryData } from '../../types';
import {
    CreateNewsCategoryPayload,
    UpdateNewsCategoryPayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function NewsCategoryFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as NewsCategoryData
    );
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createNewsCategory } = useCreateNewsCategory();
    const { updateNewsCategory } = useUpdateNewsCategory();

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<
            NewsCategoryData['id'],
            UpdateNewsCategoryPayload
        > = {
            id: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateNewsCategory(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateNewsCategoryPayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createNewsCategory(variables);
    };

    const onFinish = async (values: any) => {
        const { ...res } = values;

        active();

        const payloadValues = {
            ...res,
            parentId: res.parentId || null,
        };

        return isUpdateModal
            ? handleUpdate(payloadValues)
            : handleCreate(payloadValues);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={SCREEN.LG}
            {...props}
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('newsCategory.label').toLowerCase()}`}
            open
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
                className="grid grid-cols-2 gap-4"
            >
                <AppFormItem
                    className="col-span-2"
                    name="parentId"
                    label={messages('newsCategory.parentLabel')}
                >
                    <NewsCategoryTreeSelect
                        placeholder={messages('newsCategory.parentPlaceholder')}
                        excludeId={dataEdit?.id}
                    />
                </AppFormItem>

                <AppFormItem
                    name="nameVi"
                    label={`${messages('newsCategory.name')} Vi`}
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
                                field: messages('newsCategory.name'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="nameEn"
                    label={`${messages('newsCategory.name')} En`}
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
                                field: messages('newsCategory.name'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="descriptionVi"
                    label={`${messages('common.description')} Vi`}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: `${messages('common.description')} Vi`,
                            }),
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
                <AppFormItem
                    className="!mb-6"
                    name="descriptionEn"
                    label={`${messages('common.description')} En`}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: `${messages('common.description')} En`,
                            }),
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
            </AppForm>
        </AppModal>
    );
}
