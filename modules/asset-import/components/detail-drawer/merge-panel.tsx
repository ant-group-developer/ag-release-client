'use client';

import { APP_ROUTES } from '@/enums/routes';
import { showNotification } from '@/helpers/messages-helper';
import { Link } from '@/i18n/routing';
import ReasonTags, {
    CodeList,
} from '@/modules/release-merge/components/reason-tags';
import { Alert, Button, Modal, Space, Table, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMergeAssetImportDuplicates } from '../../hooks/use-merge-duplicates';
import { useRescanAssetImportConflicts } from '../../hooks/use-rescan-conflicts';
import {
    MergeImpactData,
    MergeImpactGroup,
    MergeImpactSource,
    RescanConflictsResult,
} from '../../types/payload';
import {
    buildMergeDuplicatesPayload,
    collectAutoSafeItemIds,
    countMergeSources,
    formatMergeRelease,
} from '../../utils/merge-impact';

type Props = {
    batchId?: string | null;
    canOperate: boolean;
    mergeRequired: number;
    conflictCount: number;
    impact?: MergeImpactData | null;
    impactLoading?: boolean;
    onMergeStart?: () => void;
};

type PanelNotice = {
    type: 'success' | 'warning';
    message: string;
    description?: string;
};

export default function MergePanel({
    batchId,
    canOperate,
    mergeRequired,
    conflictCount,
    impact,
    impactLoading,
    onMergeStart,
}: Props) {
    const messages = useTranslations();
    const [notice, setNotice] = useState<PanelNotice | null>(null);
    const { mergeDuplicates, isPending: isMerging } =
        useMergeAssetImportDuplicates();
    const { rescanConflicts, isPending: isRescanning } =
        useRescanAssetImportConflicts();

    if (mergeRequired <= 0 && conflictCount <= 0 && !notice) return null;

    const safeItemIds = collectAutoSafeItemIds(impact);
    const sourceCounts = countMergeSources(impact);
    const forceEligibleSourceIds = Array.from(
        new Set(
            (impact?.groups ?? []).flatMap((group) =>
                group.sources
                    .filter((source) => source.forceEligible)
                    .map((source) => source.sourceReleaseId)
            )
        )
    );

    const handleMerge = () => {
        if (!batchId || safeItemIds.length === 0) return;
        Modal.confirm({
            title: messages('assetImport.merge.confirmMergeTitle'),
            content: messages('assetImport.merge.confirmMergeDescription', {
                safe: sourceCounts.autoSafe,
                manual: sourceCounts.manual,
            }),
            okText: messages('assetImport.merge.mergeSafe', {
                count: safeItemIds.length,
            }),
            cancelText: messages('common.cancel'),
            onOk: () =>
                mergeDuplicates({
                    batchId,
                    payload: buildMergeDuplicatesPayload(impact, safeItemIds),
                    onSuccess: () => {
                        onMergeStart?.();
                        const text = messages('assetImport.merge.started');
                        showNotification('success', text);
                        setNotice({ type: 'success', message: text });
                    },
                }),
        });
    };

    const handleMergeSource = (
        group: MergeImpactGroup,
        source: MergeImpactSource
    ) => {
        const plan = source.plan;
        const force = !!source.forceEligible && !plan?.autoSafe;
        if (!batchId || !plan || (!plan.autoSafe && !force)) return;

        const sourceLabel =
            formatMergeRelease(plan.source) ?? source.sourceReleaseId;
        const targetLabel =
            formatMergeRelease(plan.target) ?? group.targetReleaseId;
        Modal.confirm({
            title: messages(
                force
                    ? 'assetImport.merge.confirmForceOneTitle'
                    : 'assetImport.merge.confirmOneTitle'
            ),
            content: messages(
                force
                    ? 'assetImport.merge.confirmForceOneDescription'
                    : 'assetImport.merge.confirmOneDescription',
                {
                    source: sourceLabel,
                    target: targetLabel,
                }
            ),
            okText: messages(
                force
                    ? 'assetImport.merge.forceMergeOne'
                    : 'assetImport.merge.mergeOne'
            ),
            okButtonProps: { danger: force },
            cancelText: messages('common.cancel'),
            onOk: () =>
                mergeDuplicates({
                    batchId,
                    payload: {
                        selectAll: true,
                        sourceReleaseIds: [source.sourceReleaseId],
                        force,
                    },
                    onSuccess: () => {
                        onMergeStart?.();
                        const text = messages('assetImport.merge.started');
                        showNotification('success', text);
                        setNotice({ type: 'success', message: text });
                    },
                }),
        });
    };

    const handleForceEligible = () => {
        if (!batchId || forceEligibleSourceIds.length === 0) return;
        Modal.confirm({
            title: messages('assetImport.merge.confirmForceEligibleTitle'),
            content: messages(
                'assetImport.merge.confirmForceEligibleDescription',
                { count: forceEligibleSourceIds.length }
            ),
            okText: messages('assetImport.merge.forceMergeEligible', {
                count: forceEligibleSourceIds.length,
            }),
            okButtonProps: { danger: true },
            cancelText: messages('common.cancel'),
            onOk: () =>
                mergeDuplicates({
                    batchId,
                    payload: {
                        selectAll: true,
                        sourceReleaseIds: forceEligibleSourceIds,
                        force: true,
                    },
                    onSuccess: () => {
                        onMergeStart?.();
                        const text = messages('assetImport.merge.started');
                        showNotification('success', text);
                        setNotice({ type: 'success', message: text });
                    },
                }),
        });
    };

    const handleRescan = () => {
        if (!batchId) return;
        rescanConflicts({
            batchId,
            onSuccess: (response) => {
                const result = response?.data as
                    | RescanConflictsResult
                    | undefined;
                const text = messages('assetImport.merge.rescanResult', {
                    count: result?.rescanned ?? 0,
                });
                showNotification('success', text);
                setNotice({ type: 'success', message: text });
            },
        });
    };

    return (
        <div className="mb-3 space-y-3 rounded-lg border p-3">
            {(mergeRequired > 0 || conflictCount > 0) && (
                <Alert
                    type="warning"
                    showIcon
                    message={messages('assetImport.merge.applyWarning', {
                        merge: mergeRequired,
                        conflict: conflictCount,
                    })}
                />
            )}
            {mergeRequired > 0 && (
                <Typography.Paragraph type="secondary" className="!mb-0">
                    {messages('assetImport.merge.flow')}{' '}
                    <Link href={APP_ROUTES.RELEASE_MERGES}>
                        {messages('releaseMerge.label')}
                    </Link>
                </Typography.Paragraph>
            )}
            <Space wrap>
                <Button
                    type="primary"
                    disabled={
                        !canOperate || safeItemIds.length === 0 || !batchId
                    }
                    loading={isMerging || impactLoading}
                    onClick={handleMerge}
                >
                    {messages('assetImport.merge.mergeSafe', {
                        count: safeItemIds.length,
                    })}
                </Button>
                <Button
                    danger
                    disabled={
                        !canOperate ||
                        forceEligibleSourceIds.length === 0 ||
                        !batchId
                    }
                    loading={isMerging || impactLoading}
                    onClick={handleForceEligible}
                >
                    {messages('assetImport.merge.forceMergeEligible', {
                        count: forceEligibleSourceIds.length,
                    })}
                </Button>
                <Button
                    disabled={
                        !canOperate ||
                        !batchId ||
                        (mergeRequired <= 0 && conflictCount <= 0)
                    }
                    loading={isRescanning}
                    onClick={handleRescan}
                >
                    {messages('assetImport.merge.rescan')}
                </Button>
            </Space>
            {notice && (
                <Alert
                    type={notice.type}
                    showIcon
                    message={notice.message}
                    description={notice.description}
                />
            )}
            {mergeRequired > 0 && (
                <Table<MergeImpactGroup>
                    size="small"
                    rowKey="targetReleaseId"
                    loading={impactLoading}
                    pagination={
                        (impact?.groups.length ?? 0) > 8
                            ? { pageSize: 8, showSizeChanger: false }
                            : false
                    }
                    dataSource={impact?.groups ?? []}
                    locale={{
                        emptyText: impactLoading
                            ? messages('assetImport.merge.loadingImpact')
                            : messages('assetImport.merge.noImpact'),
                    }}
                    columns={[
                        {
                            title: messages('assetImport.merge.targetRelease'),
                            key: 'target',
                            render: (_, group) => {
                                const target = group.sources.find(
                                    (source) => source.plan?.target
                                )?.plan?.target;
                                return (
                                    <div>
                                        <div>
                                            {formatMergeRelease(target) ??
                                                group.targetReleaseId}
                                        </div>
                                        <Typography.Text
                                            type="secondary"
                                            className="!text-xs"
                                            copyable={{
                                                text: group.targetReleaseId,
                                            }}
                                        >
                                            {group.targetReleaseId}
                                        </Typography.Text>
                                    </div>
                                );
                            },
                        },
                        {
                            title: messages('assetImport.merge.duplicateCodes'),
                            key: 'isrcs',
                            width: 220,
                            render: (_, group) => (
                                <CodeList codes={group.isrcs} />
                            ),
                        },
                        {
                            title: messages('assetImport.item.rowNumber'),
                            key: 'items',
                            width: 90,
                            align: 'center',
                            render: (_, group) => group.itemIds.length,
                        },
                    ]}
                    expandable={{
                        expandedRowRender: (group) => (
                            <div className="space-y-2">
                                {group.sources.map((source) => {
                                    const plan = source.plan;
                                    const autoSafe = !!plan?.autoSafe;
                                    return (
                                        <div
                                            key={source.sourceReleaseId}
                                            className="rounded border p-2"
                                        >
                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                <span>
                                                    {formatMergeRelease(
                                                        plan?.source
                                                    ) ?? source.sourceReleaseId}
                                                </span>
                                                <Tag
                                                    color={
                                                        source.error
                                                            ? 'error'
                                                            : autoSafe
                                                              ? 'success'
                                                              : 'warning'
                                                    }
                                                    className="!mr-0"
                                                >
                                                    {source.error
                                                        ? messages(
                                                              'assetImport.merge.prepareError'
                                                          )
                                                        : autoSafe
                                                          ? messages(
                                                                'assetImport.merge.autoSafe'
                                                            )
                                                          : messages(
                                                                'assetImport.merge.manual'
                                                            )}
                                                </Tag>
                                                {plan && (
                                                    <Typography.Text
                                                        type="secondary"
                                                        className="!text-xs"
                                                    >
                                                        {messages(
                                                            'assetImport.merge.tracks',
                                                            {
                                                                source: plan.sourceTrackCount,
                                                                target: plan.targetTrackCount,
                                                            }
                                                        )}
                                                        {' · '}
                                                        {plan.upcEquivalent
                                                            ? messages(
                                                                  'assetImport.merge.upcEquivalent'
                                                              )
                                                            : messages(
                                                                  'assetImport.merge.upcDifferent'
                                                              )}
                                                    </Typography.Text>
                                                )}
                                            </div>
                                            <Typography.Text
                                                type="secondary"
                                                copyable={{
                                                    text: source.sourceReleaseId,
                                                }}
                                                className="!text-xs"
                                            >
                                                {source.sourceReleaseId}
                                            </Typography.Text>
                                            {plan &&
                                                (autoSafe ||
                                                    source.forceEligible) && (
                                                    <div className="mt-2">
                                                        <Button
                                                            size="small"
                                                            type={
                                                                autoSafe
                                                                    ? 'primary'
                                                                    : 'default'
                                                            }
                                                            danger={!autoSafe}
                                                            disabled={
                                                                !canOperate
                                                            }
                                                            loading={isMerging}
                                                            onClick={() =>
                                                                handleMergeSource(
                                                                    group,
                                                                    source
                                                                )
                                                            }
                                                        >
                                                            {messages(
                                                                autoSafe
                                                                    ? 'assetImport.merge.mergeOne'
                                                                    : 'assetImport.merge.forceMergeOne'
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            {plan && (
                                                <div className="mt-2 space-y-1">
                                                    <div>
                                                        <span className="text-xs text-gray-500">
                                                            {messages(
                                                                'assetImport.merge.sharedIsrc'
                                                            )}
                                                            :{' '}
                                                        </span>
                                                        <CodeList
                                                            codes={
                                                                plan.sharedIsrcs
                                                            }
                                                        />
                                                    </div>
                                                    {!!plan.sourceOnlyIsrcs
                                                        .length && (
                                                        <div>
                                                            <span className="text-xs text-gray-500">
                                                                {messages(
                                                                    'assetImport.merge.sourceOnlyIsrc'
                                                                )}
                                                                :{' '}
                                                            </span>
                                                            <CodeList
                                                                codes={
                                                                    plan.sourceOnlyIsrcs
                                                                }
                                                            />
                                                            <Typography.Text
                                                                type="secondary"
                                                                className="!text-xs"
                                                            >
                                                                {messages(
                                                                    'assetImport.merge.sourceOnlyHint'
                                                                )}
                                                            </Typography.Text>
                                                        </div>
                                                    )}
                                                    <ReasonTags
                                                        codes={plan.reasonCodes}
                                                    />
                                                </div>
                                            )}
                                            {source.error && (
                                                <Typography.Text
                                                    type="danger"
                                                    className="!text-xs"
                                                >
                                                    {source.error}
                                                </Typography.Text>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ),
                    }}
                />
            )}
        </div>
    );
}
