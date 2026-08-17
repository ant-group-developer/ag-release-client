import { Input } from 'antd';
import { useTranslations } from 'next-intl';

interface TenantSwitchSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TenantSwitchSearch({
    value,
    onChange,
}: TenantSwitchSearchProps) {
    const messages = useTranslations();

    return (
        <div className="mb-4">
            <Input.Search
                placeholder={messages('placeholder.searchBy', {
                    value: messages('tenant.name').toLowerCase(),
                })}
                allowClear
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
