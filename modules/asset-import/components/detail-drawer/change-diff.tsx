import { theme } from 'antd';
import { AssetImportChange } from '../../types/payload';

type Props = {
    changes?: AssetImportChange[] | null;
};

export default function ChangeDiff({ changes }: Props) {
    const { token } = theme.useToken();

    if (!changes || changes.length === 0) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <div className="flex flex-col gap-1">
            {changes.map((change, idx) => {
                const oldText = change.oldDisplay ?? (
                    change.oldValue === null || change.oldValue === undefined
                        ? ''
                        : String(change.oldValue)
                );
                const newText = change.newDisplay ?? (
                    change.newValue === null || change.newValue === undefined
                        ? ''
                        : String(change.newValue)
                );

                return (
                    <div
                        key={`${change.field}-${idx}`}
                        className="flex flex-wrap items-center gap-1 text-xs"
                    >
                        <span className="font-medium">
                            {change.label || change.field}:
                        </span>
                        {oldText && (
                            <span
                                className="line-through"
                                style={{ color: token.colorError }}
                            >
                                {oldText}
                            </span>
                        )}
                        {oldText && <span>→</span>}
                        <span style={{ color: token.colorSuccess }}>
                            {newText || '-'}
                        </span>
                        {change.note && (
                            <span
                                className="italic"
                                style={{ color: token.colorTextDescription }}
                            >
                                ({change.note})
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
