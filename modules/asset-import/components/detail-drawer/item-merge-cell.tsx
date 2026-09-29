'use client';

import ReasonTags from '@/modules/release-merge/components/reason-tags';
import { Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportAction } from '../../enums';
import { AssetImportItemData, MergeImpactData } from '../../types/payload';
import {
    findImpactSource,
    formatMergeRelease,
    uniqueReasonCodes,
} from '../../utils/merge-impact';

type Props = {
    record: AssetImportItemData;
    impact?: MergeImpactData | null;
};

export default function ItemMergeCell({ record, impact }: Props) {
    const messages = useTranslations();
    const isMerge = record.action === AssetImportAction.MERGE_REQUIRED;
    const isConflict = record.action === AssetImportAction.CONFLICT;
    if (!isMerge && !isConflict) return <>-</>;

    const sourceIds = record.duplicateSourceReleaseIds ?? [];
    const sources = sourceIds.map((sourceId) =>
        findImpactSource(impact, record.canonicalReleaseId, sourceId)
    );
    const plans = sources
        .map((source) => source?.plan)
        .filter((plan): plan is NonNullable<typeof plan> => !!plan);
    const autoSafeCount = plans.filter((plan) => plan.autoSafe).length;
    const everySourceResolved =
        sourceIds.length > 0 &&
        sources.every((source) => source?.plan || source?.error);

    let verdict: 'auto' | 'manual' | 'mixed' | 'unknown' = 'unknown';
    if (isConflict) verdict = 'manual';
    else if (everySourceResolved) {
        if (plans.length === sources.length && autoSafeCount === plans.length) {
            verdict = 'auto';
        } else if (autoSafeCount === 0) verdict = 'manual';
        else verdict = 'mixed';
    }

    const sourceLabels = sourceIds.map((sourceId) => {
        const source = findImpactSource(
            impact,
            record.canonicalReleaseId,
            sourceId
        );
        return formatMergeRelease(source?.plan?.source) ?? sourceId;
    });
    const targetPlan = plans[0]?.target;
    const targetLabel =
        formatMergeRelease(targetPlan) ?? record.canonicalReleaseId ?? '-';
    const sharedIsrcs = Array.from(
        new Set(plans.flatMap((plan) => plan.sharedIsrcs))
    );
    const duplicateCode = [record.isrc, record.upc].filter(Boolean).join(' / ');
    const reasonCodes = uniqueReasonCodes(plans);
    const classificationKey = record.duplicateClassification
        ? `assetImport.merge.classification.${record.duplicateClassification}`
        : null;
    const verdictKey =
        verdict === 'auto'
            ? 'assetImport.merge.autoSafe'
            : verdict === 'mixed'
              ? 'assetImport.merge.mixed'
              : verdict === 'manual'
                ? 'assetImport.merge.manual'
                : null;

    return (
        <div className="space-y-1 text-xs leading-5">
            <div>
                <span className="text-gray-500">
                    {messages('assetImport.merge.sourceRelease')}:{' '}
                </span>
                {sourceLabels.length
                    ? sourceLabels.slice(0, 2).join(', ')
                    : '-'}
                {sourceLabels.length > 2
                    ? ` +${sourceLabels.length - 2}`
                    : ''}
            </div>
            <div>
                <span className="text-gray-500">
                    {messages('assetImport.merge.targetRelease')}:{' '}
                </span>
                {targetLabel}
            </div>
            <div>
                <span className="text-gray-500">
                    {messages('assetImport.merge.duplicateCodes')}:{' '}
                </span>
                {duplicateCode || sharedIsrcs.slice(0, 3).join(', ') || '-'}
            </div>
            <div className="flex flex-wrap items-center gap-1">
                {verdictKey && (
                    <Tag
                        color={
                            verdict === 'auto'
                                ? 'success'
                                : verdict === 'mixed'
                                  ? 'gold'
                                  : 'warning'
                        }
                        className="!mr-0"
                    >
                        {messages(verdictKey)}
                    </Tag>
                )}
                {classificationKey && messages.has(classificationKey as never) && (
                    <Typography.Text type="secondary" className="!text-xs">
                        {messages(classificationKey as never)}
                    </Typography.Text>
                )}
            </div>
            <ReasonTags codes={reasonCodes} />
            {!reasonCodes.length && record.errorMessage && (
                <Typography.Text type="danger" className="!text-xs">
                    {record.errorMessage}
                </Typography.Text>
            )}
        </div>
    );
}
