import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { DSP_DEAL } from '@/modules/dsp/enums';
import { UpdateVariables } from '@/types/api';
import { CheckCard } from '@ant-design/pro-components';
import { Alert, Col, Form, Input, InputNumber, Row, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetDetailIntegration } from '../../hooks/use-get-detail';
import { useUpdateIntegration } from '../../hooks/use-update';
import { IntegrationData } from '../../types';
import { UpdateIntegrationPayload } from '../../types/payload';
type Props = Omit<AppModalProps, 'children'> & {};

export default function IntegrationModalForm({ ...props }: Props) {
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<IntegrationData>((state) => state.dataEdit);

    const { integrationData, isFetching } = useGetDetailIntegration(
        dataEdit?.id
    );
    const { updateIntegration } = useUpdateIntegration();

    const handleOnChangeSetFieldValue = (type: DSP_DEAL) => {
        if (!type) return {};
        const currentConnect = integrationData?.connections?.find(
            (item) => item?.agreementType == type
        );
        if (!currentConnect) return;
        form.setFieldsValue({
            ...currentConnect.credentials,
        });
    };

    const onSubmit = (values: any) => {
        active();
        const { type, ...res } = values;

        if (!type) return;

        const currentConnect = integrationData?.connections?.find(
            (item) => item?.agreementType == type
        );

        const variables: UpdateVariables<
            IntegrationData['id'],
            UpdateIntegrationPayload
        > = {
            id: dataEdit?.id,
            payload: {
                agreementType: type,
                integrationConnections: [
                    {
                        id: currentConnect?.id as string,
                        credentials: { ...res },
                    },
                ],
            },
            onSuccess(e) {
                deActive();
            },
            onError(e) {
                deActive();
            },
        };

        updateIntegration(variables);
    };

    useEffect(() => {
        if (integrationData?.id) {
            form.setFieldsValue({
                type: integrationData?.agreementType,
            });
            const currenOption = integrationData?.connections?.find(
                (item) => item.agreementType === integrationData?.agreementType
            );
            form.setFieldsValue({
                ...currenOption?.credentials,
            });
        }
    }, [integrationData, form]);

    return (
        <AppModal
            {...props}
            title={messages('integration.deal.title')}
            width={'40vw'}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <Spin spinning={isFetching}>
                <AppForm
                    form={form}
                    layout="vertical"
                    showSubmit={false}
                    onFinish={onSubmit}
                    autoComplete="off"
                    disabled={isActive}
                >
                    <AppFormItem name={'type'}>
                        <CheckCard.Group
                            disabled={isActive}
                            style={{ width: '100%' }}
                            size="small"
                            onChange={(e) => {
                                handleOnChangeSetFieldValue(e as any);
                            }}
                        >
                            <Row gutter={8}>
                                {integrationData?.connections?.map((item) => {
                                    return (
                                        <Col key={item?.id} span={6}>
                                            <CheckCard
                                                title={item?.name}
                                                value={item?.agreementType}
                                                style={{ width: '100%' }}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </CheckCard.Group>
                    </AppFormItem>
                    <Form.Item
                        shouldUpdate={(pre, cur) => pre.type !== cur.type}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue('type');
                            if (!type) return;

                            const currentOption =
                                integrationData?.connections?.find(
                                    (item) => item?.agreementType == type
                                );

                            if (type === DSP_DEAL.ANT) {
                                return (
                                    <Alert
                                        className="!rounded-lg"
                                        banner
                                        type="info"
                                        showIcon
                                        description={currentOption?.description}
                                    />
                                );
                            }
                            if (type === DSP_DEAL.MERLIN) {
                                return (
                                    <Alert
                                        className="!rounded-lg"
                                        banner
                                        type="info"
                                        showIcon
                                        description={currentOption?.description}
                                    />
                                );
                            }
                            return (
                                <>
                                    <AppFormItem
                                        label="Host/Server address"
                                        name={'host'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Input placeholder="For ex: example.service.com or 216.81.210.36" />
                                    </AppFormItem>
                                    <AppFormItem
                                        label="Port"
                                        name={'port'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            placeholder="Enter 21 unless you received other instructions"
                                            style={{ width: '100%' }}
                                        />
                                    </AppFormItem>
                                    <AppFormItem
                                        label="Username"
                                        name={'username'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            autoComplete="off"
                                            placeholder="Enter name"
                                        />
                                    </AppFormItem>
                                    <AppFormItem
                                        label="Password"
                                        name={'password'}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            autoComplete="off"
                                            placeholder="Enter password"
                                        />
                                    </AppFormItem>
                                </>
                            );
                        }}
                    </Form.Item>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
