import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateYoutubeKey } from '../../hooks/use-create-youtube-key';
import { useGetYoutubeKeyDetail } from '../../hooks/use-get-youtube-key-detail';
import { useUpdateYoutubeKey } from '../../hooks/use-update-youtube-key';
import {
    CreateYoutubeKeyPayload,
    UpdateYoutubeKeyPayload,
    YoutubeKeyData,
} from '../../types';

import { YOUTUBE_KEY_STATUS } from '../../enums';

type YoutubeKeyFormValues = {
    alias: string;
    apiKey?: string;
    status?: YOUTUBE_KEY_STATUS;
    dailyQuotaLimit: number;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function YoutubeKeyFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<YoutubeKeyFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as YoutubeKeyData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();

    const { createYoutubeKey } = useCreateYoutubeKey();
    const { updateYoutubeKey } = useUpdateYoutubeKey();
    const { youtubeKeyDetail, isLoading: isLoadingDetail } =
        useGetYoutubeKeyDetail(dataEdit?.id);

    const handleCreateYoutubeKey = (values: YoutubeKeyFormValues) => {
        const variables: CreateVariables<CreateYoutubeKeyPayload> = {
            payload: {
                alias: values.alias,
                apiKey: values.apiKey || '',
                dailyQuotaLimit: values.dailyQuotaLimit,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        createYoutubeKey(variables);
    };

    const handleUpdateYoutubeKey = (values: YoutubeKeyFormValues) => {
        const variables: UpdateVariables<string, UpdateYoutubeKeyPayload> = {
            id: dataEdit.id,
            payload: {
                alias: values.alias,
                status: values.status,
                dailyQuotaLimit: values.dailyQuotaLimit,
            },
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        updateYoutubeKey(variables);
    };

    const onfinish = (values: YoutubeKeyFormValues) => {
        active();
        try {
            return isUpdateForm
                ? handleUpdateYoutubeKey(values)
                : handleCreateYoutubeKey(values);
        } catch (error) {
            deActive();
        }
    };

    const modalTitle = () => {
        return `${isUpdateForm ? messages('common.update') : messages('common.create')} ${messages('youtubeKeys.label').toLocaleLowerCase()}`;
    };

    useEffect(() => {
        if (isUpdateForm && youtubeKeyDetail) {
            form.setFieldsValue({
                alias: youtubeKeyDetail.alias,
                status: youtubeKeyDetail.status as any,
                dailyQuotaLimit: youtubeKeyDetail.dailyQuotaLimit,
            });
        } else if (dataEdit) {
            form.setFieldsValue({
                alias: dataEdit.alias,
                status: dataEdit.status as any,
                dailyQuotaLimit: dataEdit.dailyQuotaLimit,
            });
        } else {
            form.resetFields();
        }
    }, [dataEdit, youtubeKeyDetail, isUpdateForm]);

    const isPending = isActive || isLoadingDetail;

    return (
        <AppModal
            width={500}
            {...props}
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isPending}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onfinish}
                layout="vertical"
                disabled={isPending}
            >
                <AppFormItem
                    name="alias"
                    label={messages('youtubeKeys.alias')}
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
                                field: messages('youtubeKeys.alias'),
                            }),
                        },
                    ]}
                >
                    <Input
                        placeholder={messages('youtubeKeys.alias')}
                        allowClear
                    />
                </AppFormItem>

                {!isUpdateForm && (
                    <AppFormItem
                        name="apiKey"
                        label={messages('youtubeKeys.apiKey')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages('youtubeKeys.apiKey')}
                            allowClear
                        />
                    </AppFormItem>
                )}

                {isUpdateForm && (
                    <AppFormItem
                        name="status"
                        label={messages('youtubeKeys.status')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select
                            placeholder={messages('status.select')}
                            options={[
                                {
                                    value: YOUTUBE_KEY_STATUS.ACTIVE,
                                    label: messages('status.active'),
                                },
                                {
                                    value: YOUTUBE_KEY_STATUS.DISABLED,
                                    label: messages('status.disabled'),
                                },
                            ]}
                        />
                    </AppFormItem>
                )}

                <AppFormItem
                    name="dailyQuotaLimit"
                    label={messages('youtubeKeys.dailyQuotaLimit')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber
                        className="!w-full"
                        placeholder={messages('youtubeKeys.dailyQuotaLimit')}
                        min={0}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
