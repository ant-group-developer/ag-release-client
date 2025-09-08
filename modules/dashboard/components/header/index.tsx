import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import DateSelect from '@/components/ui/select/date-select';
import { TYPE_GRAPH, TYPE_SELECT } from '@/enums/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { TabsProps, theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    dataFilter: any;
    onChangeFilter: OnChangeFilter<any>;
};

export default function DashboardHeader({ dataFilter, onChangeFilter }: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();

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
        if (!option) return;

        const startDate = option.startDate;
        const endDate = option.endDate;
        const type = option.value.startsWith('month')
            ? TYPE_GRAPH.DAY
            : TYPE_GRAPH.MONTH;

        // onChangeFilter({
        //     startDate,
        //     endDate,
        //     type,
        // });
    };

    const onChangeTab = (activeKey: string) => {
        // const currentOption = options.find((item) => item.type === activeKey);
        // if (currentOption) {
        //     const { value, label, ...rest } = currentOption;
        //     // onChangeFilter({
        //     //     ...rest,
        //     //     typeSelect: value as TYPE_SELECT,
        //     // });
        // }
    };
    return (
        <AppHeader
            className="sticky top-0 z-10 border-b px-0 py-0 dark:border-b-zinc-800"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            <AppHeaderGroup className="p-4">
                <span className="mr-2 text-lg font-bold">
                    {messages('common.statisticIn')}
                </span>
                <div className="flex gap-2 pb-4 lg:pb-0">
                    {/* <DateStatisticSelect onChange={handleChangeDate} /> */}
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
            {/* <AppHeaderGroup position="end" className="px-4">
                <Tabs
                    items={items}
                    centered
                    // activeKey={dataFilter.type}
                    onChange={onChangeTab}
                />
            </AppHeaderGroup> */}
        </AppHeader>
    );
}
