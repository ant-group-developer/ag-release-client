'use client';

import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE, RELEASE_ERROR_APPROVAL_STATUS } from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { Alert, Button, Card, theme } from 'antd';
import { CheckCircle, Loader2, PackageX, Plus } from 'lucide-react';
import ReleaseErrorsTable from './release-errors-table';
import { useTranslations } from 'next-intl';


// Wait, let's verify if import path is correct: use-bulk-update-release-errors
// Yes: useBulkUpdateReleaseErrors is in @/modules/releases/hooks/use-bulk-update-release-errors

interface ReleaseErrorsCardProps {
    releaseId: string;
    releaseEnrichedErrorsData: ReleaseEnrichedError[];
    isFetchingEnrichedErrors: boolean;
}

export default function ReleaseErrorsCard({
    releaseId,
    releaseEnrichedErrorsData,
    isFetchingEnrichedErrors,
}: ReleaseErrorsCardProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const openModal = useModalStore((state) => state.openModal);
    const { bulkUpdateReleaseErrors } = useBulkUpdateReleaseErrors();

    const handleUpdateError = (
        id: string,
        approvalStatus: RELEASE_ERROR_APPROVAL_STATUS
    ) => {
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id,
                        approvalStatus,
                    },
                ],
            },
        });
    };

    return (
        <Card
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
            title={
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <PackageX className="text-red-500" size={20} />
                    <span>
                        {messages('release.systemReview.errorsCard.title', { count: releaseEnrichedErrorsData.length })}
                    </span>
                </div>
            }
            extra={
                <div className="flex items-center gap-3">
                    <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                            openModal(TYPE_MODAL_RELEASE.CREATE_ERROR)
                        }
                        className="flex items-center gap-1"
                    >
                        <Plus size={14} />
                        {messages('release.systemReview.errorsCard.addError')}
                    </Button>
                </div>
            }
        >
            {isFetchingEnrichedErrors &&
            releaseEnrichedErrorsData.length === 0 ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            ) : releaseEnrichedErrorsData.length === 0 ? (
                <Alert
                    message={messages('release.systemReview.errorsCard.qualityPassed')}
                    description={messages('release.systemReview.errorsCard.qualityPassedDesc')}
                    type="success"
                    showIcon
                    icon={
                        <CheckCircle size={18} className="text-emerald-500" />
                    }
                    className="rounded-lg border border-emerald-100 bg-emerald-50/50"
                />
            ) : (
                <div className="flex flex-col gap-4">
                    <ReleaseErrorsTable
                        data={releaseEnrichedErrorsData}
                        onUpdateError={handleUpdateError}
                    />
                </div>
            )}
        </Card>
    );
}
