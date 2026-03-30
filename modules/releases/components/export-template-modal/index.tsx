'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useExportTemplateCi } from '@/modules/releases/hooks/export-template-ci';
import { Button, Form, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const ExportTemplateModal = () => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<string[]>((state) => state.dataEdit);
    const { exportTemplateCi, isPending: isExporting } = useExportTemplateCi();

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: 999,
        aggregatorCode: 'CI',
    });

    const options = dspData?.items?.map((item) => ({
        label: item.name,
        value: item.codeCi,
    }));

    useEffect(() => {
        if (dspData?.items && dspData.items.length > 0) {
            form.setFieldsValue({
                dspIds: dspData.items.map((item) => item.codeCi),
            });
        }
    }, [dspData, form]);

    const onFinish = (values: { dspIds: string[] }) => {
        if (!dataEdit || dataEdit.length === 0) return;

        exportTemplateCi({
            ids: dataEdit,
            dspCodeCi: values.dspIds,
        });
        closeModal();
    };

    return (
        <AppModal
            open
            title={messages('release.exportCiTemplate')}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isExporting}
                    onClick={() => form.submit()}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="dspIds"
                    label={messages('placeholder.selectDsp')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder={messages('placeholder.selectDsp')}
                        options={options}
                        loading={isFetchingDsp}
                    />
                </Form.Item>
            </Form>
        </AppModal>
    );
};

export default ExportTemplateModal;
