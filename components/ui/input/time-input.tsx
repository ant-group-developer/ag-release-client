import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import AppFormItem from '../antd-form/form-Item';

interface TimeInputProps {
    value?: { hours: number; minutes: number; seconds: number };
    onChange?: (value: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    name: string;
}

const TimeInput = ({ value, onChange, name }: TimeInputProps) => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (value) {
            setTime(value);
        }
    }, [value]);

    const handleChange = (type: string, value: string) => {
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
            let newTime = { ...time };
            if (type === 'hours' && numericValue >= 0 && numericValue <= 23) {
                newTime = { ...newTime, [type]: numericValue };
            } else if (
                (type === 'minutes' || type === 'seconds') &&
                numericValue >= 0 &&
                numericValue <= 59
            ) {
                newTime = { ...newTime, [type]: numericValue };
            }
            setTime(newTime);
            onChange?.(newTime);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <AppFormItem name={`${name}Hours`} className="!mb-0">
                <InputNumber
                    min={0}
                    max={23}
                    value={time.hours}
                    onChange={(value) => handleChange('hours', String(value))}
                    style={{ width: 60, marginRight: 5 }}
                    formatter={(value) => String(value).padStart(2, '0')}
                />
            </AppFormItem>
            <span style={{ marginRight: 5 }}> : </span>
            <AppFormItem name={`${name}Minutes`} className="!mb-0">
                <InputNumber
                    min={0}
                    max={59}
                    value={time.minutes}
                    onChange={(value) => handleChange('minutes', String(value))}
                    style={{ width: 60, marginRight: 5 }}
                    formatter={(value) => String(value).padStart(2, '0')}
                />
            </AppFormItem>
            <span style={{ marginRight: 5 }}> : </span>
            <AppFormItem name={`${name}Seconds`} className="!mb-0">
                <InputNumber
                    min={0}
                    max={59}
                    value={time.seconds}
                    onChange={(value) => handleChange('seconds', String(value))}
                    style={{ width: 60 }}
                    formatter={(value) => String(value).padStart(2, '0')}
                />
            </AppFormItem>
        </div>
    );
};

export default TimeInput;
