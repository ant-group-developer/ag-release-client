import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { SIZE_ICON_SMALL } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { Button, Empty, Space, Tag, Typography } from 'antd';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { formatEnumLabel, getReleaseSubmitStatusColor } from '../../helpers';
import { useGetDetailReleaseSubmit } from '../../hooks/use-get-detail';
import { ReleaseSubmitData, ReleaseSubmitStepData } from '../../types';
import ReleaseSubmitStepDetailModal from '../step-detail-modal';
import ReleaseSubmitStepTable from '../step-table';

type Props = Omit<AppModalProps, 'children'>;

export default function ReleaseSubmitDetailModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const [selectedStep, setSelectedStep] =
        useState<ReleaseSubmitStepData | null>(null);
    const dataEdit = useModalStore<ReleaseSubmitData>(
        (state) => state.dataEdit
    );
    const { releaseSubmitDetail, isFetching, refetch } =
        useGetDetailReleaseSubmit(dataEdit?.id);

    const title = (
        <div className="flex items-center justify-between">
            <Space className="font-semibold">
                <span>
                    {
                        releaseSubmitDetail?.metadata?.input?.releaseSnapshot
                            ?.title
                    }
                </span>
                <Typography.Text type="secondary" className="text-xs">
                    {releaseSubmitDetail?.metadata?.input?.releaseSnapshot?.upc}
                </Typography.Text>
                <Tag
                    color={getReleaseSubmitStatusColor(
                        releaseSubmitDetail?.status
                    )}
                    className="font-normal"
                >
                    {formatEnumLabel(releaseSubmitDetail?.status)}
                </Tag>
            </Space>
            {releaseSubmitDetail && (
                <Button
                    className="mr-6"
                    size="small"
                    onClick={() => refetch()}
                    loading={isFetching}
                    icon={
                        <div>
                            <RotateCcw size={SIZE_ICON_SMALL} />
                        </div>
                    }
                >
                    {messages('common.refresh')}
                </Button>
            )}
        </div>
    );

    return (
        <AppModal
            {...props}
            open={props.open}
            width={1100}
            title={title}
            footer={null}
            spinning={isFetching}
            onCancel={closeModal}
            className="!top-10 !w-[70vw]"
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 150px)',
                    overflowY: 'auto',
                },
            }}
        >
            <div className="mb-4">
                <Typography.Text type="secondary">
                    {releaseSubmitDetail?.summary || ''}
                </Typography.Text>
            </div>

            {releaseSubmitDetail?.steps?.length ? (
                <div>
                    <ReleaseSubmitStepTable
                        dataSource={releaseSubmitDetail.steps}
                        logs={releaseSubmitDetail.logs}
                        onViewDetail={setSelectedStep}
                    />
                </div>
            ) : (
                <Empty />
            )}

            <ReleaseSubmitStepDetailModal
                open={!!selectedStep}
                step={selectedStep}
                logs={releaseSubmitDetail?.logs}
                onCancel={() => setSelectedStep(null)}
            />
        </AppModal>
    );
}
