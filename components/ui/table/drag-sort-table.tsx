import { DragSortTable, DragTableProps } from '@ant-design/pro-components';

export type AppDragTableProps<RecordType extends object> = DragTableProps<
    RecordType,
    Record<string, any>
>;

export default function AppDragSortTable<RecordType extends object>({
    ...props
}: AppDragTableProps<RecordType>) {
    return (
        <DragSortTable
            search={false}
            pagination={false}
            dragSortKey="id"
            {...props}
        />
    );
}
