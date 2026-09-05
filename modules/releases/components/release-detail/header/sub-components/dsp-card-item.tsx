import { FALLBACK_IMAGE } from '@/constants/common';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import ReleaseDspStatusTag from '@/modules/release-dsp/components/release-dsp-status-tag';
import { Avatar, Checkbox, Typography, theme } from 'antd';

type Props = {
    row: ReleaseDspData;
    isSelected: boolean;
    onToggleSelect: (code: string) => void;
};

export default function DspCardItem({ row, isSelected, onToggleSelect }: Props) {
    const { token } = theme.useToken();
    const code = row.dsp?.code || '';
    const name = row.dsp?.name || code;

    const issueText = useMemoIssueText(row.issues);

    const handleClick = () => {
        if (code) {
            onToggleSelect(code);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-3 transition-all hover:shadow-xs"
            style={{
                borderColor: isSelected
                    ? token.colorPrimary
                    : token.colorBorderSecondary,
                backgroundColor: isSelected
                    ? token.colorPrimaryBg
                    : token.colorBgContainer,
            }}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        if (code) onToggleSelect(code);
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                <Avatar
                    src={row.dsp?.picture || FALLBACK_IMAGE}
                    alt={name}
                    size={32}
                    shape="square"
                    className="shrink-0 !rounded-lg"
                />
                <div className="min-w-0 flex-1">
                    <Typography.Text
                        strong
                        ellipsis={{ tooltip: name }}
                        className="block text-sm font-semibold leading-tight"
                    >
                        {name}
                    </Typography.Text>
                    {issueText && (
                        <Typography.Text
                            type="danger"
                            ellipsis={{ tooltip: issueText }}
                            className="block text-xs font-normal leading-tight"
                        >
                            {issueText}
                        </Typography.Text>
                    )}
                </div>
            </div>

            <div className="shrink-0">
                <ReleaseDspStatusTag status={row.status} />
            </div>
        </div>
    );
}

function useMemoIssueText(issues: any): string | null {
    if (!issues) return null;
    if (typeof issues === 'string') return issues;
    if (Array.isArray(issues) && issues.length > 0) {
        const first = issues[0];
        return typeof first === 'string' ? first : first?.message || first?.reason || null;
    }
    if (typeof issues === 'object') {
        return issues.message || issues.reason || issues.description || null;
    }
    return null;
}
