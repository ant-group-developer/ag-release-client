import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Switch, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ENRICH_SCAN_SCHEDULE } from '../../enums';
import { useUpdateEnrichScanSchedule } from '../../hooks/use-update';
import {
    EnrichScanScheduleData,
    EnrichScanScheduleDataFilter,
} from '../../types';

type Props = Omit<AppTableProps<EnrichScanScheduleData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: EnrichScanScheduleDataFilter;
};

export default function EnrichScanScheduleTable({
    dataFilter,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateEnrichScanSchedule } = useUpdateEnrichScanSchedule();
    void dataFilter;

    const renderBoolean = (value: boolean) => {
        return (
            <Tag color={value ? 'success' : 'default'}>
                {messages(value ? 'common.yes' : 'common.no')}
            </Tag>
        );
    };

    const columns: ColumnType<EnrichScanScheduleData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('reportConfigs.enrichScanSchedules.name'),
            key: 'name',
            dataIndex: 'name',
            width: 180,
            ellipsis: true,
        },
        {
            title: messages('reportConfigs.enrichScanSchedules.enabled'),
            key: 'enabled',
            dataIndex: 'enabled',
            width: 110,
            align: 'center',
            render: (value, record) => (
                <Switch
                    checked={!!value}
                    checkedChildren={messages('status.enable')}
                    unCheckedChildren={messages('status.disable')}
                    onChange={(checked) =>
                        updateEnrichScanSchedule({
                            id: record.id,
                            payload: { enabled: checked },
                        })
                    }
                />
            ),
        },
        {
            title: messages('reportConfigs.enrichScanSchedules.cronExpression'),
            key: 'cronExpression',
            dataIndex: 'cronExpression',
            width: 140,
            align: 'center',
            render: (value) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: messages('reportConfigs.enrichScanSchedules.timezone'),
            key: 'timezone',
            dataIndex: 'timezone',
            width: 140,
            align: 'center',
        },

        {
            title: messages('reportConfigs.enrichScanSchedules.limitCount'),
            key: 'limitCount',
            dataIndex: 'limitCount',
            width: 110,
            align: 'right',
            render: (val) => val ?? '-',
        },
        {
            key: 'actions',
            width: 90,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() =>
                        openModal(
                            TYPE_MODAL_ENRICH_SCAN_SCHEDULE.UPDATE,
                            record
                        )
                    }
                    onShowDelete={() =>
                        openModal(
                            TYPE_MODAL_ENRICH_SCAN_SCHEDULE.DELETE,
                            record
                        )
                    }
                />
            ),
        },
    ];

    return <AppTable {...props} columns={columns} pagination={false} />;
}
