'use client';

import { ConfigProvider, Pagination, theme } from 'antd';

interface NewsPaginationProps {
    current: number;
    pageSize: number;
    total: number;
    onChangePage: (page: number, pageSize: number) => void;
}

export default function NewsPagination({
    current,
    pageSize,
    total,
    onChangePage,
}: NewsPaginationProps) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#71717a',
                    colorBgContainer: '#18181b',
                    colorBorder: '#27272a',
                },
            }}
        >
            <div className="mt-12 flex justify-center">
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page) => onChangePage(page, pageSize)}
                    showSizeChanger={false}
                />
            </div>
        </ConfigProvider>
    );
}
