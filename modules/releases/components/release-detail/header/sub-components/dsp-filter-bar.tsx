import { Checkbox, Typography } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    isAllSelected: boolean;
    isIndeterminate: boolean;
    onToggleSelectAll: () => void;
    skipDistributed: boolean;
    onToggleSkipDistributed: (checked: boolean) => void;
};

export default function DspFilterBar({
    isAllSelected,
    isIndeterminate,
    onToggleSelectAll,
    skipDistributed,
    onToggleSkipDistributed,
}: Props) {
    const messages = useTranslations();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div>
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={onToggleSelectAll}
                >
                    <Typography.Text strong className="text-sm">
                        {messages('distribute.selectAll')}
                    </Typography.Text>
                </Checkbox>
            </div>

            <div>
                <Checkbox
                    checked={skipDistributed}
                    onChange={(e) => onToggleSkipDistributed(e.target.checked)}
                >
                    <Typography.Text className="text-sm font-medium">
                        {messages('distribute.skipDistributed')}
                    </Typography.Text>
                </Checkbox>
            </div>
        </div>
    );
}
