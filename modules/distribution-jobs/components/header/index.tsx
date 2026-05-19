import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, TOnSearch } from '@/hooks/use-filter';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import {
    DISTRIBUTION_JOB_TYPE,
    DistributionJobFilter,
    DistributionJobStatus,
} from '../../types';

type Props = {
    dataFilter: DistributionJobFilter;
    onChangeFilter: OnChangeFilter<DistributionJobFilter>;
    onSearch: TOnSearch;
};

const STATUS_OPTIONS: DistributionJobStatus[] = [
    'pending',
    'processing',
    'completed',
    'failed',
    'skipped',
];

const TYPE_OPTIONS = [
    DISTRIBUTION_JOB_TYPE.EMAIL_STATE51,
    DISTRIBUTION_JOB_TYPE.ADMIN_EXPORT,
];

export default function DistributionJobsHeader({
    dataFilter,
    onChangeFilter,
    onSearch,
}: Props) {
    const messages = useTranslations();

    const statusOptions = STATUS_OPTIONS.map((status) => ({
        label: messages(`distributionJobs.statusOptions.${status}` as any),
        value: status,
    }));

    const typeOptions = TYPE_OPTIONS.map((type) => ({
        label: messages(
            `distributionJobs.typeOptions.${type.toUpperCase()}` as any
        ),
        value: type,
    }));

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
                options={typeOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'distributionJobs.columns.type'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ type: value })}
                defaultValue={dataFilter?.type}
                allowClear
                className="w-52"
            />

            {/* <Select
                options={statusOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'distributionJobs.columns.status'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ status: value })}
                defaultValue={dataFilter?.status}
                allowClear
                className="w-52"
            /> */}
        </Space>
    );
}
