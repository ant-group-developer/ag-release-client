import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, TOnSearch } from '@/hooks/use-filter';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { RELEASE_EXECUTION_STATUS } from '../../enums';
import { ReleaseExecutionFilter } from '../../types';

type Props = {
    dataFilter: ReleaseExecutionFilter;
    onChangeFilter: OnChangeFilter<ReleaseExecutionFilter>;
    onSearch: TOnSearch;
};

export default function ReleaseExecutionHeader({
    dataFilter,
    onChangeFilter,
    onSearch,
}: Props) {
    const messages = useTranslations();

    const statusOptions = Object.values(RELEASE_EXECUTION_STATUS).map(
        (status) => ({
            label: messages(`releaseExecution.statusOptionsV2.${status}`),
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
                    value: messages(
                        'releaseExecution.columns.status'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ status: value })}
                defaultValue={dataFilter?.status}
                allowClear
                className="w-52"
            />
        </Space>
    );
}
