import { SCREEN } from '@/enums/common';
import { cn } from '@/helpers/common';
import { ProTable, ProTableProps } from '@ant-design/pro-components';
import { ConfigProvider, theme } from 'antd';

export type AppProTableProps<RecordType extends object> = ProTableProps<
    RecordType,
    Record<string, any>
>;

export default function AppProTable<RecordType extends object>({
    scroll,
    search = false,
    ...props
}: AppProTableProps<RecordType>) {
    const { token } = theme.useToken();
    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        headerBorderRadius: 0,
                    },
                },
            }}
        >
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
                headerTitle={
                    <span className="font-semibold">{props?.headerTitle}</span>
                }
                cardProps={{
                    bodyStyle: { padding: 0 },
                    style: { backgroundColor: token.colorBgContainer },
                    ...props?.cardProps,
                }}
                className={cn(
                    '[&_.ant-pro-table-list-toolbar-container]:!px-4 [&_.ant-pro-table-list-toolbar-container]:!py-2',
                    props?.className
                )}
                scroll={{
                    x: SCREEN.XL,
                    ...scroll,
                }}
            />
        </ConfigProvider>
    );
}
