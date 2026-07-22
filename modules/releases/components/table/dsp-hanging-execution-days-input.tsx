import { InputNumber, Typography } from 'antd';
import { useTranslations } from 'next-intl';

interface DspHangingExecutionDaysInputProps {
    value?: number;
    onChange: (value?: number) => void;
}

export default function DspHangingExecutionDaysInput({
    value,
    onChange,
}: DspHangingExecutionDaysInputProps) {
    const messages = useTranslations();

    return (
        <div className="flex items-center gap-1.5">
            <Typography.Text
                type="secondary"
                className="whitespace-nowrap text-xs"
            >
                {messages('releaseDsp.hangingExecutionDays')}:
            </Typography.Text>
            <InputNumber
                size="small"
                min={0}
                precision={0}
                value={value}
                onChange={(val) => {
                    if (
                        val === null ||
                        val === undefined ||
                        isNaN(val) ||
                        val < 0
                    ) {
                        onChange(undefined);
                    } else {
                        onChange(val);
                    }
                }}
                className="w-32"
            />
        </div>
    );
}
