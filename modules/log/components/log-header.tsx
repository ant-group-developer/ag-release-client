import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import DateSelect from '@/components/ui/select/date-select';
import { UseFilterProps } from '@/hooks/use-filter';
import { DataFilterLog } from '../types/data';
import LogStatusSelect from './log-status-select';
import MethodSelect from './method-select';

type Props = {} & Pick<
    UseFilterProps<DataFilterLog>,
    'onSearch' | 'dataFilter' | 'onChangeFilter'
>;

function LogHeader({ onSearch, dataFilter, onChangeFilter }: Props) {
    return (
        <AppHeader>
            <AppHeaderGroup>
                <AppSearch
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
                />
                <MethodSelect
                    className="w-full lg:w-52"
                    value={dataFilter.action}
                    onChange={(value) => onChangeFilter({ action: value })}
                />
                <LogStatusSelect
                    className="w-full lg:w-52"
                    value={dataFilter.success}
                    onChange={(value) => onChangeFilter({ success: value })}
                />
                <DateSelect
                    selectClassName="w-[150px]"
                    rangeClassName="w-[250px]"
                    externalOnChange={(fromDate, toDate) =>
                        onChangeFilter({
                            startDateCreated: fromDate,
                            endDateCreated: toDate,
                        })
                    }
                    value={`${dataFilter.startDateCreated},${dataFilter.endDateCreated}`}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}

export default LogHeader;
