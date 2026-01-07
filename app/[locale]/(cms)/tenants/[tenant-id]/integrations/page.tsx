'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ActionButton from '@/components/ui/button/action-button';
import SubmitButton from '@/components/ui/button/submit-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppModal from '@/components/ui/modal/normal-modal';
import AppTable from '@/components/ui/table/normal-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { formattedDate, getRandomInt } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { DSP_DEAL, TYPE_MODAL_DSP } from '@/modules/dsp/enums';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { useTenantDsp } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenantDsp } from '@/modules/tenant/hooks/use-update-tenant';
import { CheckCard } from '@ant-design/pro-components';
import { Alert, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {};

type DataSource = Pick<DspData, 'id' | 'name' | 'picture' | 'updatedAt'> & {
    isActive: boolean;
    isSelected: boolean;
};

function TenantDeals({}: Props) {
    const messages = useTranslations();

    const [dataSource, setDataSource] = useState<DataSource[]>([]);

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore<TYPE_MODAL_DSP>((state) => state.typeModal);

    const { dspData, isFetching } = useGetListDsp({
        pageSize: 999,
    });
    const { dataTenantDsp } = useTenantDsp(tenantId);
    const { updateTenantDsp, isPending } = useUpdateTenantDsp();

    const column: ColumnType<DataSource>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('dsp.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 300,
            render: (value, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? ''}
                            alt="genre"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={value}
                    >
                        <p className="truncate">{value}</p>
                    </CopyText>
                </div>
            ),
        },
        {
            title: messages('integration.deal.label'),
            key: 'deal',
            dataIndex: 'deal',
            width: 180,
            render: (value) => {
                const random = getRandomInt(1, 3);
                if (random === 1)
                    return messages('integration.deal.direct.label');
                if (random === 2)
                    return messages('integration.deal.merlin.label');
                return messages('integration.deal.antmusic.label');
            },
        },
        {
            title: messages('status.label'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 150,
            render: (value, record, index) => (
                <Switch
                    disabled={!record.isSelected}
                    checked={record.isActive}
                    onChange={(value) => {
                        const newDataSource = structuredClone(dataSource);
                        newDataSource[index].isActive = value;
                        setDataSource(newDataSource);
                    }}
                />
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 150,
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            dataIndex: '',
            width: 50,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_DSP.UPDATE, record)
                    }
                />
            ),
        },
    ];

    const onSubmit = () => {
        const data: any[] = [];
        dataSource.forEach((item) => {
            if (item.isSelected) {
                data.push({
                    dspId: item.id,
                    isActive: item.isActive,
                });
            }
        });

        updateTenantDsp({
            payload: { tenantId, data },
        });
    };

    useEffect(() => {
        const newDataSource: DataSource[] = dspData.items?.map((item) => {
            const data = dataTenantDsp.find((i) => i.dsp.id === item.id);
            return {
                id: item.id,
                name: item.name,
                picture: item.picture,
                updatedAt: item.updatedAt,
                isActive: Boolean(data?.isActive),
                isSelected: Boolean(data),
            };
        });
        setDataSource(newDataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(dspData.items), JSON.stringify(dataTenantDsp)]);

    return (
        <div>
            <AppTable
                sticky={{ offsetHeader: 170 }}
                columns={column}
                dataSource={dataSource}
                loading={isFetching}
                rowSelection={{
                    selectedRowKeys: dataSource
                        .filter((item) => item.isSelected)
                        .map((item) => item.id),
                    onChange: (keys) => {
                        setDataSource((prev) =>
                            prev.map((item) => ({
                                ...item,
                                isSelected: keys.some((key) => key === item.id),
                            }))
                        );
                    },
                }}
            />

            <div className="mt-2 text-right">
                <SubmitButton onClick={onSubmit} loading={isPending} />
            </div>

            <AppModal
                title={messages('integration.deal.title')}
                open={typeModal === TYPE_MODAL_DSP.UPDATE}
                width={600}
                footer={null}
                onCancel={closeModal}
            >
                <AppForm
                    layout="vertical"
                    initialValues={{
                        type: DSP_DEAL.ANT_MUSIC,
                    }}
                >
                    <AppFormItem name={'type'}>
                        <CheckCard.Group style={{ width: '100%' }} size="small">
                            <Row gutter={8}>
                                <Col span={8}>
                                    <CheckCard
                                        title={messages(
                                            'integration.deal.antmusic.label'
                                        )}
                                        value={DSP_DEAL.ANT_MUSIC}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <CheckCard
                                        title={messages(
                                            'integration.deal.merlin.label'
                                        )}
                                        value={DSP_DEAL.MERLIN}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <CheckCard
                                        title={messages(
                                            'integration.deal.direct.label'
                                        )}
                                        value={DSP_DEAL.DIRECT}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>
                        </CheckCard.Group>
                    </AppFormItem>
                    <Form.Item
                        shouldUpdate={(pre, cur) => pre.type !== cur.type}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue('type');
                            if (type === DSP_DEAL.ANT_MUSIC) {
                                return (
                                    <Alert
                                        className="!rounded-lg"
                                        banner
                                        type="info"
                                        showIcon
                                        description={messages(
                                            'integration.deal.antmusic.alert'
                                        )}
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
                                        description={messages(
                                            'integration.deal.merlin.alert'
                                        )}
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
                                        <Input placeholder="Enter name" />
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
                                        <Input.Password placeholder="Enter password" />
                                    </AppFormItem>
                                </>
                            );
                        }}
                    </Form.Item>
                </AppForm>
            </AppModal>
        </div>
    );
}

export default TenantDeals;
