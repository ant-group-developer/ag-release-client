'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import DistributionChannelsPanel from '@/modules/distribution-orchestration/components/channels-panel';
import DistributionStateTag from '@/modules/distribution-orchestration/components/distribution-state-tag';
import DistributionFlagsPanel from '@/modules/distribution-orchestration/components/flags-panel';
import DistributionReviewActions from '@/modules/distribution-orchestration/components/review-actions';
import SubmitDspModal from '@/modules/distribution-orchestration/components/submit-dsp-modal';
import DistributionTimeline from '@/modules/distribution-orchestration/components/timeline';
import { useGetDistributionByRelease } from '@/modules/distribution-orchestration/hooks';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function DistributionDetailPage() {
    const messages = useTranslations();
    const params = useParams();
    const releaseId = String(params?.releaseId ?? '');

    const { hasPermission } = usePermission();
    const canReview = hasPermission(PERMISSION.RELEASE_REVIEW.REJECT);

    const { releaseData } = useGetDetailRelease(releaseId);
    const { distributionInfo, refetch } =
        useGetDistributionByRelease(releaseId);

    const distributionId = distributionInfo?.distributionId ?? null;
    const state = distributionInfo?.distributionState ?? null;

    const [submitOpen, setSubmitOpen] = useState(false);

    return (
        <AppPageWrapper>
            <PageContainer
                title={
                    releaseData?.title ||
                    messages('distributionOrchestration.label')
                }
                extra={
                    <Space>
                        <DistributionStateTag state={state} />
                        <Button
                            type="primary"
                            icon={<Send size={16} />}
                            onClick={() => setSubmitOpen(true)}
                        >
                            {messages(
                                'distributionOrchestration.actions.submit'
                            )}
                        </Button>
                        {distributionId && (
                            <DistributionReviewActions
                                distributionId={distributionId}
                                state={state ?? undefined}
                                onDone={() => refetch()}
                            />
                        )}
                    </Space>
                }
            >
                <Space direction="vertical" size="small" className="mb-4">
                    <Typography.Text type="secondary">
                        UPC: {releaseData?.upc || '—'}
                    </Typography.Text>
                </Space>

                <Row gutter={16}>
                    <Col xs={24} lg={14}>
                        <Card
                            size="small"
                            title={messages(
                                'distributionOrchestration.timeline.title'
                            )}
                        >
                            <DistributionTimeline
                                distributionId={distributionId ?? undefined}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={10}>
                        <Space
                            direction="vertical"
                            size={16}
                            className="w-full"
                        >
                            <Card size="small">
                                <DistributionChannelsPanel
                                    distributionId={distributionId}
                                />
                            </Card>
                            <Card size="small">
                                <DistributionFlagsPanel
                                    distributionId={distributionId}
                                    canReview={canReview}
                                />
                            </Card>
                        </Space>
                    </Col>
                </Row>

                <SubmitDspModal
                    open={submitOpen}
                    releaseId={releaseId}
                    onClose={() => setSubmitOpen(false)}
                    onSubmitted={() => refetch()}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
