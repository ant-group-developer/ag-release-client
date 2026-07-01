'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { Wrench, CheckCircle, XCircle } from 'lucide-react';
import {
    RELEASE_ERROR_APPROVAL_STATUS,
    RELEASE_ERROR_SUBMISSION_STATUS,
    RELEASE_ERROR_TYPE,
} from '@/modules/releases/enums';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { Button, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

interface ReleaseErrorsTableProps {
    data: ReleaseEnrichedError[];
    onUpdateError: (
        id: string,
        payload: {
            approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
            submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
        }
    ) => void;
}

export default function ReleaseErrorsTable({
    data,
    onUpdateError,
}: ReleaseErrorsTableProps) {
    const messages = useTranslations();

    const getEnrichedErrorMessages = (error: ReleaseEnrichedError) => {
        return error.message || messages(error.messageCode as any);
    };

    const renderSubmissionStatus = (
        status?: RELEASE_ERROR_SUBMISSION_STATUS
    ) => {
        if (!status) return '-';
        const label = messages(
            `release.error.submissionStatus.${status}` as any
        );
        const color =
            status === RELEASE_ERROR_SUBMISSION_STATUS.FIXED
                ? 'success'
                : 'warning';
        return <Tag color={color}>{label}</Tag>;
    };

    const renderApprovalStatus = (status?: RELEASE_ERROR_APPROVAL_STATUS) => {
        if (!status) return '-';
        const label = messages(`release.error.approvalStatus.${status}` as any);
        let color = 'default';
        if (status === RELEASE_ERROR_APPROVAL_STATUS.APPROVED)
            color = 'success';
        if (status === RELEASE_ERROR_APPROVAL_STATUS.REJECTED) color = 'error';
        if (status === RELEASE_ERROR_APPROVAL_STATUS.PENDING)
            color = 'processing';
        return <Tag color={color}>{label}</Tag>;
    };

    const renderErrorType = (type?: RELEASE_ERROR_TYPE | null) => {
        if (!type) return '-';
        const label = messages(`release.error.type.${type}` as any);
        let color = 'default';
        if (type === RELEASE_ERROR_TYPE.ADMIN_CREATE) color = 'blue';
        if (type === RELEASE_ERROR_TYPE.IMPORT_CI) color = 'purple';
        if (type === RELEASE_ERROR_TYPE.QA_FLAG_CI) color = 'orange';
        return <Tag color={color}>{label}</Tag>;
    };

    const columns: ColumnsType<ReleaseEnrichedError> = [
        {
            title: messages('common.iNo'),
            key: 'index',
            width: 50,
            align: 'center',
            render: (_: unknown, __: ReleaseEnrichedError, index: number) =>
                index + 1,
        },
        {
            title: messages('release.error.description'),
            key: 'message',
            width: 400,
            render: (record: ReleaseEnrichedError) => (
                <span className="font-medium text-red-600 dark:text-red-400">
                    {getEnrichedErrorMessages(record)}
                </span>
            ),
        },
        {
            title: messages('release.error.submissionStatusLabel'),
            dataIndex: 'submissionStatus',
            key: 'submissionStatus',
            width: 150,
            sorter: (a, b) => {
                const statusA = a.submissionStatus || '';
                const statusB = b.submissionStatus || '';
                return statusA.localeCompare(statusB);
            },
            render: renderSubmissionStatus,
        },
        {
            title: messages('release.error.approvalStatusLabel'),
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            width: 150,
            sorter: (a, b) => {
                const statusA = a.approvalStatus || '';
                const statusB = b.approvalStatus || '';
                return statusA.localeCompare(statusB);
            },
            render: renderApprovalStatus,
        },
        {
            title: messages('common.type'),
            dataIndex: 'type',
            key: 'type',
            width: 130,
            sorter: (a, b) => {
                const typeA = a.type || '';
                const typeB = b.type || '';
                return typeA.localeCompare(typeB);
            },
            render: renderErrorType,
        },
        {
            title: messages('common.submitter'),
            dataIndex: 'submitter',
            key: 'submitter',
            width: 180,
            sorter: (a, b) => {
                const nameA = a.submitter?.name || a.submitter?.email || '';
                const nameB = b.submitter?.name || b.submitter?.email || '';
                return nameA.localeCompare(nameB);
            },
            render: (submitter?: ReleaseEnrichedError['submitter']) => {
                const text = submitter?.name || submitter?.email || '-';
                if (text === '-') return '-';
                return (
                    <Tooltip title={text}>
                        <div className="max-w-[180px] truncate">{text}</div>
                    </Tooltip>
                );
            },
        },
        {
            title: messages('common.updatedAt'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            sorter: (a, b) => {
                const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return timeA - timeB;
            },
            render: (updatedAt?: string | null) =>
                formattedDate(updatedAt, DATE_FORMAT.DATE_MINUTE) || '-',
        },
        {
            title: messages('common.action'),
            key: 'action',
            width: 220,
            align: 'center',
            fixed: 'right',
            render: (record: ReleaseEnrichedError) => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        {record.submissionStatus !==
                            RELEASE_ERROR_SUBMISSION_STATUS.FIXED && (
                            <PermissionGate
                                permission={PERMISSION.RELEASE_REVIEW.CAN_FIX}
                            >
                                <Button
                                    size="small"
                                    type="primary"
                                    className="flex items-center gap-1"
                                    onClick={() =>
                                        onUpdateError(record.id, {
                                            submissionStatus:
                                                RELEASE_ERROR_SUBMISSION_STATUS.FIXED,
                                        })
                                    }
                                >
                                    <Wrench size={14} />
                                    <span>
                                        {messages(
                                            'release.error.submissionStatus.FIXED'
                                        )}
                                    </span>
                                </Button>
                            </PermissionGate>
                        )}
                        <PermissionGate
                            permission={PERMISSION.RELEASE_REVIEW.APPROVE}
                        >
                            <Button
                                size="small"
                                type="primary"
                                className="flex items-center gap-1 !bg-green-600 hover:!bg-green-700 !border-none !text-white"
                                onClick={() =>
                                    onUpdateError(record.id, {
                                        approvalStatus:
                                            RELEASE_ERROR_APPROVAL_STATUS.APPROVED,
                                    })
                                }
                            >
                                <CheckCircle size={14} />
                                <span>{messages('status.approve')}</span>
                            </Button>
                        </PermissionGate>
                        <PermissionGate
                            permission={PERMISSION.RELEASE_REVIEW.REJECT}
                        >
                            <Button
                                size="small"
                                type="primary"
                                danger
                                className="flex items-center gap-1"
                                onClick={() =>
                                    onUpdateError(record.id, {
                                        approvalStatus:
                                            RELEASE_ERROR_APPROVAL_STATUS.REJECTED,
                                    })
                                }
                            >
                                <XCircle size={14} />
                                <span>{messages('status.reject')}</span>
                            </Button>
                        </PermissionGate>
                    </div>
                );
            },
        },
    ];

    return (
        <Table
            scroll={{
                x: 'max-content',
            }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
        />
    );
}
