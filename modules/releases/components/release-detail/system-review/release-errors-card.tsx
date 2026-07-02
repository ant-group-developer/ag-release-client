'use client';

import { SIZE_ICON } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import {
    RELEASE_ERROR_APPROVAL_STATUS,
    RELEASE_ERROR_SUBMISSION_STATUS,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { Alert, Button, Card, theme } from 'antd';
import { Info, Loader2, PackageX, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ReleaseErrorsTable from './release-errors-table';

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
        payload: {
            approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
            submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
        }
    ) => {
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id,
                        ...payload,
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
                    <PackageX className="text-red-500" size={SIZE_ICON} />
                    <span>
                        {messages('release.systemReview.errorsCard.title', {
                            count: releaseEnrichedErrorsData.length,
                        })}
                    </span>
                </div>
            }
            extra={
                <PermissionGate permission={PERMISSION.RELEASE_REVIEW.CREATE}>
                    <div className="flex items-center gap-3">
                        <Button
                            type="primary"
                            onClick={() =>
                                openModal(TYPE_MODAL_RELEASE.CREATE_ERROR)
                            }
                            className="flex items-center gap-1"
                        >
                            <Plus size={14} />
                            {messages(
                                'release.systemReview.errorsCard.addError'
                            )}
                        </Button>
                    </div>
                </PermissionGate>
            }
        >
            {isFetchingEnrichedErrors &&
            releaseEnrichedErrorsData.length === 0 ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            ) : releaseEnrichedErrorsData.length === 0 ? (
                <Alert
                    message={messages(
                        'release.systemReview.errorsCard.qualityPassed'
                    )}
                    description={messages(
                        'release.systemReview.errorsCard.qualityPassedDesc'
                    )}
                    type="info"
                    showIcon
                    icon={<Info size={18} className="text-blue-500" />}
                    className="rounded-lg border border-blue-100 bg-blue-50/50"
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
