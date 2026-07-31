'use client';

import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import { Card, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_SOURCE_TYPE_CONFIG } from '../../enums';
import { useDeleteSourceTypeConfig } from '../../hooks/use-delete';
import { useGetSourceTypeConfigs } from '../../hooks/use-get-source-type-configs';
import { SourceTypeConfigData } from '../../types';
import SourceTypeConfigForm from './form';
import SourceTypeConfigTable from './table';

export default function SourceTypeConfigTab() {
    const messages = useTranslations();
    const { sourceTypeConfigsData, isLoading } = useGetSourceTypeConfigs();
    const { deleteSourceTypeConfig } = useDeleteSourceTypeConfig();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<SourceTypeConfigData>(
        (state) => state.dataEdit
    );

    const handleDelete = () => {
        if (!dataEdit?.sourceType) return;
        deleteSourceTypeConfig({
            sourceType: dataEdit.sourceType,
            onSuccess: closeModal,
        });
    };

    return (
        <Card
            title={
                <Space size={8}>
                    <Typography.Text strong className="text-lg">
                        {messages('reportConfigs.sourceTypeConfigs.label')}
                    </Typography.Text>
                </Space>
            }
        >
            <SourceTypeConfigTable
                data={sourceTypeConfigsData}
                loading={isLoading}
            />

            {typeModal === TYPE_MODAL_SOURCE_TYPE_CONFIG.UPDATE && (
                <SourceTypeConfigForm />
            )}

            {typeModal === TYPE_MODAL_SOURCE_TYPE_CONFIG.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={handleDelete}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.label || dataEdit?.sourceType,
                    })}
                />
            )}
        </Card>
    );
}
