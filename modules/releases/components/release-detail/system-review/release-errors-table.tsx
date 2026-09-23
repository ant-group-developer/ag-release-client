'use client';

import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import {
    RELEASE_ERROR_APPROVAL_STATUS,
    RELEASE_ERROR_SUBMISSION_STATUS,
    RELEASE_ERROR_TYPE,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { Button, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircle, Plus, Wrench, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReleaseErrorsTableProps {
    data: ReleaseEnrichedError[];
    isLoading?: boolean;
    onUpdateError?: (
        id: string,
        payload: {
            approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
            submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
        }
    ) => void;
}

export default function ReleaseErrorsTable({
    data,
    isLoading,
    onUpdateError,
}: ReleaseErrorsTableProps) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { hasPermission } = usePermission();
    const { bulkUpdateReleaseErrors } = useBulkUpdateReleaseErrors();

    const handleUpdateError = (
        id: string,
        payload: {
            approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
            submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
        }
    ) => {
        if (onUpdateError) {
            onUpdateError(id, payload);
            return;
        }
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

    const canFix = hasPermission(PERMISSION.RELEASE_REVIEW.CAN_FIX);
    const canApprove = hasPermission(PERMISSION.RELEASE_REVIEW.APPROVE);
    const canReject = hasPermission(PERMISSION.RELEASE_REVIEW.REJECT);
    const hasActionPermission = canFix || canApprove || canReject;

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
                <Typography.Text type="danger">
                    {getEnrichedErrorMessages(record)}
                </Typography.Text>
            ),
        },
        {
            title: messages('release.error.submissionStatusLabel'),
            dataIndex: 'submissionStatus',
            key: 'submissionStatus',
            width: 180,
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
        ...(hasActionPermission
            ? [
                  {
                      title: messages('common.action'),
                      key: 'action',
                      align: 'left' as const,
                      fixed: 'right' as const,
                      render: (record: ReleaseEnrichedError) => {
                          const isFixed =
                              record.submissionStatus ===
                              RELEASE_ERROR_SUBMISSION_STATUS.FIXED;
                          const isApproved =
                              record.approvalStatus ===
                              RELEASE_ERROR_APPROVAL_STATUS.APPROVED;
                          return (
                              <div className="flex items-center gap-2">
                                  {!isFixed && (
                                      <PermissionGate
                                          permission={
                                              PERMISSION.RELEASE_REVIEW.CAN_FIX
                                          }
                                      >
                                          <Button
                                              size="small"
                                              type="primary"
                                              className="flex items-center gap-1"
                                              onClick={() =>
                                                  handleUpdateError(record.id, {
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
                                  {!isApproved && (
                                      <PermissionGate
                                          permission={
                                              PERMISSION.RELEASE_REVIEW.APPROVE
                                          }
                                      >
                                          <Button
                                              size="small"
                                              type="primary"
                                              className="flex items-center gap-1 !border-none !bg-green-600 !text-white hover:!bg-green-700"
                                              onClick={() =>
                                                  handleUpdateError(record.id, {
                                                      approvalStatus:
                                                          RELEASE_ERROR_APPROVAL_STATUS.APPROVED,
                                                  })
                                              }
                                          >
                                              <CheckCircle size={14} />
                                              <span>
                                                  {messages('status.approve')}
                                              </span>
                                          </Button>
                                      </PermissionGate>
                                  )}

                                  <PermissionGate
                                      permission={
                                          PERMISSION.RELEASE_REVIEW.REJECT
                                      }
                                  >
                                      <Button
                                          size="small"
                                          type="primary"
                                          danger
                                          className="flex items-center gap-1"
                                          onClick={() =>
                                              handleUpdateError(record.id, {
                                                  approvalStatus:
                                                      RELEASE_ERROR_APPROVAL_STATUS.REJECTED,
                                              })
                                          }
                                      >
                                          <XCircle size={14} />
                                          <span>
                                              {messages('status.reject')}
                                          </span>
                                      </Button>
                                  </PermissionGate>
                              </div>
                          );
                      },
                  },
              ]
            : []),
    ];

    return (
        <Table
            title={() => (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Typography.Text strong className="!mb-0 !text-base">
                            {messages('release.systemReview.errorsCard.title', {
                                count: data.length,
                            })}
                        </Typography.Text>
                    </div>
                    <PermissionGate
                        permission={PERMISSION.RELEASE_REVIEW.CREATE}
                    >
                        <Button
                            type="primary"
                            onClick={() =>
                                openModal(TYPE_MODAL_RELEASE.CREATE_ERROR)
                            }
                            className="flex items-center gap-1"
                            icon={<Plus size={14} />}
                        >
                            {messages(
                                'release.systemReview.errorsCard.addError'
                            )}
                        </Button>
                    </PermissionGate>
                </div>
            )}
            scroll={{
                x: 'max-content',
            }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            size="middle"
            bordered
            loading={isLoading}
        />
    );
}
