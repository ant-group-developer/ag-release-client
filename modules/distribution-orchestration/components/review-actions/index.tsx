import { Button, Input, Modal, Space } from 'antd';
import { Check, RotateCcw, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DISTRIBUTION_STATE } from '../../enums';
import { useApproveReview } from '../../hooks/use-approve-review';
import { useRejectReview } from '../../hooks/use-reject-review';
import { useRetryDistribution } from '../../hooks/use-retry-distribution';

interface Props {
    distributionId: string;
    /** State hiện tại để quyết định nút nào hiện. */
    state?: DISTRIBUTION_STATE;
    onDone?: () => void;
}

/**
 * Nút hành động theo state:
 *  - IN_REVIEW → Approve / Reject (reject nhập note).
 *  - FAILED | PARTIALLY_DISTRIBUTED | ACTION_REQUIRED → Retry.
 */
export default function DistributionReviewActions({
    distributionId,
    state,
    onDone,
}: Props) {
    const messages = useTranslations();
    const [rejectOpen, setRejectOpen] = useState(false);
    const [note, setNote] = useState('');

    const { approveReview, isPending: approving } = useApproveReview();
    const { rejectReview, isPending: rejecting } = useRejectReview();
    const { retryDistribution, isPending: retrying } = useRetryDistribution();

    const canReview = state === DISTRIBUTION_STATE.IN_REVIEW;
    const canRetry =
        state === DISTRIBUTION_STATE.FAILED ||
        state === DISTRIBUTION_STATE.PARTIALLY_DISTRIBUTED ||
        state === DISTRIBUTION_STATE.ACTION_REQUIRED;

    const handleApprove = () =>
        approveReview({ id: distributionId, onSuccess: onDone });

    const handleReject = () =>
        rejectReview({
            id: distributionId,
            payload: { note: note.trim() || undefined },
            onSuccess: () => {
                setRejectOpen(false);
                setNote('');
                onDone?.();
            },
        });

    const handleRetry = () =>
        retryDistribution({ id: distributionId, onSuccess: onDone });

    if (!canReview && !canRetry) return null;

    return (
        <>
            <Space wrap>
                {canReview && (
                    <>
                        <Button
                            type="primary"
                            icon={<Check size={16} />}
                            loading={approving}
                            onClick={handleApprove}
                        >
                            {messages('distributionOrchestration.actions.approve')}
                        </Button>
                        <Button
                            danger
                            icon={<X size={16} />}
                            onClick={() => setRejectOpen(true)}
                        >
                            {messages('distributionOrchestration.actions.reject')}
                        </Button>
                    </>
                )}
                {canRetry && (
                    <Button
                        icon={<RotateCcw size={16} />}
                        loading={retrying}
                        onClick={handleRetry}
                    >
                        {messages('distributionOrchestration.actions.retry')}
                    </Button>
                )}
            </Space>

            <Modal
                open={rejectOpen}
                title={messages('distributionOrchestration.actions.reject')}
                okText={messages('distributionOrchestration.actions.reject')}
                okButtonProps={{ danger: true, loading: rejecting }}
                onOk={handleReject}
                onCancel={() => setRejectOpen(false)}
            >
                <Input.TextArea
                    rows={4}
                    maxLength={2000}
                    showCount
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={messages(
                        'distributionOrchestration.actions.rejectNotePlaceholder'
                    )}
                />
            </Modal>
        </>
    );
}
