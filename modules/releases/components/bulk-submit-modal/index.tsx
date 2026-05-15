'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useBulkSubmitRelease } from '@/modules/releases/hooks/use-bulk-submit-release';
import { Button, Form, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface BulkSubmitModalProps {
    onFinished?: () => void;
}

const BulkSubmitModal = ({ onFinished }: BulkSubmitModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<string[]>((state) => state.dataEdit);
    const { bulkSubmitRelease, isPending: isSubmitting } =
        useBulkSubmitRelease();

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        aggregatorCode: 'CI',
    });

    const dspDataFilter = dspData?.items?.filter((item) => !!item.codeCi);

    const options = dspDataFilter?.map((item) => {
        return {
            label: item.name,
            value: item.codeCi,
        };
    });

    useEffect(() => {
        if (dspDataFilter && dspDataFilter.length > 0) {
            form.setFieldsValue({
                dspIds: dspDataFilter.map((item) => item.codeCi),
            });
        }
    }, [dspDataFilter, form]);

    const onFinish = (values: { dspIds: string[] }) => {
        if (!dataEdit || dataEdit.length === 0) return;

        bulkSubmitRelease({
            payload: {
                ids: dataEdit,
                codes: values.dspIds,
            },
            onSuccess: () => {
                closeModal();
                onFinished?.();
            },
        });
    };

    return (
        <AppModal
            open
            title={messages('release.bulkSubmit')}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={() => form.submit()}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
            spinning={isFetchingDsp}
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

export default BulkSubmitModal;
