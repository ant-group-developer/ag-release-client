'use client';

import { Input } from 'antd';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {
    value?: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
};

export default function InputFilterContent({
    value: externalValue,
    onChange,
    placeholder,
}: Props) {
    const messages = useTranslations();
    const [value, setValue] = useState(externalValue || '');

    // Sync with external value
    useEffect(() => {
        setValue(externalValue || '');
    }, [externalValue]);

    const handlePressEnter = () => {
        const trimmed = value.trim();
        onChange(trimmed || undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        const trimmed = value.trim();
        onChange(trimmed || undefined);
    };

    return (
        <div className="flex flex-col gap-2 py-2">
            <Input
                prefix={<Search size={14} className="text-gray-400" />}
                placeholder={
                    placeholder || messages('common.search')
                }
                value={value}
                onChange={handleChange}
                onPressEnter={handlePressEnter}
                onBlur={handleBlur}
                allowClear
                onClear={() => onChange(undefined)}
            />
        </div>
    );
}
