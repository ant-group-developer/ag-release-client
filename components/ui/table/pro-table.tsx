import { SCREEN } from '@/enums/common';
import { cn } from '@/helpers/common';
import { ProTable, ProTableProps } from '@ant-design/pro-components';

export type AppProTableProps<RecordType extends object> = ProTableProps<
    RecordType,
    Record<string, any>
>;

export default function AppProTable<RecordType extends object>({
    scroll,
    search = false,
    ...props
}: AppProTableProps<RecordType>) {
    return (
        <ProTable<RecordType, Record<string, any>>
            pagination={false} // để bạn tự quản lý phân trang
            rowKey="id" // mặc định rowKey, có thể override
            search={
                search === false
                    ? false
                    : {
                          layout: 'vertical' as const,
                          ...search,
                          className: cn(
                              'font-semibold !mb-0',
                              search && typeof search === 'object'
                                  ? search.className
                                  : undefined
                          ),
                      }
            }
            {...props}
            cardProps={{
                bodyStyle: { padding: 0 },
                ...props?.cardProps,
            }}
            className={cn(
                '[&_.ant-pro-table-list-toolbar-container]:!p-1 [&_.ant-pro-table-list-toolbar-container]:!px-6',
                props?.className
            )}
            scroll={{
                x: SCREEN.XL,
                ...scroll,
            }}
        />
    );
}
