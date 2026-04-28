import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, TOnSearch } from '@/hooks/use-filter';
import { RELEASE_EXECUTION_STATUS } from '@/modules/release-executions/enums';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { formatEnumLabel } from '../../helpers';
import { ReleaseSubmitFilter } from '../../types';

type Props = {
    dataFilter: ReleaseSubmitFilter;
    onChangeFilter: OnChangeFilter<ReleaseSubmitFilter>;
    onSearch: TOnSearch;
};

export default function ReleaseSubmitHeader({
    dataFilter,
    onChangeFilter,
    onSearch,
}: Props) {
    const messages = useTranslations();

    const statusOptions = Object.values(RELEASE_EXECUTION_STATUS).map(
        (status) => ({
            label: formatEnumLabel(status),
            value: status,
        })
    );

    return (
        <Space className="font-normal">
            <AppSearch
                className="w-52"
                placeholder={messages('common.search')}
                onChange={onSearch}
                defaultValue={dataFilter?.keyword}
                allowClear
            />

            <Select
                options={statusOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages('releaseExecution.columns.status').toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ status: value })}
                defaultValue={dataFilter?.status}
                allowClear
                className="w-52"
            />
        </Space>
    );
}
