import { showNotification } from '@/helpers/messages-helper';
import { DetailResponse } from '@/types/api';
import { Form, Modal, Spin } from 'antd';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useGetImportJobStatus } from '../../hooks/use-get-import-job-status';
import { usePreValidateImport } from '../../hooks/use-pre-validate-import';
import { useStartImportJob } from '../../hooks/use-start-import-job';
import {
    FileUploadStatus,
    PreValidateImportFile,
    PreValidateImportMatchedFile,
    PreValidateImportResponse,
    RUNNING_IMPORT_JOB_STATUSES,
} from '../../types/payload';
import { ImportForm } from './import-form';
import { ImportModalFooter } from './import-modal-footer';
import { ImportResultView } from './import-result-view';

const uploadFileWithProgress = async (
    url: string,
    file: File,
    onProgress: (percent: number) => void
): Promise<void> => {
    const response = await axios.put(url, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
        },
        onUploadProgress: (progressEvent) => {
            const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress(percent);
        },
    });

    if (!response.status || response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};

const MAX_CONCURRENT_UPLOADS = 3;

interface ImportModalProps {
    open: boolean;
    onClose: () => void;
    viewJobId?: string | null;
}

export const ImportModal: React.FC<ImportModalProps> = ({
    open,
    onClose,
    viewJobId,
}) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { preValidateImport, isPending } = usePreValidateImport();
    const { startImportJob } = useStartImportJob();

    const [validationResult, setValidationResult] =
        useState<PreValidateImportResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>(
        FileUploadStatus.IDLE
    );
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadResults, setUploadResults] = useState<
        Record<
            string,
            { status: FileUploadStatus; progress?: number; error?: string }
        >
    >({});

    const [startedJobId, setStartedJobId] = useState<string | null>(null);
    const { jobStatus } = useGetImportJobStatus(startedJobId as string);

    const isJobProcessing = !!(
        jobStatus?.status &&
        RUNNING_IMPORT_JOB_STATUSES.includes(jobStatus.status)
    );

    useEffect(() => {
        if (open && viewJobId) {
            setStartedJobId(viewJobId);
            setUploadStatus(FileUploadStatus.SUCCESS);
            setIsUploading(false);
        }
    }, [open, viewJobId]);

    useEffect(() => {
        if (viewJobId && jobStatus) {
            let paramsObj: any = jobStatus.params;
            if (typeof paramsObj === 'string') {
                try {
                    paramsObj = JSON.parse(paramsObj);
                } catch (e) {
                    console.error('Failed to parse jobStatus.params:', e);
                }
            }
            const files = paramsObj?.files || [];
            const matchedFiles: PreValidateImportMatchedFile[] = files.map(
                (f: any) => ({
                    path: f.path || f.name || 'Unknown',
                    r2Key: f.r2Key || '',
                    uploadUrl: '',
                })
            );
            setValidationResult({
                jobId: viewJobId,
                matched: matchedFiles,
                invalid: [],
            });

            const results: Record<string, { status: FileUploadStatus }> = {};
            files.forEach((f: any) => {
                const path = f.path || f.name || 'Unknown';
                results[path] = { status: FileUploadStatus.SUCCESS };
            });
            setUploadResults(results);
        }
    }, [viewJobId, jobStatus]);

    const handleCloseModal = () => {
        setValidationResult(null);
        setIsUploading(false);
        setUploadStatus(FileUploadStatus.IDLE);
        setUploadError(null);
        setUploadResults({});
        setStartedJobId(null);
        form.resetFields();
        onClose();
    };

    const handleGoBack = () => {
        setValidationResult(null);
        setUploadStatus(FileUploadStatus.IDLE);
        setUploadError(null);
        setUploadResults({});
        setStartedJobId(null);
    };

    const handleRetry = () => {
        handleSubmit(form.getFieldsValue());
    };

    const handleSubmit = (values: any) => {
        setUploadStatus(FileUploadStatus.IDLE);
        setUploadError(null);
        setUploadResults({});
        setStartedJobId(null);
        const { allowedExtensions, files, tenantId: selectedTenantId } = values;

        const mappedFiles: PreValidateImportFile[] = (files || []).map(
            (file: any) => {
                const originalFile = file.originFileObj as File;
                const path =
                    originalFile?.webkitRelativePath || file.name || '';
                const size = file.size || originalFile?.size || 0;
                return {
                    path,
                    size,
                };
            }
        );

        const payload = {
            files: mappedFiles,
            tenantId: selectedTenantId,
            allowedExtensions,
        };

        preValidateImport({
            payload,
            onSuccess: async (
                res: DetailResponse<PreValidateImportResponse>
            ) => {
                const data = res?.data;
                setValidationResult(data);

                const matched = data?.matched || [];
                if (matched.length > 0) {
                    setIsUploading(true);

                    const initialResults: Record<
                        string,
                        {
                            status: FileUploadStatus;
                            error?: string;
                        }
                    > = {};
                    matched.forEach((item: any) => {
                        initialResults[item.path] = {
                            status: FileUploadStatus.UPLOADING,
                        };
                    });
                    setUploadResults(initialResults);

                    try {
                        let hasFailed = false;
                        let index = 0;

                        const uploadNext = async (): Promise<void> => {
                            if (index >= matched.length) {
                                return;
                            }

                            const currentIndex = index++;
                            const matchedItem = matched[currentIndex];

                            const file = files.find((f: any) => {
                                const originalFile = f.originFileObj as File;
                                const path =
                                    originalFile?.webkitRelativePath ||
                                    f.name ||
                                    '';
                                return path === matchedItem.path;
                            });

                            try {
                                if (file && file.originFileObj) {
                                    await uploadFileWithProgress(
                                        matchedItem.uploadUrl,
                                        file.originFileObj,
                                        (percent) => {
                                            setUploadResults((prev) => ({
                                                ...prev,
                                                [matchedItem.path]: {
                                                    ...prev[matchedItem.path],
                                                    status: FileUploadStatus.UPLOADING,
                                                    progress: percent,
                                                },
                                            }));
                                        }
                                    );
                                    setUploadResults((prev) => ({
                                        ...prev,
                                        [matchedItem.path]: {
                                            status: FileUploadStatus.SUCCESS,
                                            progress: 100,
                                        },
                                    }));
                                } else {
                                    throw new Error(
                                        `File not found in local files: ${matchedItem.path}`
                                    );
                                }
                            } catch (err: any) {
                                hasFailed = true;
                                setUploadResults((prev) => ({
                                    ...prev,
                                    [matchedItem.path]: {
                                        status: FileUploadStatus.FAILED,
                                        error: err?.message || 'Upload failed',
                                    },
                                }));
                            }

                            await uploadNext();
                        };

                        const workers = [];
                        const limit = Math.min(
                            MAX_CONCURRENT_UPLOADS,
                            matched.length
                        );
                        for (let i = 0; i < limit; i++) {
                            workers.push(uploadNext());
                        }

                        await Promise.all(workers);

                        if (hasFailed) {
                            setUploadStatus(FileUploadStatus.FAILED);
                            showNotification(
                                'error',
                                messages(
                                    'reportConfigs.importResult.uploadFailedNotification'
                                )
                            );
                            setIsUploading(false);
                        } else {
                            if (data?.jobId) {
                                setStartedJobId(data.jobId);
                                startImportJob({
                                    jobId: data.jobId,
                                    onSuccess: () => {
                                        setUploadStatus(
                                            FileUploadStatus.SUCCESS
                                        );
                                        setIsUploading(false);
                                    },
                                    onError: () => {
                                        setUploadStatus(
                                            FileUploadStatus.FAILED
                                        );
                                        setStartedJobId(null);
                                        setUploadError(
                                            messages(
                                                'reportConfigs.importResult.uploadSuccessStartJobFailed'
                                            )
                                        );
                                        showNotification(
                                            'error',
                                            messages(
                                                'reportConfigs.importResult.startJobFailedNotification'
                                            )
                                        );
                                        setIsUploading(false);
                                    },
                                });
                            } else {
                                setUploadStatus(FileUploadStatus.SUCCESS);
                                showNotification(
                                    'success',
                                    messages(
                                        'reportConfigs.importResult.uploadSuccessNotification'
                                    )
                                );
                                setIsUploading(false);
                            }
                        }
                    } catch (error: any) {
                        setUploadStatus(FileUploadStatus.FAILED);
                        setUploadError(
                            error?.message ||
                                messages(
                                    'reportConfigs.importResult.uploadFailed'
                                )
                        );
                        showNotification(
                            'error',
                            error?.message ||
                                messages(
                                    'reportConfigs.importResult.uploadFailed'
                                )
                        );
                        setIsUploading(false);
                    }
                }
            },
        });
    };

    return (
        <Modal
            title={messages('reportConfigs.importModalTitle')}
            open={open}
            centered
            confirmLoading={isPending}
            onOk={() => {
                if (validationResult) {
                    handleCloseModal();
                } else {
                    form.submit();
                }
            }}
            onCancel={handleCloseModal}
            okText={messages('common.submit')}
            cancelText={messages('common.cancel')}
            destroyOnHidden
            width="50vw"
            closable={!isUploading}
            maskClosable={!isUploading}
            footer={
                validationResult ? (
                    <ImportModalFooter
                        validationResult={validationResult}
                        isUploading={isUploading}
                        isJobProcessing={isJobProcessing}
                        uploadStatus={uploadStatus}
                        onGoBack={handleGoBack}
                        onRetry={handleRetry}
                        onClose={handleCloseModal}
                        readOnly={!!viewJobId}
                    />
                ) : undefined
            }
        >
            <div
                style={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {viewJobId && !validationResult ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200,
                        }}
                    >
                        <Spin size="small" tip={messages('common.loading')} />
                    </div>
                ) : validationResult ? (
                    <ImportResultView
                        validationResult={validationResult}
                        startedJobId={startedJobId}
                        jobStatus={jobStatus}
                        isUploading={isUploading}
                        uploadStatus={uploadStatus}
                        uploadError={uploadError}
                        uploadResults={uploadResults}
                        readOnly={!!viewJobId}
                    />
                ) : (
                    <ImportForm form={form} onSubmit={handleSubmit} />
                )}
            </div>
        </Modal>
    );
};
