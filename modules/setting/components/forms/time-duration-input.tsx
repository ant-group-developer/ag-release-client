import { InputNumber, Select, Space, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const { Text } = Typography;

export type DurationUnit = 'seconds' | 'minutes' | 'hours' | 'days';

export interface TimeDurationPreset {
    label: string;
    seconds: number;
}

interface Props {
    value?: number;
    onChange?: (value: number | undefined) => void;
    min?: number;
    max?: number;
    availableUnits?: DurationUnit[];
    presets?: TimeDurationPreset[];
    disabled?: boolean;
}

const UNIT_MULTIPLIERS: Record<DurationUnit, number> = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
};

export default function TimeDurationInput({
    value,
    onChange,
    min,
    max,
    availableUnits = ['seconds', 'minutes', 'hours', 'days'],
    presets,
    disabled = false,
}: Props) {
    const messages = useTranslations();

    // Phân rã số giây thành amount và unit multiplier phù hợp nhất
    const decomposeSeconds = (
        sec?: number
    ): { amount?: number; multiplier: number } => {
        if (sec == null || isNaN(sec)) {
            return {
                amount: undefined,
                multiplier: availableUnits.includes('hours')
                    ? 3600
                    : availableUnits.includes('minutes')
                      ? 60
                      : 1,
            };
        }

        if (
            availableUnits.includes('days') &&
            sec >= 86400 &&
            sec % 86400 === 0
        ) {
            return { amount: sec / 86400, multiplier: 86400 };
        }
        if (availableUnits.includes('hours') && sec >= 3600 && sec % 3600 === 0) {
            return { amount: sec / 3600, multiplier: 3600 };
        }
        if (availableUnits.includes('minutes') && sec >= 60 && sec % 60 === 0) {
            return { amount: sec / 60, multiplier: 60 };
        }
        if (availableUnits.includes('seconds')) {
            return { amount: sec, multiplier: 1 };
        }
        if (availableUnits.includes('hours')) {
            return {
                amount: Number((sec / 3600).toFixed(2)),
                multiplier: 3600,
            };
        }
        return {
            amount: Number((sec / 60).toFixed(2)),
            multiplier: 60,
        };
    };

    const initial = decomposeSeconds(value);
    const [amount, setAmount] = useState<number | undefined>(initial.amount);
    const [multiplier, setMultiplier] = useState<number>(initial.multiplier);

    useEffect(() => {
        const decomposed = decomposeSeconds(value);
        setAmount(decomposed.amount);
        setMultiplier(decomposed.multiplier);
    }, [value]);

    const unitOptions = useMemo(() => {
        const labels: Record<DurationUnit, string> = {
            seconds: messages('common.seconds'),
            minutes: messages('common.minutes'),
            hours: messages('common.hours'),
            days: messages('common.days'),
        };

        return availableUnits.map((u) => ({
            value: UNIT_MULTIPLIERS[u],
            label: labels[u],
        }));
    }, [availableUnits, messages]);

    const handleAmountChange = (newAmount: number | null) => {
        const amt = newAmount != null ? Number(newAmount) : undefined;
        setAmount(amt);
        if (amt != null) {
            const totalSec = Math.round(amt * multiplier);
            onChange?.(totalSec);
        } else {
            onChange?.(undefined);
        }
    };

    const handleMultiplierChange = (newMultiplier: number) => {
        setMultiplier(newMultiplier);
        if (amount != null) {
            const totalSec = Math.round(amount * newMultiplier);
            onChange?.(totalSec);
        }
    };

    const handleSelectPreset = (sec: number) => {
        const decomposed = decomposeSeconds(sec);
        setAmount(decomposed.amount);
        setMultiplier(decomposed.multiplier);
        onChange?.(sec);
    };

    const currentTotalSeconds =
        amount != null ? Math.round(amount * multiplier) : undefined;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <Space.Compact className="w-full">
                <InputNumber
                    className="!w-full"
                    min={0.1}
                    step={1}
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={disabled}
                    placeholder="0"
                />
                <Select
                    value={multiplier}
                    onChange={handleMultiplierChange}
                    options={unitOptions}
                    style={{ minWidth: 105 }}
                    disabled={disabled}
                />
            </Space.Compact>

            <div className="flex flex-wrap items-center justify-between gap-2">
                <Text type="secondary" className="text-xs">
                    {messages('common.converted')}:{' '}
                    <Text strong>
                        {currentTotalSeconds != null
                            ? currentTotalSeconds.toLocaleString()
                            : 0}{' '}
                        {messages('common.seconds')}
                    </Text>
                </Text>

                {presets && presets.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                        {presets.map((preset) => {
                            const isSelected = currentTotalSeconds === preset.seconds;
                            return (
                                <Tag.CheckableTag
                                    key={preset.seconds}
                                    checked={isSelected}
                                    onChange={() => handleSelectPreset(preset.seconds)}
                                    className="cursor-pointer text-xs"
                                >
                                    {preset.label}
                                </Tag.CheckableTag>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
