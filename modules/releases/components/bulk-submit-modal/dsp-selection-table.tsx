import AppProTable from '@/components/ui/table/pro-table';
import { DSP_DEAL } from '@/modules/dsp/enums';
import { DspData } from '@/modules/dsp/types';
import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Space, TableProps } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

const VIA_CI = 'CI';
const VIA_STATE51 = 'State51';
const MODE_AGGREGATOR = 'Aggregator';

type DspSelectionTableProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
} & TableProps<DspData>;

const DspSelectionTable = ({
    value = [],
    onChange,
    dataSource,
    loading,
    ...props
}: DspSelectionTableProps) => {
    const messages = useTranslations();

    const columns: ProColumns<DspData>[] = [
        {
            title: messages('dsp.name'),
            key: 'name',
            dataIndex: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar size={24} src={record?.picture || undefined}>
                        {record?.name?.[0]}
                    </Avatar>
                    <span>{record.name}</span>
                </Space>
            ),
        },
        {
            title: messages('common.releaseVia'),
            key: 'releaseVia',
            render: (_, record) => {
                const via = record?.hasDeal ? VIA_CI : VIA_STATE51;
                return <span>{via}</span>;
            },
        },
        {
            title: messages('common.distributionMethod'),
            key: 'distributionMethod',
            render: (_, record) => {
                const mode =
                    record?.dspRoutingConfig?.mode === DSP_DEAL.DIRECT
                        ? messages('common.direct')
                        : MODE_AGGREGATOR;
                return <span>{mode}</span>;
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys: value,
        onChange: (selectedRowKeys: Key[]) => {
            onChange?.(selectedRowKeys as string[]);
        },
    };

    return (
        <AppProTable
            rowKey="code"
            loading={loading}
            rowSelection={rowSelection}
            pagination={false}
            options={false}
            tableAlertRender={false}
            tableAlertOptionRender={false}
            scroll={{
                y: 300,
                x: 'max-content',
            }}
            onRow={(record) => ({
                onClick: () => {
                    const key = record.code;
                    const nextValue = value.includes(key)
                        ? value.filter((id) => id !== key)
                        : [...value, key];
                    onChange?.(nextValue);
                },
            })}
            {...props}
            dataSource={dataSource}
            columns={columns}
        />
    );
};

export default DspSelectionTable;
