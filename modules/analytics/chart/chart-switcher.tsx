import { formattedNumber } from '@/helpers/common';
import { Card, Segmented } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AppTable from '../../../components/ui/table/normal-table';
import BarChartAnalytics from './bar-chart';
import PieChartAnalytics from './pie-chart';

type DefaultChart = 'bar' | 'pie' | 'list';

type Props = {
    title: string;
    className?: string;
    defaultChart?: DefaultChart;
    height?: number;
    maxLengthName?: number;
    data:
        | {
              value: number;
              name: string;
              color?: string;
          }[]
        | any[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const fullName = payload[0]?.payload?.user?.name || label;

        return (
            <div className="rounded border border-gray-200 bg-white p-3 shadow-lg">
                <p className="mb-2 font-medium">{fullName}</p>
                {payload.map((entry: any, index: number) => {
                    const roundValue = Math.round(entry.value);
                    return (
                        <p key={index} className="text-sm">
                            {entry.name}: {formattedNumber(roundValue)}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const formatUserName = (name: string, maxLength: number = 10) => {
    return name.length > maxLength
        ? `${name.substring(0, maxLength)}...`
        : name;
};

export default function ChartSwitcher({
    title,
    className,
    defaultChart = 'pie',
    maxLengthName = 10,
    data = [],
}: Props) {
    const [typeChart, setTypeChart] = useState<DefaultChart>(defaultChart);
    const messages = useTranslations();

    const renderChart = () => {
        switch (typeChart) {
            case 'bar':
                return (
                    <BarChartAnalytics
                        data={data}
                        maxLengthName={maxLengthName}
                    />
                );

            case 'pie':
                return <PieChartAnalytics data={data} />;

            case 'list':
                const columns: ColumnType<any>[] = [
                    {
                        title: messages('common.iNo'),
                        key: 'iNo',
                        width: 50,
                        align: 'center',
                        render: (_, __, i) => (i = i + 1),
                    },
                    {
                        title: `${messages('common.name')}`,
                        key: 'name',
                        dataIndex: 'name',
                        ellipsis: true,
                        align: 'left',
                        width: 500,
                        render: (_, record) => {
                            return <div>{record?.name}</div>;
                        },
                    },
                    {
                        title: `${messages('common.total')}`,
                        key: 'total',
                        dataIndex: 'total',
                        align: 'center',
                        render: (_, record) => {
                            const roundedValue = Math.round(record?.value || 0);
                            return <div>{formattedNumber(roundedValue)}</div>;
                        },
                    },
                ];
                return (
                    <div className="">
                        <AppTable
                            dataSource={data}
                            columns={columns}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                );

            default:
                return <></>;
        }
    };

    return (
        <Card
            title={title}
            className={className}
            bodyStyle={{
                height: '90%',
                overflowY: 'auto',
                padding: '8px 24px',
            }}
            extra={
                <Segmented
                    value={typeChart}
                    onChange={(val) => setTypeChart(val as DefaultChart)}
                    options={[
                        {
                            label: messages('common.list'),
                            value: 'list',
                        },
                        {
                            label: messages('common.barChart'),
                            value: 'bar',
                        },
                        {
                            label: messages('common.pieChart'),
                            value: 'pie',
                        },
                    ]}
                />
            }
        >
            {renderChart()}
        </Card>
    );
}
