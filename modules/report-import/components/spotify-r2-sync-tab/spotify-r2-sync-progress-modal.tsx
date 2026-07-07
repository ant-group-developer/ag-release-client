'use client';

import { Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { useGetImportJobStatus } from '../../hooks/use-get-import-job-status';
import { ImportJobColumn } from '../import-tab/import-job-column';

interface SpotifyR2SyncProgressModalProps {
    open: boolean;
    onClose: () => void;
    jobId: string | null;
}

export default function SpotifyR2SyncProgressModal({
    open,
    onClose,
    jobId,
}: SpotifyR2SyncProgressModalProps) {
    const messages = useTranslations();
    const { jobStatus } = useGetImportJobStatus(jobId as string);

    return (
        <Modal
            title={messages(
                'reportConfigs.spotifyR2SyncConfig.syncProgressTitle'
            )}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={600}
        >
            <div style={{ marginTop: 16 }}>
                {jobStatus ? (
                    <ImportJobColumn
                        jobStatus={jobStatus}
                        validationResult={null}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: 24 }}>
                        {messages('common.loading') || 'Loading...'}
                    </div>
                )}
            </div>
        </Modal>
    );
}
