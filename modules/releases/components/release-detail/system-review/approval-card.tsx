'use client';

import { showNotification } from '@/helpers/messages-helper';
import { useUpdateReleaseReviewDecision } from '@/modules/releases/hooks/use-update-release-review-decision';
import { RELEASE_REVIEW_STATUS } from '@/modules/releases/enums';
import { Button, Card, Popconfirm, theme } from 'antd';
import { CheckCircle, Shield, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import RejectModal from './reject-modal';

interface ApprovalCardProps {
    releaseId: string;
    releaseEnrichedErrorsCount: number;
}

export default function ApprovalCard({
    releaseId,
    releaseEnrichedErrorsCount,
}: ApprovalCardProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Mutation xử lý cập nhật quyết định duyệt
    const { updateReleaseReviewDecision, isPending: isUpdatingReviewDecision } =
        useUpdateReleaseReviewDecision();

    // Xử lý duyệt thực thi
    const handleApprove = () => {
        updateReleaseReviewDecision({
            id: releaseId,
            payload: {
                status: RELEASE_REVIEW_STATUS.COMPLETED,
            },
            onSuccess: () => {
                showNotification(
                    'success',
                    messages('release.systemReview.approveSuccess')
                );
            },
        });
    };

    // Xử lý từ chối
    const handleRejectSubmit = (reason: string) => {
        updateReleaseReviewDecision({
            id: releaseId,
            payload: {
                status: RELEASE_REVIEW_STATUS.FAILED,
            },
            onSuccess: () => {
                setIsRejectModalOpen(false);
                showNotification(
                    'warning',
                    messages('release.systemReview.rejectSuccess')
                );
            },
        });
    };

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Shield className="text-blue-500" size={20} />
                    <span>{messages('release.systemReview.title')}</span>
                </div>
            }
        >
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                <div className="flex flex-col gap-2 md:col-span-8">
                    <p className="mt-1 text-xs text-gray-400">
                        {messages('release.systemReview.executionNote')}
                    </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:col-span-4">
                    <>
                        <Popconfirm
                            title={
                                releaseEnrichedErrorsCount > 0
                                    ? messages(
                                          'release.systemReview.confirmApproveWithErrors'
                                      )
                                    : messages(
                                          'release.systemReview.confirmApprove'
                                      )
                            }
                            description={
                                releaseEnrichedErrorsCount > 0
                                    ? messages(
                                          'release.systemReview.confirmApproveDescWithErrors'
                                      )
                                    : messages(
                                          'release.systemReview.confirmApproveDesc'
                                      )
                            }
                            onConfirm={handleApprove}
                            okText={
                                releaseEnrichedErrorsCount > 0
                                    ? messages(
                                          'release.systemReview.stillApprove'
                                      )
                                    : messages('common.submit')
                            }
                            cancelText={messages('common.cancel')}
                            okButtonProps={
                                releaseEnrichedErrorsCount > 0
                                    ? {
                                          danger: true,
                                          loading: isUpdatingReviewDecision,
                                      }
                                    : { loading: isUpdatingReviewDecision }
                            }
                            disabled={isUpdatingReviewDecision}
                        >
                            <Button
                                type="primary"
                                loading={isUpdatingReviewDecision}
                                disabled={isUpdatingReviewDecision}
                            >
                                <CheckCircle size={16} />
                                {messages('release.systemReview.approve')}
                            </Button>
                        </Popconfirm>

                        <Button
                            danger
                            onClick={() => setIsRejectModalOpen(true)}
                            disabled={isUpdatingReviewDecision}
                            className="flex items-center gap-1 font-semibold"
                        >
                            <XCircle size={16} />
                            {messages('release.systemReview.reject')}
                        </Button>
                    </>
                </div>
            </div>

            {/* MODAL TỪ CHỐI DUYỆT */}
            <RejectModal
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onReject={handleRejectSubmit}
            />
        </Card>
    );
}
