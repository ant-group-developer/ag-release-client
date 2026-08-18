import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Space } from 'antd';
import { useTranslations } from 'next-intl';

export interface FtpProviderConfigFilterState {
    keyword?: string;
    isActive?: string;
}

interface Props {
    filter: FtpProviderConfigFilterState;
    onChangeFilter: (newFilter: Partial<FtpProviderConfigFilterState>) => void;
}

export default function FtpProviderConfigTableFilter({
    filter,
    onChangeFilter,
}: Props) {
    const messages = useTranslations();

    const isActiveOptions = [
        { label: messages('status.active'), value: 'true' },
        { label: messages('status.inActive'), value: 'false' },
    ];

    return (
        <Space size="middle" wrap>
            <Input
                allowClear
                placeholder={messages('form.searchPlaceholder')}
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={filter.keyword}
                onChange={(e) => onChangeFilter({ keyword: e.target.value })}
                style={{ width: 260 }}
            />
            <Select
                options={isActiveOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'reportConfigs.ftpProviderConfig.isActive'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ isActive: value })}
                value={filter.isActive}
                allowClear
                style={{ minWidth: 160 }}
            />
        </Space>
    );
}
