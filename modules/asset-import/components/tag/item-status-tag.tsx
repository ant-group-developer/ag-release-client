import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportItemStatus } from '../../enums';

type Props = {
    status?: string | null;
};

export const getItemStatusColor = (status: AssetImportItemStatus) => {
    switch (status) {
        case AssetImportItemStatus.PENDING:
            return 'default';
        case AssetImportItemStatus.APPLIED:
            return 'success';
        case AssetImportItemStatus.SKIPPED:
            return 'warning';
        case AssetImportItemStatus.FAILED:
            return 'error';
        default:
            return 'default';
    }
};

export default function ItemStatusTag({ status }: Props) {
    const message = useTranslations();

    if (!status) return <>-</>;

    const translationKey = `assetImport.item.status.${status}`;
    const label = message.has(translationKey as any)
        ? message(translationKey as any)
        : status;

    return (
        <Tag
            color={getItemStatusColor(status as AssetImportItemStatus)}
            className="!mr-0"
        >
            {label}
        </Tag>
    );
}
