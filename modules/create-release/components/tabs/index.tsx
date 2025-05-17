import { Tabs, TabsProps } from 'antd';

type Props = Omit<TabsProps, 'items'> & {};

export default function CreateReleaseTabs({ ...props }: Props) {
    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin chính',
            children: <div className="p-4">Thông tin chính của phát hành</div>,
        },
        {
            key: '2',
            label: 'Bài hát',
            children: <div className="p-4">Danh sách bài hát</div>,
        },
        {
            key: '3',
            label: 'Lịch phát hành',
            children: <div className="p-4">Lịch phát hành</div>,
        },
        {
            key: '4',
            label: 'Đánh giá',
            children: <div className="p-4">Đánh giá phát hành</div>,
        },
    ];
    return (
        <div className="px-4">
            <Tabs items={tabItems} {...props} />
        </div>
    );
}
