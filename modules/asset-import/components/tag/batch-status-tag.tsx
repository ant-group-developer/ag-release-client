import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportBatchStatus } from '../../enums';

type Props = {
    status?: string | null;
};

export const getBatchStatusColor = (status: AssetImportBatchStatus) => {
    switch (status) {
        case AssetImportBatchStatus.SCANNING:
        case AssetImportBatchStatus.APPLYING:
            return 'processing';
        case AssetImportBatchStatus.SCANNED:
            return 'cyan';
        case AssetImportBatchStatus.APPLIED:
            return 'success';
        case AssetImportBatchStatus.PARTIALLY_APPLIED:
            return 'warning';
        case AssetImportBatchStatus.FAILED:
            return 'error';
        case AssetImportBatchStatus.CANCELLED:
            return 'orange';
        default:
            return 'default';
    }
};

export default function BatchStatusTag({ status }: Props) {
    const message = useTranslations();

    if (!status) return <>-</>;

    const translationKey = `assetImport.batch.status.${status}`;
    const label = message.has(translationKey as any)
        ? message(translationKey as any)
        : status;

    return (
        <Tag
            color={getBatchStatusColor(status as AssetImportBatchStatus)}
            className="!mr-0"
        >
            {label}
        </Tag>
    );
}
