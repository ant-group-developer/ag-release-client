import { formattedNumber } from '@/helpers/common';
import { Progress } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportBatchStatus } from '../../enums';
import { AssetImportBatchData } from '../../types';
import { AssetImportEventData } from '../../types/payload';

type Props = {
    status?: string | null;
    summary?: Partial<AssetImportBatchData> | null;
    latestEvent?: AssetImportEventData | null;
    isListening?: boolean;
};

export default function ApplyProgress({
    status,
    summary,
    latestEvent,
    isListening,
}: Props) {
    const messages = useTranslations();

    const isApplying = status === AssetImportBatchStatus.APPLYING;

    if (!isApplying && !isListening) return null;

    const progress = latestEvent?.progress as
        | { current?: number; total?: number; label?: string }
        | undefined;
    const rows = latestEvent?.rows as { errors?: number } | undefined;
    // The first SSE frame is the raw job row (progressCurrent/progressTotal).
    // Later frames nest the same numbers under progress/rows.
    const totalRows = Number(
        progress?.total ?? latestEvent?.progressTotal ?? summary?.totalRows ?? 0
    );
    const current = Number(
        progress?.current ?? latestEvent?.progressCurrent ?? 0
    );
    const failedRows = Number(
        rows?.errors ?? latestEvent?.errorRows ?? summary?.failedRows ?? 0
    );
    const label =
        progress?.label ||
        (typeof latestEvent?.progressLabel === 'string'
            ? latestEvent.progressLabel
            : '');
    const percent =
        totalRows > 0 ? Math.round((current / totalRows) * 100) : 0;
    const isMerge = latestEvent?.sourceType === 'ASSET_IMPORT_MERGE';

    return (
        <div className="mb-3 rounded-lg border p-3">
            <Progress
                percent={percent}
                status={failedRows > 0 ? 'exception' : 'active'}
                format={() =>
                    `${formattedNumber(current)}/${formattedNumber(totalRows)}`
                }
            />
            <div className="mt-1 text-xs text-gray-500">
                {label ||
                    (isMerge
                        ? messages('assetImport.merge.progressHint')
                        : messages('assetImport.item.applyingHint'))}
            </div>
        </div>
    );
}
