import AppSearch from '@/components/ui/input/search';
import { DATE_FORMAT } from '@/enums/common';
import { OnChangeFilter, TOnSearch } from '@/hooks/use-filter';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import {
    DISTRIBUTION_JOB_STATUS,
    DISTRIBUTION_JOB_TYPE,
    DistributionJobFilter,
} from '../../types';

type Props = {
    dataFilter: DistributionJobFilter;
    onChangeFilter: OnChangeFilter<DistributionJobFilter>;
    onSearch: TOnSearch;
};

const STATUS_OPTIONS = Object.values(DISTRIBUTION_JOB_STATUS);

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
                onChange={(e) => {
                    onChangeFilter({
                        upcs: e.target.value?.trim(),
                    });
                }}
                defaultValue={dataFilter?.upcs}
                allowClear
            />

            <DatePicker
                allowClear
                placeholder={messages('common.date')}
                className="w-52"
                onChange={(date) => {
                    onChangeFilter({
                        dateGroup: date ? date.format('YYYY-MM-DD') : undefined,
                    });
                }}
                defaultValue={
                    dataFilter?.dateGroup
                        ? dayjs(dataFilter.dateGroup)
                        : undefined
                }
                format={DATE_FORMAT.DATE_ONLY}
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

            <Select
                mode="multiple"
                options={statusOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'distributionJobs.columns.status'
                    ).toLowerCase(),
                })}
                onChange={(value: string[]) =>
                    onChangeFilter({
                        status: value?.length ? value.join(',') : undefined,
                    })
                }
                defaultValue={
                    dataFilter?.status
                        ? dataFilter.status.split(',')
                        : undefined
                }
                allowClear
                className="w-52"
                maxTagCount="responsive"
            />
        </Space>
    );
}
