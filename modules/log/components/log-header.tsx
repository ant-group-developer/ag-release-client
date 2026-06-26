import AppSearch from '@/components/ui/input/search';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Space } from 'antd';
import { useTranslations } from 'next-intl';
import { DataFilterLogs } from '../types/data';
import { LogLevelsSelect } from './select/log-levels-select';
import { LogModulesSelect } from './select/log-modules-select';
import { LogTypesSelect } from './select/log-types-select';

interface Props {
    dataFilter: DataFilterLogs;
    onChangeFilter: OnChangeFilter<DataFilterLogs>;
    onSearch: (value: any) => void;
}

function LogHeader({ dataFilter, onChangeFilter, onSearch }: Props) {
    const messages = useTranslations();

    return (
        <Space className="font-normal" wrap>
            <AppSearch
                className="max-w-52"
                onChange={onSearch}
                defaultValue={dataFilter.keyword}
            />
            <LogLevelsSelect
                mode="multiple"
                placeholder={messages('log.columns.level')}
                onChange={(value) =>
                    onChangeFilter({ level: arrayToString(value) })
                }
                value={arrayFromString(dataFilter.level)}
                allowClear
                maxTagCount="responsive"
                style={{ minWidth: 220 }}
            />
            <LogTypesSelect
                mode="multiple"
                placeholder={messages('log.columns.type')}
                onChange={(value) =>
                    onChangeFilter({ type: arrayToString(value) })
                }
                value={arrayFromString(dataFilter.type)}
                allowClear
                maxTagCount="responsive"
                style={{ minWidth: 220 }}
            />
            <LogModulesSelect
                mode="multiple"
                placeholder={messages('log.columns.module')}
                onChange={(value) =>
                    onChangeFilter({ module: arrayToString(value) })
                }
                value={arrayFromString(dataFilter.module)}
                allowClear
                maxTagCount="responsive"
                style={{ minWidth: 220 }}
            />
        </Space>
    );
}

export default LogHeader;
