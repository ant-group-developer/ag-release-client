import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import TypeSelect from '@/components/ui/select/type-select';
import { TYPE_GRAPH, TYPE_SELECT } from '@/enums/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { SelectProps, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { FilterOrderStatistic } from '../../types/order-statistic';
import DateStatisticSelect from '../select/date-statistic-select';

type Props = {
    onChangeFilter: OnChangeFilter<FilterOrderStatistic>;
    dataFilter: FilterOrderStatistic;
};

export default function StatisticHeader({ onChangeFilter, dataFilter }: Props) {
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        // {
        //     label: messages('date.last7Days'),
        //     value: TYPE_SELECT.LAST_7_DAY,
        //     type: TYPE_GRAPH.DAY,
        //     startDate: dayjs()
        //         .subtract(7, 'day')
        //         .format(DATE_FORMAT.MYSQL_TYPE_DATE),
        //     endDate: dayjs().format(DATE_FORMAT.MYSQL_TYPE_DATE),
        // },
        {
            label: messages('date.thisMonth'),
            value: TYPE_SELECT.THIS_MONTH,
            type: TYPE_GRAPH.DAY,
            startDate: dayjs().startOf('month').toISOString(),
            endDate: dayjs().endOf('month').toISOString(),
        },
        {
            label: messages('date.lastMonth'),
            value: TYPE_SELECT.LAST_MONTH,
            type: TYPE_GRAPH.DAY,
            startDate: dayjs()
                .subtract(1, 'month')
                .startOf('month')
                .toISOString(),
            endDate: dayjs().subtract(1, 'month').endOf('month').toISOString(),
        },
        {
            label: messages('date.thisYear'),
            value: TYPE_SELECT.THIS_YEAR,
            type: TYPE_GRAPH.MONTH,
            startDate: dayjs().startOf('year').toISOString(),
            endDate: dayjs().endOf('year').toISOString(),
        },
        {
            label: messages('date.lastYear'),
            value: TYPE_SELECT.LAST_YEAR,
            type: TYPE_GRAPH.MONTH,
            startDate: dayjs()
                .subtract(1, 'year')
                .startOf('year')
                .toISOString(),
            endDate: dayjs().subtract(1, 'year').endOf('year').toISOString(),
        },
        {
            label: messages('date.last5Year'),
            value: TYPE_SELECT.LAST_5_YEAR,
            type: TYPE_GRAPH.YEAR,
            startDate: dayjs()
                .subtract(5, 'year')
                .startOf('year')
                .toISOString(),
            endDate: dayjs().endOf('year').toISOString(),
        },
    ];

    const items: TabsProps['items'] = [
        {
            key: TYPE_GRAPH.DAY,
            label: <b>{messages('date.day.byDay')}</b>,
        },
        {
            key: TYPE_GRAPH.MONTH,
            label: <b>{messages('date.month.byMonth')}</b>,
        },
        {
            key: TYPE_GRAPH.YEAR,
            label: <b>{messages('date.year.byYear')}</b>,
        },
    ];

    const handleChangeDate = (value: TYPE_SELECT, option: any) => {
        const type = option?.type;
        const startDate = option?.startDate;
        const endDate = option?.endDate;

        onChangeFilter({
            typeSelect: value,
            startDate,
            endDate,
            type,
        });
    };

    const onChangeTab = (activeKey: string) => {
        const currentOption = options.find((item) => item.type === activeKey);
        if (currentOption) {
            const { value, label, ...rest } = currentOption;
            onChangeFilter({
                ...rest,
                typeSelect: value as TYPE_SELECT,
            });
        }
    };
    return (
        <AppHeader className="sticky top-0 z-10 border-b bg-white px-4 py-0">
            <AppHeaderGroup>
                <span className="mr-2 text-base font-bold">
                    {messages('common.statisticIn')}
                </span>
                <div className="flex gap-2 pb-4 lg:pb-0">
                    <DateStatisticSelect
                        value={dataFilter.typeSelect}
                        onChange={handleChangeDate}
                        options={options}
                    />
                    <TypeSelect
                        allowClear
                        variant="filled"
                        className="min-w-[150px] font-medium"
                        placeholder={messages('productType.label')}
                        onChange={(value) =>
                            onChangeFilter({ productTypeId: value })
                        }
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end">
                <Tabs
                    items={items}
                    centered
                    activeKey={dataFilter.type}
                    onChange={onChangeTab}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}
