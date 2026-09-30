import {
    ApplyAssetImportPayload,
    MergeImpactData,
    MergeImpactSource,
    MergePairPlan,
    MergeReleaseSnapshot,
} from '../types/payload';

/** Stay under Nest's default 100KB JSON body. One UUID is about 40 bytes. */
const MAX_MERGE_IDS_IN_BODY = 500;

export function formatMergeRelease(
    release?: Pick<MergeReleaseSnapshot, 'id' | 'title' | 'upc'> | null
) {
    if (!release) return null;
    const title = release.title?.trim() || release.id;
    return release.upc ? `${title} (${release.upc})` : title;
}

export function collectAutoSafeItemIds(impact?: MergeImpactData | null) {
    const ids = new Set<string>();
    for (const group of impact?.groups ?? []) {
        const hasSafeSource = group.sources.some(
            (source) => source.plan?.autoSafe
        );
        if (!hasSafeSource) continue;
        group.itemIds.forEach((id) => ids.add(id));
    }
    return Array.from(ids);
}

/**
 * `selectAll` already means "every pending MERGE_REQUIRED item".
 * Sending thousands of item ids exceeds the JSON body limit (413).
 * Unsafe pairs are rejected by the server and left in place.
 */
export function buildMergeDuplicatesPayload(
    impact: MergeImpactData | null | undefined,
    safeItemIds: string[]
): ApplyAssetImportPayload {
    const safe = new Set(safeItemIds);
    const excluded: string[] = [];
    for (const group of impact?.groups ?? []) {
        for (const itemId of group.itemIds) {
            if (!safe.has(itemId)) excluded.push(itemId);
        }
    }

    if (excluded.length === 0) return { selectAll: true };
    if (excluded.length <= MAX_MERGE_IDS_IN_BODY) {
        return { selectAll: true, excludeItemIds: excluded };
    }
    if (safeItemIds.length <= MAX_MERGE_IDS_IN_BODY) {
        return { selectAll: false, itemIds: safeItemIds };
    }
    return { selectAll: true };
}

export function countMergeSources(impact?: MergeImpactData | null) {
    let autoSafe = 0;
    let manual = 0;
    for (const group of impact?.groups ?? []) {
        for (const source of group.sources) {
            if (source.plan?.autoSafe) autoSafe += 1;
            else manual += 1;
        }
    }
    return { autoSafe, manual };
}

export function findImpactSource(
    impact: MergeImpactData | null | undefined,
    targetReleaseId?: string | null,
    sourceReleaseId?: string | null
): MergeImpactSource | undefined {
    if (!impact || !targetReleaseId || !sourceReleaseId) return undefined;
    const group = impact.groups.find(
        (item) => item.targetReleaseId === targetReleaseId
    );
    return group?.sources.find(
        (source) => source.sourceReleaseId === sourceReleaseId
    );
}

export function uniqueReasonCodes(
    plans: Array<MergePairPlan | null | undefined>
) {
    return Array.from(
        new Set(plans.flatMap((plan) => plan?.reasonCodes ?? []))
    );
}
