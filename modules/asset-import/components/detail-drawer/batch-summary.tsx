'use client';

import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportAction } from '../../enums';
import { AssetImportBatchSummary } from '../../types';

type Props = {
    summary?: AssetImportBatchSummary | null;
};

const SUMMARY_ITEMS: { action: AssetImportAction; tone?: string }[] = [
    { action: AssetImportAction.UPDATE, tone: 'processing' },
    { action: AssetImportAction.CREATE, tone: 'success' },
    { action: AssetImportAction.MERGE_REQUIRED, tone: 'purple' },
    { action: AssetImportAction.CONFLICT, tone: 'warning' },
    { action: AssetImportAction.NO_CHANGE },
    { action: AssetImportAction.INVALID, tone: 'error' },
];

export default function BatchSummary({ summary }: Props) {
    const messages = useTranslations();
    if (!summary) return null;

    return (
        <div className="mb-3 flex flex-wrap gap-2">
            {SUMMARY_ITEMS.map((item) => {
                const count = summary.byAction?.[item.action] ?? 0;
                return (
                    <Tag key={item.action} color={item.tone} className="!mr-0">
                        {messages(`assetImport.item.action.${item.action}`)}: {count}
                    </Tag>
                );
            })}
        </div>
    );
}
