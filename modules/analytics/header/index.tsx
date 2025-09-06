import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import DateSelect from '@/components/ui/select/date-select';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useTranslations } from 'next-intl';

type Props = {
    dataFilter: any;
    onChangeFilter: OnChangeFilter<any>;
};

export default function AnalyticsHeader({ dataFilter, onChangeFilter }: Props) {
    const messages = useTranslations();
    return (
        <AppHeader>
            <AppHeaderGroup className="py-2">
                <span className="mr-2 text-lg font-bold">
                    {messages('common.statisticIn')}
                </span>
                <div className="flex gap-2 pb-4 lg:pb-0">
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
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
