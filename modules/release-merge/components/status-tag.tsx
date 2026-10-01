'use client';

import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import {
    ReleaseMergeItemClassification,
    ReleaseMergeItemStatus,
    ReleaseMergeRunStatus,
} from '../enums';

const RUN_COLOR: Record<string, string> = {
    [ReleaseMergeRunStatus.SCANNING]: 'processing',
    [ReleaseMergeRunStatus.APPLYING]: 'processing',
    [ReleaseMergeRunStatus.READY]: 'cyan',
    [ReleaseMergeRunStatus.APPLIED]: 'success',
    [ReleaseMergeRunStatus.PARTIALLY_APPLIED]: 'warning',
    [ReleaseMergeRunStatus.FAILED]: 'error',
};

const ITEM_STATUS_COLOR: Record<string, string> = {
    [ReleaseMergeItemStatus.PENDING]: 'default',
    [ReleaseMergeItemStatus.APPLYING]: 'processing',
    [ReleaseMergeItemStatus.APPLIED]: 'success',
    [ReleaseMergeItemStatus.MANUAL_REVIEW]: 'warning',
    [ReleaseMergeItemStatus.STALE]: 'orange',
    [ReleaseMergeItemStatus.FAILED]: 'error',
};

function TranslatedTag({
    value,
    group,
    color,
}: {
    value?: string | null;
    group: 'runStatus' | 'itemStatus' | 'classification' | 'trigger';
    color?: string;
}) {
    const messages = useTranslations();
    if (!value) return <>-</>;
    const key = `releaseMerge.${group}.${value}`;
    const label = messages.has(key as never) ? messages(key as never) : value;
    return (
        <Tag color={color} className="!mr-0">
            {label}
        </Tag>
    );
}

export function RunStatusTag({ status }: { status?: string | null }) {
    return (
        <TranslatedTag
            value={status}
            group="runStatus"
            color={status ? RUN_COLOR[status] : undefined}
        />
    );
}

export function ItemStatusTag({ status }: { status?: string | null }) {
    return (
        <TranslatedTag
            value={status}
            group="itemStatus"
            color={status ? ITEM_STATUS_COLOR[status] : undefined}
        />
    );
}

export function ClassificationTag({
    classification,
}: {
    classification?: string | null;
}) {
    const color =
        classification === ReleaseMergeItemClassification.AUTO_SAFE
            ? 'success'
            : 'warning';
    return (
        <TranslatedTag
            value={classification}
            group="classification"
            color={color}
        />
    );
}

export function TriggerTag({ trigger }: { trigger?: string | null }) {
    return <TranslatedTag value={trigger} group="trigger" />;
}
