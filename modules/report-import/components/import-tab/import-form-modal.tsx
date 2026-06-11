import { showNotification } from '@/helpers/messages-helper';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { DetailResponse } from '@/types/api';
import { Form, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { usePreValidateImport } from '../../hooks/use-pre-validate-import';
import { useStartImportJob } from '../../hooks/use-start-import-job';
import { useGetImportJobStatus } from '../../hooks/use-get-import-job-status';
import {
    FileUploadStatus,
    ImportJobStatus,
    PreValidateImportFile,
    PreValidateImportResponse,
    PreValidateImportMatchedFile,
} from '../../types/payload';
import { ImportForm } from './import-form';
import { ImportResultView } from './import-result-view';
import { ImportModalFooter } from './import-modal-footer';

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
    const { profile } = useAuth();
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
        Record<string, { status: FileUploadStatus; error?: string }>
    >({});

    const [startedJobId, setStartedJobId] = useState<string | null>(null);
    const { jobStatus } = useGetImportJobStatus(
        startedJobId ?? undefined,
        !!startedJobId
    );

    const isJobProcessing =
        jobStatus?.status === ImportJobStatus.PENDING ||
        jobStatus?.status === ImportJobStatus.PROCESSING;

    const tenantId = profile?.tenantId || '';

    useEffect(() => {
        if (open && viewJobId) {
            setStartedJobId(viewJobId);
            setUploadStatus(FileUploadStatus.SUCCESS);
            setIsUploading(false);
        }
    }, [open, viewJobId]);

    useEffect(() => {
        if (viewJobId && jobStatus) {
            const files = jobStatus.params?.files || [];
            const matchedFiles: PreValidateImportMatchedFile[] = files.map((f: any) => ({
                path: f.path || f.name || 'Unknown',
                r2Key: f.r2Key || '',
                uploadUrl: '',
            }));
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
        const { allowedExtensions, files } = values;

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
            tenantId,
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
                        const uploadPromises = matched.map(
                            async (matchedItem: any) => {
                                const file = files.find((f: any) => {
                                    const originalFile =
                                        f.originFileObj as File;
                                    const path =
                                        originalFile?.webkitRelativePath ||
                                        f.name ||
                                        '';
                                    return path === matchedItem.path;
                                });

                                try {
                                    if (file && file.originFileObj) {
                                        const response = await fetch(
                                            matchedItem.uploadUrl,
                                            {
                                                method: 'PUT',
                                                body: file.originFileObj,
                                            }
                                        );
                                        if (!response.ok) {
                                            throw new Error(
                                                `HTTP error! status: ${response.status}`
                                            );
                                        }
                                        setUploadResults((prev) => ({
                                            ...prev,
                                            [matchedItem.path]: {
                                                status: FileUploadStatus.SUCCESS,
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
                                            error:
                                                err?.message || 'Upload failed',
                                        },
                                    }));
                                }
                            }
                        );

                        await Promise.all(uploadPromises);

                        if (hasFailed) {
                            setUploadStatus(FileUploadStatus.FAILED);
                            showNotification(
                                'error',
                                messages('reportConfigs.importResult.uploadFailedNotification')
                            );
                            setIsUploading(false);
                        } else {
                            if (data?.jobId) {
                                setStartedJobId(data.jobId);
                                startImportJob({
                                    jobId: data.jobId,
                                    onSuccess: () => {
                                        setUploadStatus(FileUploadStatus.SUCCESS);
                                        setIsUploading(false);
                                    },
                                    onError: () => {
                                        setUploadStatus(FileUploadStatus.FAILED);
                                        setStartedJobId(null);
                                        setUploadError(
                                            messages('reportConfigs.importResult.uploadSuccessStartJobFailed')
                                        );
                                        showNotification(
                                            'error',
                                            messages('reportConfigs.importResult.startJobFailedNotification')
                                        );
                                        setIsUploading(false);
                                    },
                                });
                            } else {
                                setUploadStatus(FileUploadStatus.SUCCESS);
                                showNotification(
                                    'success',
                                    messages('reportConfigs.importResult.uploadSuccessNotification')
                                );
                                setIsUploading(false);
                            }
                        }
                    } catch (error: any) {
                        setUploadStatus(FileUploadStatus.FAILED);
                        setUploadError(
                            error?.message || messages('reportConfigs.importResult.uploadFailed')
                        );
                        showNotification(
                            'error',
                            error?.message || messages('reportConfigs.importResult.uploadFailed')
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
            confirmLoading={isPending || isUploading || isJobProcessing}
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
            destroyOnClose
            width={startedJobId && jobStatus && !viewJobId ? 960 : 560}
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
            {validationResult ? (
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
                <ImportForm
                    form={form}
                    onSubmit={handleSubmit}
                />
            )}
        </Modal>
    );
};
