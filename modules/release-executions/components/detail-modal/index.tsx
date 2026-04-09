import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { SIZE_ICON_SMALL } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { Avatar, Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { RELEASE_EXECUTION_STATUS } from '../../enums';
import { getStatusColor } from '../../helpers';
import { useGetDetailReleaseExecution } from '../../hooks/use-get-detail';
import { ExecutionDspData, ReleaseExecutionData } from '../../types';
import ReleaseExecutionStepTable from '../step-table';

type Props = Omit<AppModalProps, 'children'>;

export default function ReleaseExecutionDetailModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ReleaseExecutionData>(
        (state) => state.dataEdit
    );
    const { releaseExecutionDetail, isFetching, refetch } =
        useGetDetailReleaseExecution(dataEdit?.id);

    const isHasExecutionDsps = !!releaseExecutionDetail?.executionDsps;
    const getExecutionStatusLabel = (status?: RELEASE_EXECUTION_STATUS) => {
        if (!status) return;
        return messages(`releaseExecution.statusOptions.${status}`);
    };

    const title = (
        <div className="flex items-center justify-between">
            <Space className="font-semibold">
                <span>{releaseExecutionDetail?.release?.title}</span>
                <Typography.Text type="secondary" className="text-xs">
                    {releaseExecutionDetail?.release?.upc}
                </Typography.Text>
                <Tag
                    bordered={false}
                    color={getStatusColor(releaseExecutionDetail?.status)}
                >
                    {getExecutionStatusLabel(releaseExecutionDetail?.status)}
                </Tag>
            </Space>
            {releaseExecutionDetail && (
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
            className="!top-10"
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                },
            }}
        >
            <div className="mb-4">
                <Typography.Text type="secondary">
                    {releaseExecutionDetail?.summary || ''}
                </Typography.Text>
            </div>

            <div className="space-y-4">
                {isHasExecutionDsps ? (
                    releaseExecutionDetail?.executionDsps?.map(
                        (executionDsp: ExecutionDspData) => {
                            const dsp = executionDsp?.dsp;
                            return (
                                <Card
                                    key={executionDsp.id}
                                    title={
                                        <Space>
                                            {dsp && (
                                                <Avatar
                                                    src={dsp?.picture}
                                                    size={24}
                                                />
                                            )}
                                            {!dsp && (
                                                <div>
                                                    <Typography.Text>
                                                        {messages(
                                                            'release.status.label'
                                                        )}
                                                    </Typography.Text>
                                                </div>
                                            )}
                                            <Typography.Text strong>
                                                {dsp?.name}
                                            </Typography.Text>
                                            <Tag
                                                bordered={false}
                                                color={getStatusColor(
                                                    executionDsp.status
                                                )}
                                            >
                                                {getExecutionStatusLabel(
                                                    executionDsp.status
                                                )}
                                            </Tag>
                                        </Space>
                                    }
                                    size="small"
                                >
                                    <ReleaseExecutionStepTable
                                        dataSource={executionDsp.steps || []}
                                    />
                                </Card>
                            );
                        }
                    )
                ) : (
                    <Empty />
                )}
            </div>
        </AppModal>
    );
}
