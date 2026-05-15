import DateRangePicker from '@/components/ui/input/date-range-picker';
import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter } from '@/hooks/use-filter';
import DspSelect from '@/modules/dsp/components/select/dsp-select';
import { Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { RELEASE_LOG_STATUS } from '../../enums';
import { ReleaseLogFilter } from '../../types';

interface Props {
    dataFilter: ReleaseLogFilter;
    onChangeFilter: OnChangeFilter<ReleaseLogFilter>;
}

const ReleaseLogTableFilter = ({ dataFilter, onChangeFilter }: Props) => {
    const messages = useTranslations();

    const releaseStatus = Object.values(RELEASE_LOG_STATUS).map((item) => ({
        label: <span className="capitalize">{item.toLowerCase()}</span>,
        value: item,
    }));

    return (
        <Space className="font-normal">
            <AppSearch
                placeholder={messages('common.search')}
                onChange={(e) => onChangeFilter({ keyword: e.target.value })}
                defaultValue={dataFilter.keyword}
                allowClear
                style={{ width: 200 }}
            />

            <Select
                options={releaseStatus}
                placeholder={messages('placeholder.filterBy', {
                    value: messages('releaseLog.statusLog').toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ status: value })}
                defaultValue={dataFilter?.status}
                allowClear
                style={{ minWidth: 200 }}
            />
            <DspSelect
                placeholder={messages('placeholder.filterBy', {
                    value: messages('dsp.label').toLowerCase(),
                })}
                mode="tags"
                onChange={(value) =>
                    onChangeFilter({ dspIds: value.join(',') })
                }
                defaultValue={dataFilter?.dspIds?.split(',')}
                allowClear
                maxTagCount={2}
                style={{ minWidth: 200 }}
            />
            <DateRangePicker
                value={
                    dataFilter.startCreatedAt && dataFilter.endCreatedAt
                        ? [
                              dayjs(dataFilter.startCreatedAt),
                              dayjs(dataFilter.endCreatedAt),
                          ]
                        : null
                }
                externalOnChange={(start, end) =>
                    onChangeFilter({
                        startCreatedAt: start,
                        endCreatedAt: end,
                    })
                }
                style={{ width: 200 }}
            />
        </Space>
    );
};

export default ReleaseLogTableFilter;
