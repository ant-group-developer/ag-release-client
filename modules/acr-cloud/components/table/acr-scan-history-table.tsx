import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { CommonAttribute } from '@/types/api';
import { ColumnType } from 'antd/es/table';

export interface TrackScanStatusData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    status: TRACK_SCAN_STATUS;
}
export enum TRACK_SCAN_STATUS {
    RUNNING = 'running',
    PENDING = 'pending',
    FINISHED = 'finished',
    CANCEL = 'cancel',
}

type Props = Omit<AppTableProps<TrackScanStatusData>, 'columns'> & {};

export default function AcrScanHistoryTable({ ...props }: Props) {
    const columns: ColumnType<TrackScanStatusData>[] = [{}];
    return <AppTable {...props} />;
}
