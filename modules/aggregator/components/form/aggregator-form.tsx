import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_AGGREGATOR } from '../../enums';
import { useCreateAggregator } from '../../hooks/use-create';
import { useGetDetailAggregator } from '../../hooks/use-get-detail';
import { useUpdateAggregator } from '../../hooks/use-update';
import { AggregatorData } from '../../types';
import {
    CreateAggregatorPayload,
    UpdateAggregatorPayload,
} from '../../types/payloads';
import DistributionChannels from './distribution-channels-list';

type AggregatorValues = Pick<
    AggregatorData,
    'code' | 'name' | 'contactEmail' | 'distributionChannels'
>;

type Props = Omit<AppModalProps, 'children'> & {};

export default function AggregatorForm({ ...props }: Props) {
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const typeModal = useModalStore((s) => s.typeModal);
    const dataEdit = useModalStore<AggregatorData>((s) => s.dataEdit);
    const messages = useTranslations();
    const isUpdateForm = typeModal === TYPE_MODAL_AGGREGATOR.UPDATE;

    // apis
    const { createAggregator } = useCreateAggregator();
    const { updateAggregator } = useUpdateAggregator();
    const { aggregatorData, isFetching: DetailLoading } =
        useGetDetailAggregator(dataEdit?.id);

    const modalTitle =
        typeModal === TYPE_MODAL_AGGREGATOR.CREATE
            ? messages('aggregator.action.create')
            : messages('aggregator.action.update');

    const handleCreate = (values: AggregatorValues) => {
        active();
        const variables: CreateVariables<CreateAggregatorPayload> = {
            payload: values,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createAggregator(variables);
    };

    const handleUpdate = (values: AggregatorValues) => {
        active();
        const variables: UpdateVariables<
            AggregatorData['id'],
            UpdateAggregatorPayload
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
        updateAggregator(variables);
    };

    const onFinish = (values: AggregatorValues) => {
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    useEffect(() => {
        if (isUpdateForm) {
            form.setFieldsValue({ ...aggregatorData });
        }
    }, [isUpdateForm, aggregatorData, form]);

    return (
        <AppModal
            {...props}
            title={modalTitle}
            onOk={form.submit}
            loading={isActive}
            width={'50vw'}
            className="!top-4"
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    paddingRight: '4px',
                },
            }}
        >
            <Spin spinning={DetailLoading}>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="vertical"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="name"
                        label={messages('common.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: 200,
                                message: messages('validation.stringMax', {
                                    max: 200,
                                    field: messages('common.name'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>
                    <div className="grid grid-cols-2 gap-4">
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
                            <Input allowClear />
                        </AppFormItem>
                        <AppFormItem
                            name="contactEmail"
                            label={messages('common.email')}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                {
                                    type: 'email',
                                    message: messages('validation.email'),
                                },
                                {
                                    max: MAX_NAME_LENGTH,
                                    message: messages('validation.stringMax', {
                                        max: MAX_NAME_LENGTH,
                                        field: messages('common.email'),
                                    }),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>
                    </div>

                    <DistributionChannels />
                </AppForm>
            </Spin>
        </AppModal>
    );
}
