import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportAction } from '../../enums';

type Props = {
    action?: string | null;
};

export const getItemActionColor = (action: AssetImportAction) => {
    switch (action) {
        case AssetImportAction.CREATE:
            return 'success';
        case AssetImportAction.UPDATE:
            return 'processing';
        case AssetImportAction.NO_CHANGE:
            return 'default';
        case AssetImportAction.INVALID:
            return 'error';
        case AssetImportAction.CONFLICT:
            return 'warning';
        case AssetImportAction.MERGE_REQUIRED:
            return 'purple';
        default:
            return 'default';
    }
};

export default function ItemActionTag({ action }: Props) {
    const message = useTranslations();

    if (!action) return <>-</>;

    const translationKey = `assetImport.item.action.${action}`;
    const label = message.has(translationKey as any)
        ? message(translationKey as any)
        : action;

    return (
        <Tag
            color={getItemActionColor(action as AssetImportAction)}
            className="!mr-0"
        >
            {label}
        </Tag>
    );
}
