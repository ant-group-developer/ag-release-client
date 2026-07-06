'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Tag, theme } from 'antd';
import { useTranslations } from 'next-intl';
import {
    IMPORT_JOBS_STATUS,
    ImportJobStatusResponse,
} from '../../types/payload';

interface SpotifyR2SyncProgressProps {
    jobStatus: ImportJobStatusResponse;
}

export default function SpotifyR2SyncProgress({
    jobStatus,
}: SpotifyR2SyncProgressProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!jobStatus) return null;

    return (
        <div className="mt-6">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                    {messages(
                        'reportConfigs.spotifyR2SyncConfig.syncProgressTitle'
                    )}
                </span>
                <div>
                    {jobStatus.status === IMPORT_JOBS_STATUS.PENDING && (
                        <Tag color="warning" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusPending'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.QUEUED && (
                        <Tag color="warning" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusQueued'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.PROCESSING && (
                        <Tag color="processing" icon={<LoadingOutlined spin />}>
                            {messages(
                                'reportConfigs.importResult.statusProcessing'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.COMPLETED && (
                        <Tag color="success">
                            {messages(
                                'reportConfigs.importResult.statusCompleted'
                            )}
                        </Tag>
                    )}
                    {jobStatus.status === IMPORT_JOBS_STATUS.FAILED && (
                        <Tag color="error">
                            {messages(
                                'reportConfigs.importResult.statusFailed'
                            )}
                        </Tag>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 16 }}>
                {/* <Progress
                    percent={
                        jobStatus.progress?.total && jobStatus.progress.total > 0
                            ? Math.round(
                                  (jobStatus.progress.current /
                                      jobStatus.progress.total) *
                                      100
                              )
                            : 0
                    }
                    status={
                        jobStatus.status === IMPORT_JOBS_STATUS.FAILED
                            ? 'exception'
                            : jobStatus.status === IMPORT_JOBS_STATUS.COMPLETED
                              ? 'success'
                              : 'active'
                    }
                    format={() => {
                        return `${jobStatus.progress?.current || 0}/${jobStatus.progress?.total || 0}`;
                    }}
                /> */}
                {jobStatus.progress?.label && (
                    <div
                        className="mt-1 text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.runningFile', {
                            file: jobStatus.progress.label,
                        })}
                    </div>
                )}
            </div>

            {/* ZIP stats */}
            {jobStatus.detailR2Sync && (
                <Descriptions column={3} bordered size="small">
                    <Descriptions.Item
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.zipsFound'
                        )}
                    >
                        {jobStatus.detailR2Sync.zipsFound}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.zipsImported'
                        )}
                    >
                        {jobStatus.detailR2Sync.zipsImported}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.zipsSkipped'
                        )}
                    >
                        {jobStatus.detailR2Sync.zipsSkipped}
                    </Descriptions.Item>
                </Descriptions>
            )}

            {/* Export stats */}
            {jobStatus.detailExport && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.spotifyR2SyncConfig.jobSpoId'
                            )}
                        >
                            <span style={{ fontFamily: 'monospace' }}>
                                {jobStatus.detailExport.jobSpoId}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.spotifyR2SyncConfig.foldersUploaded'
                            )}
                        >
                            {jobStatus.detailExport.foldersUploaded}
                        </Descriptions.Item>
                    </Descriptions>
                    {jobStatus.detailExport.r2ObjectKeys &&
                        jobStatus.detailExport.r2ObjectKeys.length > 0 && (
                            <div className="mt-2">
                                <span style={{ fontWeight: 600, fontSize: 13 }}>
                                    {messages(
                                        'reportConfigs.spotifyR2SyncConfig.r2ObjectKeys'
                                    )}
                                    :
                                </span>
                                <div
                                    className="mt-1 max-h-40 overflow-y-auto rounded border p-2 text-xs"
                                    style={{
                                        fontFamily: 'monospace',
                                        borderColor: token.colorBorder,
                                        backgroundColor:
                                            token.colorBgContainerDisabled,
                                    }}
                                >
                                    {jobStatus.detailExport.r2ObjectKeys.map(
                                        (key) => (
                                            <div
                                                key={key}
                                                style={{ padding: '2px 0' }}
                                            >
                                                {key}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            )}

            {/* Error display */}
            {jobStatus.error && (
                <Alert
                    type="error"
                    message={messages(
                        'reportConfigs.importResult.errorDetails'
                    )}
                    description={jobStatus.error}
                    showIcon
                    style={{ marginTop: 16 }}
                />
            )}
        </div>
    );
}
