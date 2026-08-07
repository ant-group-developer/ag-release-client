import { formattedNumber } from '@/helpers/common';
import { Progress } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportBatchStatus } from '../../enums';
import { AssetImportBatchData } from '../../types';

type Props = {
    status?: string | null;
    summary?: Partial<AssetImportBatchData> | null;
    isListening?: boolean;
};

export default function ApplyProgress({ status, summary, isListening }: Props) {
    const messages = useTranslations();

    const isApplying = status === AssetImportBatchStatus.APPLYING;

    if (!isApplying && !isListening) return null;

    const totalRows = summary?.totalRows ?? 0;
    const appliedRows = summary?.appliedRows ?? 0;
    const failedRows = summary?.failedRows ?? 0;
    const processed = appliedRows + failedRows;

    const percent =
        totalRows > 0 ? Math.round((processed / totalRows) * 100) : 0;

    return (
        <div className="mb-3 rounded-lg border p-3">
            <Progress
                percent={percent}
                status={failedRows > 0 ? 'exception' : 'active'}
                format={() =>
                    `${formattedNumber(processed)}/${formattedNumber(totalRows)}`
                }
            />
            <div className="mt-1 text-xs text-gray-500">
                {messages('assetImport.item.applyingHint')}
            </div>
        </div>
    );
}
