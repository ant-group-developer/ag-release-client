import AppSearch from '@/components/ui/input/search';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { FTP_EXCLUDE_PATTERN_SCOPE, PATTERN_TYPE } from '../../enums';

export interface FtpExcludePatternFilterState {
    keyword?: string;
    scope?: FTP_EXCLUDE_PATTERN_SCOPE[];
    patternType?: PATTERN_TYPE;
    isActive?: string;
}

interface Props {
    filter: FtpExcludePatternFilterState;
    onChangeFilter: (newFilter: Partial<FtpExcludePatternFilterState>) => void;
}

export default function FtpExcludePatternTableFilter({
    filter,
    onChangeFilter,
}: Props) {
    const messages = useTranslations();

    const scopeOptions = [
        { label: 'Folder', value: FTP_EXCLUDE_PATTERN_SCOPE.FOLDER },
        { label: 'File', value: FTP_EXCLUDE_PATTERN_SCOPE.FILE },
    ];

    const patternTypeOptions = [
        { label: 'Contains', value: PATTERN_TYPE.CONTAINS },
        { label: 'Regex', value: PATTERN_TYPE.REGEX },
    ];

    const isActiveOptions = [
        { label: messages('status.active'), value: 'true' },
        { label: messages('status.inActive'), value: 'false' },
    ];

    return (
        <Space size="middle">
            <AppSearch
                onChange={(e) => onChangeFilter({ keyword: e.target.value })}
                value={filter.keyword}
                style={{ width: 220 }}
            />
            <Select
                mode="multiple"
                maxTagCount="responsive"
                options={scopeOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'reportConfigs.sftpExcludePatterns.scope'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ scope: value })}
                value={filter.scope}
                allowClear
                style={{ minWidth: 200 }}
            />
            <Select
                options={patternTypeOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'reportConfigs.sftpExcludePatterns.patternType'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ patternType: value })}
                value={filter.patternType}
                allowClear
                style={{ minWidth: 160 }}
            />
            <Select
                options={isActiveOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'reportConfigs.sftpExcludePatterns.isActive'
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
