import { InputNumber } from 'antd';
import { useState } from 'react';

const TimeInput = () => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Hàm kiểm tra và chỉ cho phép nhập số hợp lệ
    const handleChange = (type: string, value: string) => {
        // Chỉ cho phép giá trị là số và trong phạm vi hợp lệ
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
            if (type === 'hours' && numericValue >= 0 && numericValue <= 23) {
                setTime((prevTime) => ({
                    ...prevTime,
                    [type]: numericValue,
                }));
            } else if (
                (type === 'minutes' || type === 'seconds') &&
                numericValue >= 0 &&
                numericValue <= 59
            ) {
                setTime((prevTime) => ({
                    ...prevTime,
                    [type]: numericValue,
                }));
            }
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputNumber
                min={0}
                max={23}
                value={time.hours}
                onChange={(value) => handleChange('hours', String(value))}
                style={{ width: 60, marginRight: 5 }}
                formatter={(value) => String(value).padStart(2, '0')}
            />
            <span style={{ marginRight: 5 }}> : </span>
            <InputNumber
                min={0}
                max={59}
                value={time.minutes}
                onChange={(value) => handleChange('minutes', String(value))}
                style={{ width: 60, marginRight: 5 }}
                formatter={(value) => String(value).padStart(2, '0')}
            />
            <span style={{ marginRight: 5 }}> : </span>
            <InputNumber
                min={0}
                max={59}
                value={time.seconds}
                onChange={(value) => handleChange('seconds', String(value))}
                style={{ width: 60 }}
                formatter={(value) => String(value).padStart(2, '0')}
            />
        </div>
    );
};

export default TimeInput;
