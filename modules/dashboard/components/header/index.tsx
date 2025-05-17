import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { TYPE_GRAPH, TYPE_SELECT } from '@/enums/common';
import { SelectProps, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import DateStatisticSelect from '../select/date-select';

type Props = {};

export default function DashboardHeader({}: Props) {
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
            label: (
                <span className="font-medium">
                    {messages('date.day.byDay')}
                </span>
            ),
        },
        {
            key: TYPE_GRAPH.MONTH,
            label: (
                <span className="font-medium">
                    {messages('date.month.byMonth')}
                </span>
            ),
        },
        {
            key: TYPE_GRAPH.YEAR,
            label: (
                <span className="font-medium">
                    {messages('date.year.byYear')}
                </span>
            ),
        },
    ];

    const handleChangeDate = (value: TYPE_SELECT, option: any) => {
        const type = option?.type;
        const startDate = option?.startDate;
        const endDate = option?.endDate;

        // onChangeFilter({
        //     typeSelect: value,
        //     startDate,
        //     endDate,
        //     type,
        // });
    };

    const onChangeTab = (activeKey: string) => {
        const currentOption = options.find((item) => item.type === activeKey);
        if (currentOption) {
            const { value, label, ...rest } = currentOption;
            // onChangeFilter({
            //     ...rest,
            //     typeSelect: value as TYPE_SELECT,
            // });
        }
    };
    return (
        <AppHeader className="sticky top-0 z-10 border-b bg-white px-0 py-0 dark:border-b-zinc-800 dark:bg-black">
            <AppHeaderGroup className="px-4">
                <span className="mr-2 text-lg font-bold">
                    {messages('common.statisticIn')}
                </span>
                <div className="flex gap-2 pb-4 lg:pb-0">
                    <DateStatisticSelect
                        // value={dataFilter.typeSelect}
                        onChange={handleChangeDate}
                        options={options}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="px-4">
                <Tabs
                    items={items}
                    centered
                    // activeKey={dataFilter.type}
                    onChange={onChangeTab}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}
